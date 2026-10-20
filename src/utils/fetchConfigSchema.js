import { cloneDeep } from 'lodash-es';
import { getRequestBody } from './swagger/parse';

// unwindType() keeps accepting the .NET type names the views always passed
// The config schemas are read from the request bodies the UI posts them with, which is where ASF inlines them in its OpenAPI document
const configSchemas = {
  'ArchiSteamFarm.Steam.Storage.BotConfig': { path: '/Api/Bot/{botNames}', property: 'BotConfig' },
  'ArchiSteamFarm.Storage.GlobalConfig': { path: '/Api/ASF', property: 'GlobalConfig' },
};

const numericFormats = {
  uint8: 'byte',
  uint16: 'uint16',
  uint32: 'uint32',
  uint64: 'uint64',
};

// CLR key types ASF reports for dictionaries in x-key-type
const keyTypes = {
  'System.Boolean': 'boolean',
  'System.Byte': 'byte',
  'System.Guid': 'string',
  'System.String': 'string',
  'System.UInt16': 'uint16',
  'System.UInt32': 'uint32',
  'System.UInt64': 'uint64',
};

// Constraints carried over from the OpenAPI schema for future use (#1445, #1650), not consumed by the editor yet
const passthroughKeys = {
  'minimum': 'minimum',
  'maximum': 'maximum',
  'maxItems': 'maxItems',
  'x-valid-values': 'validValues',
  'x-security-critical': 'securityCritical',
};

function getTypes(schema) {
  if (Array.isArray(schema.type)) return schema.type;
  return (schema.type) ? [schema.type] : [];
}

function resolveType(schema) {
  // Enums carry their name → value map in x-definition, either as $ref'ed component schemas (already dereferenced) or inlined
  if (schema['x-definition']) {
    return { type: (schema.format === 'flags') ? 'flag' : 'enum', values: { ...schema['x-definition'] } };
  }

  const types = getTypes(schema);
  const nullable = (types.includes('null')) ? { nullable: true } : {};

  if (Object.prototype.hasOwnProperty.call(numericFormats, schema.format)) return { type: numericFormats[schema.format], ...nullable };

  // Guid is edited as a plain string, same as before the OpenAPI migration
  if (schema.format === 'uuid') return { type: 'string', ...nullable };

  if (types.includes('boolean')) return { type: 'boolean', ...nullable };
  if (types.includes('string')) return { type: 'string', ...nullable };

  if (types.includes('array')) {
    // ASF marks sets with uniqueItems, every other collection is an ordered list
    return {
      type: (schema.uniqueItems) ? 'hashSet' : 'list',
      values: resolveType(schema.items || {}),
      ...nullable,
    };
  }

  if (types.includes('object') && schema.additionalProperties) {
    return {
      type: 'dictionary',
      key: { type: keyTypes[schema['x-key-type']] || 'unknown' },
      value: resolveType(schema.additionalProperties),
      ...nullable,
    };
  }

  return { type: 'unknown' };
}

function resolvePassthrough(schema) {
  const passthrough = {};

  Object.keys(passthroughKeys).forEach(key => {
    if (typeof schema[key] !== 'undefined') passthrough[passthroughKeys[key]] = cloneDeep(schema[key]);
  });

  return passthrough;
}

function resolveDefaultValue(schema) {
  // ASF never reveals the current value of security-critical properties, so the UI can't tell whether one is set
  // They get no default: an untouched field then stays out of the request and ASF keeps the existing value, while a null would clear it
  if (schema['x-security-critical']) return undefined;
  return cloneDeep(schema.default);
}

async function unwindType(type) {
  const configSchema = configSchemas[type];
  if (!configSchema) throw new Error(`No OpenAPI schema known for type ${type}`);

  const requestBody = await getRequestBody(configSchema.path);
  const { [configSchema.property]: schema } = requestBody.properties;
  if (!schema?.properties) throw new Error(`No ${configSchema.property} schema in ${configSchema.path} request body`);

  const resolvedStructure = {
    type: 'object',
    body: {},
  };

  Object.keys(schema.properties).forEach(param => {
    // uint64 properties are listed twice, the "s_" copy is the string representation ASF serializes to avoid precision loss in JS
    // We derive paramName from the numeric property instead of exposing the copy as a separate field
    if (param.startsWith('s_')) return;

    const propertySchema = schema.properties[param];
    const resolvedType = resolveType(propertySchema);
    const paramName = (resolvedType.type !== 'uint64') ? param : `s_${param}`;

    resolvedStructure.body[param] = {
      defaultValue: resolveDefaultValue(propertySchema),
      paramName,
      param,
      ...resolvedType,
      ...resolvePassthrough(propertySchema),
    };
  });

  return resolvedStructure;
}

export default unwindType;
