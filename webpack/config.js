const path = require('path');

const { DefinePlugin } = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackBeforeBuildPlugin = require('before-build-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const generateFlags = require('../scripts/generateFlags');
const getCommitHash = require('../scripts/getCommitHash');

module.exports = {
  mode: 'development',
  devServer: {
    // before: require("./dev-server.middleware"),
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      // Apply the custom middleware from dev-server.middleware.js
      const customMiddleware = require('./dev-server.middleware');
      customMiddleware(devServer.app);

      return middlewares;
    },
    historyApiFallback: true,
    open: true,
    proxy: [
      {
        context: ['/api', '/swagger'],
        target: 'http://localhost:1242',
        ws: true,
        secure: false,
        changeOrigin: true,
        logLevel: 'debug',
        onError: (err, req, res) => {
          console.warn('Proxy error:', err);
        },
        onProxyReq: (proxyReq, req, res) => {
          console.log('Proxying request to:', req.path);
        },
        proxyTimeout: 30000, // 30 seconds
        timeout: 30000, // 30 seconds
        headers: {
          Connection: 'keep-alive',
        },
      },
    ],
    static: {
      directory: './src/static',
    },
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    compress: true,
    hot: true,
    liveReload: true,
  },
  devtool: 'inline-source-map',
  entry: {
    main: './src/index.js',
  },
  output: {
    filename: 'scripts/[name].[contenthash:7].bundle.js',
    chunkFilename: 'scripts/[id].[contenthash:7].chunk.js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    crossOriginLoading: 'anonymous',
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
              [
                '@babel/preset-env',
                {
                  targets: { browsers: ['> 1%', 'not ie <= 11'] },
                  modules: false,
                },
              ],
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
            name: 'media/[name].[contenthash:7][ext]',
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
    new DefinePlugin({
      APP_HASH: JSON.stringify(getCommitHash()),
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  watchOptions: {
    ignored: /generated/,
  },
};
