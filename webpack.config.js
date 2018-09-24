const path = require('path');

const { VueLoaderPlugin } = require('vue-loader');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = async (env, argv) => {
  const isProd = env === 'production';
  const isDeploy = !!argv.deploy;

  return {
    mode: isProd ? 'production' : 'development',
    devtool: !isProd ? 'inline-source-map' : isDeploy ? '(none)' : 'source-map',
    entry: {
    	main: './src/index.js'
		},
    output: {
      filename: 'scripts/[name].bundle.js',
			chunkFilename: 'scripts/[id].chunk.js',
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
    devServer: {
      contentBase: './dist',
      historyApiFallback: true,
      proxy: {
      	'/ASF/api': {
					target: 'http://localhost:1242',
					ws: true,
					pathRewrite: {
						'^/ASF/api' : '/api'
					}
				},
        '/api': {
          target: 'http://localhost:1242',
          ws: true
        }
      }
    },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new VueLoaderPlugin(),
			new CopyWebpackPlugin([
				'src/include'
			])
    ]
  };
};
