import * as http from '../plugins/http';
import { getType } from './swagger/parse';

const cachedStructureDefinitions = new Map();

// unwindType() keeps accepting the .NET type names the views always passed; they're mapped to OpenAPI component schemas here
const schemaNames = {
  'ArchiSteamFarm.Steam.Storage.BotConfig': 'BotConfig',
  'ArchiSteamFarm.Storage.GlobalConfig': 'GlobalConfig',
};

// OpenAPI describes every collection as "array", but ASF uses ImmutableList (ordered) for these properties and ImmutableHashSet for all others
// Verified against /Api/Type of ASF 6.3.9.6
const orderedListProperties = new Set(['FarmingOrders', 'GamesPlayedWhileIdle']);

// OpenAPI describes every dictionary key as a string, but ASF uses ImmutableDictionary<ulong, ...> for these properties
// Verified against /Api/Type of ASF 6.3.9.6
const uint64KeyedProperties = new Set(['SteamUserPermissions']);

const numericFormats = {
  uint8: 'byte',
  uint16: 'uint16',
  uint32: 'uint32',
  uint64: 'uint64',
};

// Constraints carried over from the OpenAPI schema for future use (#1445, #1650), not consumed by the editor yet
const passthroughKeys = {
  'minimum': 'minimum',
  'maximum': 'maximum',
  'maxItems': 'maxItems',
  'x-valid-values': 'validValues',
  'x-security-critical': 'securityCritical',
};

async function getStructureDefinition(type) {
  if (cachedStructureDefinitions.has(type)) return cachedStructureDefinitions.get(type);

  const structureDefinition = http.get(`structure/${encodeURIComponent(type)}`);
  cachedStructureDefinitions.set(type, structureDefinition);

  return structureDefinition;
}

function getTypes(schema) {
  if (Array.isArray(schema.type)) return schema.type;
  return (schema.type) ? [schema.type] : [];
}

function resolveType(schema, param) {
  const types = getTypes(schema);
  const nullable = (types.includes('null')) ? { nullable: true } : {};

  // Enums are $ref'ed component schemas (already dereferenced) carrying their name → value map in x-definition
  if (schema['x-definition']) {
    return { type: (schema.format === 'flags') ? 'flag' : 'enum', values: { ...schema['x-definition'] } };
  }

  if (Object.prototype.hasOwnProperty.call(numericFormats, schema.format)) return { type: numericFormats[schema.format], ...nullable };

  // Guid is edited as a plain string, same as before the OpenAPI migration
  if (schema.format === 'uuid') return { type: 'string', ...nullable };

  if (types.includes('boolean')) return { type: 'boolean', ...nullable };
  if (types.includes('string')) return { type: 'string', ...nullable };

  if (types.includes('array')) {
    return {
      type: (orderedListProperties.has(param)) ? 'list' : 'hashSet',
      values: resolveType(schema.items || {}),
      ...nullable,
    };
  }

  if (types.includes('object') && schema.additionalProperties) {
    return {
      type: 'dictionary',
      key: { type: (uint64KeyedProperties.has(param)) ? 'uint64' : 'string' },
      value: resolveType(schema.additionalProperties),
      ...nullable,
    };
  }

  return { type: 'unknown' };
}

function resolvePassthrough(schema) {
  const passthrough = {};

  Object.keys(passthroughKeys).forEach(key => {
    if (typeof schema[key] !== 'undefined') passthrough[passthroughKeys[key]] = schema[key];
  });

  return passthrough;
}

async function unwindType(type) {
  const schemaName = schemaNames[type];
  if (!schemaName) throw new Error(`No OpenAPI schema known for type ${type}`);

  const [properties, structureDefinition] = await Promise.all([
    getType(schemaName),
    getStructureDefinition(type),
  ]);

  const resolvedStructure = {
    type: 'object',
    body: {},
  };

  Object.keys(properties).forEach(param => {
    // uint64 properties are listed twice, the "s_" copy is the string representation ASF serializes to avoid precision loss in JS
    // We derive paramName from the numeric property instead of exposing the copy as a separate field
    if (param.startsWith('s_')) return;

    const resolvedType = resolveType(properties[param], param);
    const paramName = (resolvedType.type !== 'uint64') ? param : `s_${param}`;

    resolvedStructure.body[param] = {
      defaultValue: structureDefinition[param],
      paramName,
      param,
      ...resolvedType,
      ...resolvePassthrough(properties[param]),
    };
  });

  return resolvedStructure;
}

export default unwindType;
