const { execSync } = require('child_process');

module.exports = function getCommitHash() {
	try {
		execSync('git rev-parse --short HEAD').toString();
	} catch (err) {
		return '0000000';
	}
};
