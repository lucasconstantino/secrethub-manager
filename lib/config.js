const { secrethub } = require(process.cwd() + "/package.json");

const config = secrethub || {};
config.variables = config.variables || {};

module.exports = secrethub;
