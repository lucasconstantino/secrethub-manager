const { execSync } = require("child_process");
const { Command } = require("commander");
const { prompt } = require("enquirer");

const readCredentials = require("../lib/credential");
const config = require("../lib/config");

const { SECRETHUB_CREDENTIAL } = process.env;

const prompts = {
  credential: {
    type: "password",
    name: "credential",
    required: true,
    message: "No secrethub credential found. Please, provide one:",
  },
};

module.exports = new Command()
  .command("init")
  .description("Setup .env file from a template")
  .action(async () => {
    const credential =
      SECRETHUB_CREDENTIAL ||
      readCredentials() ||
      (await prompt(prompts.credential));

    const variables = [];

    for (const [name, variable] of Object.entries(config.variables)) {
      const envName = `SECRETHUB_MANAGER_${name.toUpperCase()}`;

      variables.push(
        `--var ${name}=${
          process.env[envName] ||
          (await prompt({ ...variable, required: true, name }))[name]
        }`
      );
    }

    execSync(
      `SECRETHUB_CREDENTIAL=${credential} secrethub inject --no-prompt ${variables.join(
        " "
      )} -i secrethub.env > ./.env`,
      { stdio: "inherit" }
    );
  });
