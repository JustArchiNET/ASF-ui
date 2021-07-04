/* eslint-disable */
const proxy = require('redbird')({ port: 5000 });
proxy.register('127.0.0.1/ASF', 'http://127.0.0.1:1242/ASF');
