const { secrethub } = require(process.cwd() + "/package.json");

const { SECRETHUB_MANAGER_TEMPLATE, SECRETHUB_MANAGER_OUT } = process.env;

module.exports = {
  variables: {},
  template: SECRETHUB_MANAGER_TEMPLATE || "secrethub.env",
  out: SECRETHUB_MANAGER_OUT || ".env",
  // overrides
  ...secrethub,
};
