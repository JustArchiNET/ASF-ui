const config = require('./config.prod');

config.devtool = false;
config.stats = 'minimal';

module.exports = config;
