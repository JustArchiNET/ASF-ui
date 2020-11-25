const path = require('path');

const { DefinePlugin } = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackBeforeBuildPlugin = require('before-build-webpack');

const generateFlags = require('../scripts/generateFlags');
const getCommitHash = require('../scripts/getCommitHash');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    main: './src/index.js',
  },
  output: {
    filename: 'scripts/[name].bundle.js',
    chunkFilename: 'scripts/[id].[chunkhash:7].chunk.js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: { browsers: ['> 1%', 'not ie <= 11'] },
                modules: false,
              }],
            ],
            plugins: ['@babel/plugin-syntax-dynamic-import'],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              esModule: false,
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              esModule: false,
            },
          },
        ],
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac|woff2?|eot|ttf|otf|png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: 'media/[name].[hash:7].[ext]',
          },
        },
      },
    ],
  },
  plugins: [
    new WebpackBeforeBuildPlugin((stats, callback) => {
      generateFlags();
      callback();
    }),
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
    new DefinePlugin(({
      APP_HASH: JSON.stringify(getCommitHash()),
    })),
  ],
  devServer: {
    contentBase: './src/static',
    watchOptions: {
      ignored: /generated/,
    },
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:1242',
        ws: true,
      },
    },
    open: true,
  },
};
