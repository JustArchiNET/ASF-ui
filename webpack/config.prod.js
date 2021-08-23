const { SubresourceIntegrityPlugin } = require('webpack-subresource-integrity');
const WebpackBeforeBuildPlugin = require('before-build-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const generateFlags = require('../scripts/generateFlags');

const config = require('./config');

delete config.devServer;

config.mode = 'production';
config.devtool = 'source-map';

config.plugins.unshift(new WebpackBeforeBuildPlugin((stats, callback) => {
  generateFlags();
  callback();
}));

config.plugins.push(new CopyWebpackPlugin({
  patterns: [{
    from: './src/static',
    to: './',
  }],
}));

config.plugins.push(new SubresourceIntegrityPlugin({
  hashFuncNames: ['sha256', 'sha384'],
}));

config.performance = {
  maxEntrypointSize: 500000,
  maxAssetSize: 500000,
};

module.exports = config;
