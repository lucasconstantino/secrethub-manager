const path = require("path");
const { execSync } = require("child_process");
const { Command } = require("commander");
const config = require("../lib/config");
const secrethub = require("../lib/secrethub");
const { signed } = require("../lib/credential");
const variables = require("../lib/variables");

module.exports = new Command()
  .command("init")
  .description("Setup env file from a template")
  .option(
    "-t, --template <template>",
    "SecretHub template file",
    config.template
  )
  .option("-f, --file <file>", "Output env file", config.file)
  .action(async ({ template, file }) => {
    const paths = {
      template: path.resolve(process.cwd(), template),
      file: path.resolve(process.cwd(), file),
    };

    const vars = (await variables.all()).map(
      ([name, value]) => `--var ${name}=${value}`
    );

    execSync(
      `${secrethub} inject --no-prompt ${vars.join(" ")} -i ${
        paths.template
      } > ${paths.file}`,
      { stdio: "inherit", env: await signed() }
    );
  });
