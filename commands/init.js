const { execSync } = require("child_process");
const { Command } = require("commander");
const config = require("../lib/config");
const { signed } = require("../lib/credential");
const variables = require("../lib/variables");

module.exports = new Command()
  .command("init")
  .description("Setup .env file from a template")
  .action(async () => {
    const vars = (await variables.all()).map(
      ([name, value]) => `--var ${name}=${value}`
    );

    execSync(
      `secrethub inject --no-prompt ${vars.join(" ")} -i ${config.template} > ${
        config.target
      }`,
      { stdio: "inherit", env: await signed() }
    );
  });
