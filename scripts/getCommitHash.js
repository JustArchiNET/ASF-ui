const { execSync } = require('child_process');

module.exports = function getCommitHash() {
  try {
    let hash = execSync('git rev-parse --short=7 HEAD').toString().trim();
    return hash.padStart(7, '0');
  } catch (err) {
    return '0000000';
  }
};