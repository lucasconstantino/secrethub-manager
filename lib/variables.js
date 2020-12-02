const { prompt } = require("enquirer");
const config = require("../lib/config");

const options = { type: "select", required: true };

/**
 * Load config variable from env or prompt it.
 */
const ensure = async (name) =>
  process.env[`SECRETHUB_VAR_${name.toUpperCase()}`] ||
  (await prompt({ ...options, ...config.variables[name], name }))[name];

/**
 * Load all config variables from env or prompt them.
 */
const all = async () =>
  Promise.all(
    Object.keys(config.variables).map(async (name) => [
      name,
      await ensure(name),
    ])
  );

module.exports = { all, ensure };
