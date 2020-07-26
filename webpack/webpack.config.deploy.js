const config = require('./webpack.config.prod');

config.devtool = '(none)';
config.stats = 'minimal';

module.exports = config;
