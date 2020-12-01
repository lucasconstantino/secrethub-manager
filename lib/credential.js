const fs = require("fs");
const path = require("path");

const credentialsPath = path.resolve(process.cwd(), "./.secrethub/credential");

function read() {
  return fs.existsSync(credentialsPath)
    ? fs.readFileSync(credentialsPath, "utf-8")
    : null;
}

module.exports = read;
