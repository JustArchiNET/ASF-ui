const config = require('./config.prod');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

config.plugins.push(new BundleAnalyzerPlugin());

module.exports = config;
