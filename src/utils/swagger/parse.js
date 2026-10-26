import axios from 'axios';
import { dereference } from './dereference';

const endpoint = `${window.__BASE_PATH__ ?? '/'}swagger/ASF/swagger.json`;
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

// ASF may inline a schema where it's used or reference it from components, depending on the version and the usage,
// so schemas must always be looked up through the operation that uses them and never by component name
async function getOperation(path, method) {
  const schema = await getSchema();
  const operation = schema.paths[path]?.[method];
  if (!operation) throw new Error(`No ${method.toUpperCase()} ${path} operation in OpenAPI document`);
  return operation;
}

export async function getRequestBody(path, method = 'post') {
  const operation = await getOperation(path, method);
  return operation.requestBody.content['application/json'].schema;
}

export async function getResponseBody(path, method = 'get', status = '200') {
  const operation = await getOperation(path, method);
  return operation.responses[status].content['application/json'].schema;
}
