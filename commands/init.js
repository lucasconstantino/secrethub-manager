const fs = require("fs");
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
  .option("-s, --skip", "Skip if output env file already exists", false)
  .option("-w, --wait", "Wait for @secrethub/cli install", false)
  .action(async ({ template, file, skip, wait }) => {
    const paths = {
      template: path.resolve(process.cwd(), template),
      file: path.resolve(process.cwd(), file),
    };

    if (wait) await secrethub.ready();

    console.log(`> Initializing environment file ${file}`);

    if (skip && fs.existsSync(paths.file)) return;

    const vars = (await variables.all()).map(
      ([name, value]) => `--var ${name}=${value}`
    );

    execSync(
      `${secrethub.bin} inject --no-prompt ${vars.join(" ")} -i ${
        paths.template
      } > ${paths.file}`,
      { stdio: "inherit", env: await signed() }
    );
  });
