const CopyWebpackPlugin = require('copy-webpack-plugin');
const config = require('./config');

delete config.devServer;

config.mode = 'production';
config.devtool = 'source-map';

config.plugins.push(new CopyWebpackPlugin({
  patterns: [{
    from: './src/static',
    to: './',
  }],
}));

config.performance = {
  maxEntrypointSize: 500000,
  maxAssetSize: 500000,
};

module.exports = config;
