import axios from 'axios';

const baseURL = localStorage.getItem('ipc-base-url');
const password = localStorage.getItem('ipc-password');

export default axios.create({
  baseURL: baseURL ? `${baseURL}/Api` : '/Api',
  headers: {
    Authentication: password
  }
});
