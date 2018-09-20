import { get } from './http';

const cachedTypeDefinitions = new Map();
const cachedStructureDefinitions = new Map();

const subtypeRegex = /\[[^\]]+]/g;

function resolveSubtypes(type) {
	return type.match(subtypeRegex).map(subtype => subtype.slice(1, subtype.length - 1));
}

async function getStructureDefinition(type) {
	if (cachedStructureDefinitions.has(type)) return cachedStructureDefinitions.get(type);

	const structureDefinition = get(`Structure/${encodeURIComponent(type)}`);
	cachedStructureDefinitions.set(type, structureDefinition);

	return structureDefinition;
}

async function getTypeDefinition(type) {
	if (cachedTypeDefinitions.has(type)) return cachedTypeDefinitions.get(type);

	const typeDefinition = get(`Type/${encodeURIComponent(type)}`);
	cachedTypeDefinitions.set(type, typeDefinition);

	return typeDefinition;
}

async function resolveType(type) {
	switch (type.split('`')[0]) {
		case 'System.Boolean':
			return { type: 'boolean' };
		case 'System.String':
			return { type: 'string' };
		case 'System.Byte':
			return { type: 'tinyNumber' };
		case 'System.UInt32':
			return { type: 'number' };
		case 'System.UInt16':
			return { type: 'smallNumber' };
		case 'System.Collections.Generic.HashSet':
		case 'System.Collections.Immutable.ImmutableHashSet':
			const [subtype] = resolveSubtypes(type);
			return { type: 'hashSet', values: await resolveType(subtype) };
		case 'System.UInt64':
			return { type: 'bigNumber' };
		case 'System.Collections.Generic.Dictionary':
		case 'System.Collections.Immutable.ImmutableDictionary':
			const subtypes = resolveSubtypes(type);
			return { type: 'dictionary', key: await resolveType(subtypes[0]), value: await resolveType(subtypes[1]) };
		default: // Complex type
			return unwindType(type);
	}
}

async function unwindObject(type, typeDefinition) {
	const resolvedStructure = {
		type: 'object',
		body: {}
	};

	const [structureDefinition, resolvedTypes] = await Promise.all([
		getStructureDefinition(type),
		Promise.all(Object.keys(typeDefinition.Body).map(async param => ({ param, type: await resolveType(typeDefinition.Body[param]) })))
	]);

	for (const { param, type } of resolvedTypes) {
		const paramName = typeDefinition.Body[param] !== 'System.UInt64' ? param : `s_${param}`;

		resolvedStructure.body[param] = {
			defaultValue: structureDefinition[param],
			paramName,
			param,
			...type
		};
	}

	return resolvedStructure;
}

function parseEnumValues(rawValues) {
	const enumValues = {};

	for (const key of Object.keys(rawValues)) {
		enumValues[key] = parseInt(rawValues[key], 10);
	}

	return enumValues;
}

async function unwindType(type) {
	if (type === 'ArchiSteamFarm.BotConfig') getStructureDefinition(type); // Dirty trick, but 30% is 30%
	const typeDefinition = await getTypeDefinition(type);

	switch (typeDefinition.Properties.BaseType) {
		case 'System.Object':
			return unwindObject(type, typeDefinition);
		case 'System.Enum':
			return {
				type: (typeDefinition.Properties.CustomAttributes || []).includes('System.FlagsAttribute') ? 'flag' : 'enum',
				values: parseEnumValues(typeDefinition.Body)
			};
		default:
			const structureDefinition = await getStructureDefinition(type);
			return { type: 'unknown', typeDefinition, structureDefinition };
	}
}

export default unwindType;
