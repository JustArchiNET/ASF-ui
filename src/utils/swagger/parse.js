import axios from 'axios';
import { dereference } from './dereference';

const endpoint = 'http://localhost:8080/swagger/ASF/swagger.json';

export async function getTypes() {
  return await axios.get(endpoint)
    .then(response => response.data)
    .then(schema => dereference(schema))
    .then(schema => schema.components.schemas);
}

export async function getType(name) {
  const { [name]: type } = await getTypes();
  return type.properties;
}
