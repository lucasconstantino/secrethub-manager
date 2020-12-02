const fs = require("fs");
const path = require("path");
const { prompt } = require("enquirer");
const { execSync } = require("child_process");

const { SECRETHUB_CREDENTIAL } = process.env;
const credentialsPath = path.resolve(process.cwd(), "./.secrethub/credential");

const credential = async () => {
  let pass =
    SECRETHUB_CREDENTIAL || fs.existsSync(credentialsPath)
      ? fs.readFileSync(credentialsPath, "utf-8")
      : null;

  if (!pass) {
    try {
      // silently check if user is signed-up globally. In this case, we don't
      // need to explicitly use credentials.
      execSync("secrethub ls", { stdio: "ignore" });
      return null;
    } catch (err) {
      // in case we couldn't resolve credentials, and user isn't signed-up
      // globally, we need to request for credentials input.
      pass = await prompt({
        type: "password",
        name: "credential",
        required: true,
        message: "No secrethub credential found. Please, provide one:",
      });
    }
  }

  return pass;
};

/**
 * Sign a child-process with credentials.
 */
const signed = async () => ({
  ...process.env,
  SECRETHUB_CREDENTIAL: await credential(),
});

module.exports = { credential, signed };
