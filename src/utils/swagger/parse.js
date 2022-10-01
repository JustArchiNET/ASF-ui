import axios from 'axios';
import { dereference } from './dereference';

const endpoint = '/swagger/ASF/swagger.json';
let schema;

async function getSchema() {
  if (schema) return schema;

  // We save the PROMISE, not the VALUE, in a variable.
  // This is very important, as ALL future calls will retrieve this promise (including those made while promise is still pending).
  // Such approach, ensures no duplicated HTTP calls are made.
  schema = axios.get(endpoint)
    .then(response => response.data)
    .then(schema => dereference(schema));

  return schema;
}

export async function getType(name) {
  const schema = await getSchema();
  const { [name]: type } = schema.components.schemas;
  return type.properties;
}

export async function getDefinitions(name) {
  const schema = await getSchema();
  return schema.components.schemas[name]['x-definition'];
}
