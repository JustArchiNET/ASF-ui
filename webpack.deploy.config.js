const config = require('./webpack.prod.config');

config.devtool = '(none)';
config.stats = 'minimal';

module.exports = config;
