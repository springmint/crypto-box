import { program } from "commander";
import packageJson from "../package.json";
import batchSendToken from "./commands/batchSendToken";
import generateWallet from "./commands/generateWallet";
import checkBalance from "./commands/checkBalance";
import approve from "./commands/approve";

program
  .name("Cpbox")
  .description("Crypto box tools")
  .version(packageJson.version);

batchSendToken.install(program);
generateWallet.install(program);
checkBalance.install(program);
approve.install(program);

program.parse();
