import axios from 'axios';
// eslint-disable-next-line import/named
import { dereference } from './dereference';

const endpoint = 'http://localhost:8080/swagger/ASF/swagger.json';
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

// eslint-disable-next-line import/prefer-default-export
export async function getType(name) {
  const schema = await getSchema();
  const { [name]: type } = schema.components.schemas;
  return type.properties;
}
