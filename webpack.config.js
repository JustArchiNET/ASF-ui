const path = require('path');

const { VueLoaderPlugin } = require('vue-loader');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin } = require('webpack');

const fetchCommands = require('./scripts/fetchCommands');

module.exports = async (env, argv) => {
  const isProd = env === 'production';

  return {
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? 'source-maps' : 'inline-source-map',
    entry: './src/index.js',
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist')
    },
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
        '/Api': {
          target: 'http://localhost:1242',
          ws: true
        }
      }
    },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new DefinePlugin({
        'ASF_COMMANDS': JSON.stringify(await fetchCommands()),
        'TEST': '"test"'
      }),
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        favicon: 'src/images/favicon.png'
      })
    ]
  };
};