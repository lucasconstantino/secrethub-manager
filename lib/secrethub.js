const path = require("path");
const { execSync } = require("child_process");
const waitOn = require("wait-on");

const bin = `${path.dirname(
  require.resolve("@secrethub/cli/package.json")
)}/bin/secrethub`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const ready = async () => {
  // wait for binary to exist
  await waitOn({ resources: [bin], timeout: 10000 });

  const start = new Date();

  // wait for binary to be responding
  do {
    try {
      execSync(`${bin} --version`, { stdio: "inherit" });
      // return when ready
      return true;
    } catch (err) {
      // ignore error
      await sleep(500);
    }
  } while (new Date() - start < 10000);

  throw new Error("Timeout while waiting for @secrethub/cli to be ready");
};

module.exports = { bin, ready };
