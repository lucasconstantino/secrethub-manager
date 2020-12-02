const path = require("path");

module.exports = `${path.dirname(
  require.resolve("@secrethub/cli/package.json")
)}/bin/secrethub`;
