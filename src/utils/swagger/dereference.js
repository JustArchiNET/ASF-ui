import { cloneDeep, get, isObject } from 'lodash-es';

function isRef(node) {
  return node?.$ref;
}

function resolveRef(path, schema) {
  const lodashPath = path.substr(2).replace(/\//g, '.');
  return get(schema, lodashPath);
}

function resolve(tree, schema, resolved = new WeakSet()) {
  if (resolved.has(tree)) return; // Prevent infinite loop
  resolved.add(tree);

  for (const key of Object.keys(tree)) {
    if (isRef(tree[key])) tree[key] = resolveRef(tree[key].$ref, schema);
    if (isObject(tree[key])) resolve(tree[key], schema, resolved);
  }
}

export function dereference(schema) {
  const localSchema = cloneDeep(schema);
  resolve(localSchema, localSchema);
  return localSchema;
}
