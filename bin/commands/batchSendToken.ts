import { Option, Argument, Command } from "commander";
import { SendType } from "../run/batchSendToken";
import run, { Operator } from "../run";
import { SUPPORTED_CHAIN_ID_MAP } from "src/constants";

export default {
  install(program: Command) {
    // batch send token
    program
      .command(Operator.batchSendToken)
      .description("Batch send token")
      .addArgument(
        new Argument("[type]", "Token type")
          .choices([SendType.erc20, SendType.native])
          .default(SendType.native)
      )
      .addOption(
        new Option("-c, --chainId <number>", "Network id")
          .choices(Object.keys(SUPPORTED_CHAIN_ID_MAP))
          .argParser(parseInt)
          .makeOptionMandatory(true)
      )
      .addOption(
        new Option(
          "-f, --files <dirs...>",
          "File path list"
        ).makeOptionMandatory(true)
      )
      .addOption(new Option("-p, --privateKey <string>", "Private key"))
      .addOption(
        new Option("-a, --tokenAddress <string>", "Erc20 token address")
      )
      .addOption(new Option("--autoApprove", "Auto approve erc20 token"))
      .action((argument, params) => {
        run(Operator.batchSendToken, argument, params);
      });
  },
};
