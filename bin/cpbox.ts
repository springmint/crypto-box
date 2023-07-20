import { program } from "commander";
import packageJson from "../package.json";
import batchSendToken from "./commands/batchSendToken";
import generateWallet from "./commands/generateWallet";

program
  .name("Cpbox")
  .description("Crypto box tools")
  .version(packageJson.version);

batchSendToken.install(program);
generateWallet.install(program);

program.parse();
