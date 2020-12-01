const fs = require("fs");
const path = require("path");
const { prompt } = require("enquirer");

const { SECRETHUB_CREDENTIAL } = process.env;
const credentialsPath = path.resolve(process.cwd(), "./.secrethub/credential");

const credential = async () =>
  SECRETHUB_CREDENTIAL ||
  (fs.existsSync(credentialsPath)
    ? fs.readFileSync(credentialsPath, "utf-8")
    : await prompt({
        type: "password",
        name: "credential",
        required: true,
        message: "No secrethub credential found. Please, provide one:",
      }));

module.exports = credential;
