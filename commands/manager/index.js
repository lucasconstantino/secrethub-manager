const { Command } = require("commander");

module.exports = new Command("manager")
  .addCommand(require("./download"))
  .addCommand(require("./save"));
