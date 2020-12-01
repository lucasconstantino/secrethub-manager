const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { Command } = require("commander");
const { prompt } = require("enquirer");
const { parse } = require("envfile");

const config = require("../lib/config");
const credential = require("../lib/credential");

const paths = {
  template: path.resolve(process.cwd(), config.template),
  out: path.resolve(process.cwd(), config.out),
};

const keyRegEx = /{{ (?<key>.+) }}/;

module.exports = new Command()
  .command("save")
  .description("Saves .env file content to secrethub based on template")
  .action(async () => {
    const variables = [];

    for (const [name, variable] of Object.entries(config.variables)) {
      const envName = `SECRETHUB_MANAGER_${name.toUpperCase()}`;

      variables.push([
        name,
        process.env[envName] ||
          (await prompt({ ...variable, required: true, name }))[name],
      ]);
    }

    const contents = {
      template: fs.readFileSync(paths.template, "utf-8"),
      current: fs.readFileSync(paths.out, "utf-8"),
    };

    const envs = {
      template: parse(contents.template),
      current: parse(contents.current),
    };

    const write = {};

    for (const [name, value] of Object.entries(envs.template)) {
      const match = value.match(keyRegEx);

      if (match && match.groups && match.groups.key) {
        if (!(name in envs.current)) {
          throw new Error(
            `Variable ${name} found on template, but missing in current environment vars`
          );
        }

        // Replace variable path.
        const key = variables.reduce(
          (key, [name, value]) => key.replace(`$${name}`, value),
          match.groups.key
        );

        write[key] = envs.current[name];
      }
    }

    for (const [key, value] of Object.entries(write)) {
      console.log(`Saving new value for ${key}`);

      execSync(
        `echo "${value}" | SECRETHUB_CREDENTIAL=${await credential()} secrethub write ${key}`
      );
    }
  });