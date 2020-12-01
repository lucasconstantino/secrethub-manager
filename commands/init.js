const { execSync } = require("child_process");
const { Command } = require("commander");
const { prompt } = require("enquirer");
const config = require("../lib/config");
const credential = require("../lib/credential");

module.exports = new Command()
  .command("init")
  .description("Setup .env file from a template")
  .action(async () => {
    const variables = [];

    for (const [name, variable] of Object.entries(config.variables)) {
      const envName = `SECRETHUB_MANAGER_${name.toUpperCase()}`;

      variables.push(
        `--var ${name}=${
          process.env[envName] ||
          (await prompt({ ...variable, type: "select", required: true, name }))[
            name
          ]
        }`
      );
    }

    execSync(
      `SECRETHUB_CREDENTIAL=${await credential()} secrethub inject --no-prompt ${variables.join(
        " "
      )} -i ${config.template} > ${config.target}`,
      { stdio: "inherit" }
    );
  });
