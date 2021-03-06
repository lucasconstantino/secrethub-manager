const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { Command } = require("commander");
const { prompt } = require("enquirer");
const { parse } = require("envfile");

const secrethub = require("../../lib/secrethub");
const { signed } = require("../../lib/credential");
const manager = path.resolve(process.cwd(), "./.secrethub/manager");

module.exports = new Command()
  .command("save")
  .description("Saves .secrethub/manager variable to secrethub")
  .action(async () => {
    if (!fs.existsSync(manager)) {
      throw new Error(`No manager found at ${manager}`);
    }

    const env = await signed();

    const envs = parse(fs.readFileSync(manager, "utf-8"));
    const modified = [];

    for (const [key, value] of Object.entries(envs)) {
      console.log(`> Fetching "${key}"`);

      try {
        const changed =
          execSync(`${secrethub.bin} read ${key}`, { env })
            .toString()
            .replace("\n", "") !== value;

        if (changed) {
          modified.push(key);
        }
      } catch (err) {
        return true;
      }
    }

    if (!modified.length) {
      console.log("> All variables are up-to-date");
    } else {
      const choices = modified.map((name) => ({ name, value: name }));

      const { toUpdate } = await prompt({
        name: "toUpdate",
        type: "multiselect",
        message: "The following secrets will be updated",
        choices,
        initial: modified,
      });

      for (const key of toUpdate) {
        const value = envs[key];
        console.log(`> Updating "${key}"`);
        execSync(`echo "${value}" | ${secrethub.bin} write ${key}`, { env });
      }

      console.log("> Finished updating secrets");
    }
  });
