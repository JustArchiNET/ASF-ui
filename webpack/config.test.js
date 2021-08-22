const config = require('./config');

config.devServer = {
  onListening(devServer) {
    if (!devServer) {
      throw new Error('webpack-dev-server is not defined');
    }

    devServer.stopCallback(() => {
      console.log('Stopped dev environment');
    });
  },
};

module.exports = config;
