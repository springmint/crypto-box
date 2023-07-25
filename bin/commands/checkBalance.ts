import { Option, Argument, Command } from "commander";
import run, { Operator } from "../run";
import { CheckType } from "../run/checkBalance";
import { SUPPORTED_CHAIN_ID_MAP } from "src/constants";

export default {
  install(program: Command) {
    program
      .command(Operator.checkBalance)
      .description("Batch check balance")
      .addArgument(
        new Argument("[type]", "Token type")
          .choices([CheckType.erc20, CheckType.native])
          .default(CheckType.native)
      )
      .addOption(
        new Option(
          "-f, --files <dirs...>",
          "File path list"
        ).makeOptionMandatory(true)
      )
      .addOption(
        new Option("-c, --chainId <number>", "Network id")
          .choices(Object.keys(SUPPORTED_CHAIN_ID_MAP))
          .argParser(parseInt)
          .makeOptionMandatory(true)
      )
      .addOption(new Option("-o --out <string>", "Export file path"))
      .addOption(
        new Option("-a, --tokenAddress <string>", "Erc20 token address")
      )
      .action((argument, params) => {
        run(Operator.checkBalance, argument, params);
      });
  },
};
