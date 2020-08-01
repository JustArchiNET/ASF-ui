const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const config = require('./config.prod');

config.plugins.push(new BundleAnalyzerPlugin());

module.exports = config;
