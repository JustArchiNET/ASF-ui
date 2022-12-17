import * as http from '../plugins/http';

const cachedTypeDefinitions = new Map();
const cachedStructureDefinitions = new Map();

const subtypeRegex = /\[[^\]]+]/g;

function resolveSubtypes(type) {
  const subtypes = type.match(subtypeRegex);
  if (!subtypes) return [];
  return subtypes.map(subtype => subtype.slice(1, subtype.length - 1));
}

async function getStructureDefinition(type) {
  if (cachedStructureDefinitions.has(type)) return cachedStructureDefinitions.get(type);

  const structureDefinition = http.get(`structure/${encodeURIComponent(type)}`);
  cachedStructureDefinitions.set(type, structureDefinition);

  return structureDefinition;
}

async function getTypeDefinition(type) {
  if (cachedTypeDefinitions.has(type)) return cachedTypeDefinitions.get(type);

  const typeDefinition = http.get(`type/${encodeURIComponent(type)}`);
  cachedTypeDefinitions.set(type, typeDefinition);

  return typeDefinition;
}

async function resolveType(targetType) {
  const subtypes = resolveSubtypes(targetType);

  switch (targetType.split('`')[0]) {
    case 'System.Boolean':
      return { type: 'boolean' };
    case 'System.String':
    case 'System.Guid':
      return { type: 'string' };
    case 'System.Byte':
      return { type: 'byte' };
    case 'System.UInt32':
      return { type: 'uint32' };
    case 'System.UInt16':
      return { type: 'uint16' };
    case 'System.Collections.Generic.HashSet':
    case 'System.Collections.Immutable.ImmutableHashSet':
      return { type: 'hashSet', values: await resolveType(subtypes[0]) };
    case 'System.Collections.Immutable.ImmutableList':
      return { type: 'list', values: await resolveType(subtypes[0]) };
    case 'System.UInt64':
      return { type: 'uint64' };
    case 'System.Collections.Generic.Dictionary':
    case 'System.Collections.Immutable.ImmutableDictionary':
      return { type: 'dictionary', key: await resolveType(subtypes[0]), value: await resolveType(subtypes[1]) };
    case 'System.Nullable':
      const { type } = await resolveType(subtypes[0]);
      return { type, nullable: true };
    default: // Complex type
      return unwindType(targetType);
  }
}

async function unwindObject(type, typeDefinition) {
  const resolvedStructure = {
    type: 'object',
    body: {},
  };

  const [structureDefinition, resolvedTypes] = await Promise.all([
    getStructureDefinition(type),
    Promise.all(Object.keys(typeDefinition.Body).map(async param => ({ param, type: await resolveType(typeDefinition.Body[param]) }))),
  ]);

  resolvedTypes.forEach(resolvedType => {
    const { param, type } = resolvedType;
    const paramName = (typeDefinition.Body[param] !== 'System.UInt64') ? param : `s_${param}`;

    resolvedStructure.body[param] = {
      defaultValue: structureDefinition[param],
      paramName,
      param,
      ...type,
    };
  });

  return resolvedStructure;
}

function parseEnumValues(rawValues) {
  const enumValues = {};

  Object.keys(rawValues).forEach(key => {
    enumValues[key] = parseInt(rawValues[key], 10);
  });

  return enumValues;
}

async function unwindType(type) {
  if (type === 'ArchiSteamFarm.Steam.Storage.BotConfig') getStructureDefinition(type); // Dirty trick, but 30% is 30%
  const typeDefinition = await getTypeDefinition(type);

  switch (typeDefinition.Properties.BaseType) {
    case 'System.Object':
      return unwindObject(type, typeDefinition);
    case 'System.Enum':
      return {
        type: ((typeDefinition.Properties.CustomAttributes || []).includes('System.FlagsAttribute')) ? 'flag' : 'enum',
        values: parseEnumValues(typeDefinition.Body),
      };
    default: {
      const structureDefinition = await getStructureDefinition(type);
      return { type: 'unknown', typeDefinition, structureDefinition };
    }
  }
}

export default unwindType;
