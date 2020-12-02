const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { Command } = require("commander");

const config = require("../../lib/config");
const secrethub = require("../../lib/secrethub");
const { signed } = require("../../lib/credential");

const manager = path.resolve(process.cwd(), "./.secrethub/manager");

/**
 * Recursive path loader.
 */
const getPaths = (_parent, env) => {
  const parent = _parent.replace(/\/$/, "");
  const children = [];

  console.log(`> Opening "${parent}" dir`);

  const paths = execSync(`${secrethub} ls ${parent} -q`, { env })
    .toString()
    .split("\n")
    .filter(Boolean);

  for (const path of paths) {
    const key = `${parent}/${path}`;

    if (path.endsWith("/")) {
      children.push(...getPaths(key, env));
    } else {
      children.push(key);
    }
  }

  return children;
};

/**
 * Sort keys based on directory depth.
 */
const sortKeys = (a, b) => {
  const depths = {
    a: (a.match(/\//g) || []).length,
    b: (b.match(/\//g) || []).length,
  };

  return depths.a > depths.b
    ? 1
    : depths.a < depths.b
    ? -1
    : a > b
    ? 1
    : a < b
    ? -1
    : 0;
};

module.exports = new Command()
  .command("download")
  .description(
    "Download .secrethub/manager file for easier setup of all environments"
  )
  .action(async () => {
    const env = await signed();

    const paths = getPaths(config.path, env);
    const width = paths.sort((a, b) => b.length - a.length)[0].length;
    const sorted = paths.reverse().sort(sortKeys);

    let currDir = null;

    const map = sorted.map((key) => {
      const dir = key.split("/").slice(0, -1).join("/");
      const prefix = dir === currDir ? "" : "\n";
      const indent = " ".repeat(width - key.length);

      currDir = dir;

      return `${prefix}${key} ${indent} = {{ ${key} }}`;
    });

    // create template
    fs.writeFileSync(manager, map.join("\n"), "utf8");

    console.log("> Resolving values");

    // fulfil template
    fs.writeFileSync(
      manager,
      execSync(`${secrethub} inject -i ${manager}`, { env }),
      "utf8"
    );

    console.log(`> Saved manager to ${manager}`);
  });
