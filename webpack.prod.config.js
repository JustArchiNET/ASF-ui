const config = require('./webpack.config');
const CopyWebpackPlugin = require('copy-webpack-plugin');

delete config.devServer;

config.mode = 'production';
config.devtool = 'source-map';

config.plugins.push(new CopyWebpackPlugin({
	patterns: [{
		from: './src/static',
		to: './'
	}]
}));

module.exports = config;
