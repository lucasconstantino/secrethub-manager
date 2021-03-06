const { secrethub } = require(process.cwd() + "/package.json");

const { SECRETHUB_MANAGER_TEMPLATE, SECRETHUB_MANAGER_OUT } = process.env;

module.exports = {
  path: "",
  variables: {},
  template: SECRETHUB_MANAGER_TEMPLATE || "secrethub.env",
  file: SECRETHUB_MANAGER_OUT || ".env",
  // overrides
  ...secrethub,
};
