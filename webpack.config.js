const path = require('path');

const { VueLoaderPlugin } = require('vue-loader');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserWebpackPlugin = require('terser-webpack-plugin');
const DefinePlugin = require('webpack').DefinePlugin;
const exec = require('child_process').exec;
const WebpackBeforeBuildPlugin = require('before-build-webpack');

const generateFlags = require('./scripts/generateFlags');

async function getGitCommitHash() {
	return new Promise((resolve, reject) => {
		exec('git rev-parse HEAD', (err, out) => {
			if (err) return reject(err);
			return resolve(out.trim());
		});
	});
}

async function getVersion() {
	return getGitCommitHash().catch(err => 'no-git');
}

module.exports = async (env, argv) => {
	const isProd = env === 'production';
	const isDeploy = !!argv.deploy;
	const analyze = !!argv.analyze;

	const config = {
		mode: isProd ? 'production' : 'development',
		devtool: !isProd ? 'inline-source-map' : isDeploy ? '(none)' : 'source-map',
		entry: {
			main: './src/index.js'
		},
		output: {
			filename: 'scripts/[name].bundle.js',
			chunkFilename: 'scripts/[id].[chunkhash:7].chunk.js',
			path: path.resolve(__dirname, 'dist'),
			publicPath: '/'
		},
		stats: !isProd ? 'verbose' : isDeploy ? 'minimal' : 'normal',
		module: {
			rules: [
				{
					test: /\.vue$/,
					loader: 'vue-loader'
				},
				{
					test: /\.jsx?$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: [
								['@babel/preset-env', { 'targets': { 'browsers': ['> 1%', 'not ie <= 11'] }, 'modules': false }]
							],
							plugins: ['@babel/plugin-syntax-dynamic-import']
						}
					}
				},
				{
					test: /\.scss$/,
					use: [
						'vue-style-loader',
						'css-loader',
						'sass-loader'
					]
				},
				{
					test: /\.css$/,
					use: [
						'vue-style-loader',
						'css-loader'
					]
				},
				{
					test: /\.(mp4|webm|ogg|mp3|wav|flac|aac|woff2?|eot|ttf|otf|png|jpe?g|gif|svg)(\?.*)?$/,
					use: {
						loader: 'url-loader',
						options: {
							limit: 8192,
							name: 'media/[name].[hash:7].[ext]'
						}
					}
				}
			]
		},
		plugins: [
			new WebpackBeforeBuildPlugin((stats, callback) => {
				generateFlags();
				callback();
			}),
			new CleanWebpackPlugin(['dist']),
			new VueLoaderPlugin(),
			new CopyWebpackPlugin(['src/include']),
			new DefinePlugin({
				APP_VERSION: JSON.stringify(await getVersion()),
				SENTRY_DSN: JSON.stringify('https://e93b07e78df747708403e423ebc5e97e@sentry.io/1312571'),
				APP_DEBUG: JSON.stringify(!isProd)
			})
		],
		optimization: {

		}
	};

	if (isProd) {
		config.optimization = {
			minimize: true,
			minimizer: [
				new TerserWebpackPlugin({
					cache: true,
					parallel: true
				})
			]
		}
	}

	if (!isProd) config.devServer = {
		contentBase: './dist',
		historyApiFallback: true,
		proxy: {
			'/api': {
				target: 'http://localhost:1242',
				ws: true
			}
		}
	};

	if (analyze) config.plugins.push(new BundleAnalyzerPlugin());

	return config;
};
