const config = require('./config');

config.devServer.onListening = function stopDevServer(devServer) {
  if (!devServer) {
    throw new Error('webpack-dev-server is not defined');
  }

  devServer.stopCallback(() => {
    console.log('Stopped dev server');
  });
};

module.exports = config;
