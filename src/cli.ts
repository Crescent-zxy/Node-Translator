import { translate } from "./main";
import * as commander from "commander";
const pkg = require("../package.json");

const program = new commander.Command();

program
  .version(pkg.version)
  .name("translator")
  .usage("<English>")
  .arguments("<English>")
  .action((word) => {
    translate(word);
  });

program.parse(process.argv);
