const { execSync } = require('child_process');

module.exports = function getCommitHash() {
  try {
    return execSync('git rev-parse --short=7 HEAD').toString();
  } catch (err) {
    return '0000000';
  }
};
