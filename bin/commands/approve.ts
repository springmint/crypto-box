import { Option, Command } from "commander";
import run, { Operator } from "../run";
import { SUPPORTED_CHAIN_ID_MAP } from "src/constants";

export default {
  install(program: Command) {
    program
      .command(Operator.approve)
      .description("Batch approve")
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
        new Option(
          "-a, --tokenAddress <string>",
          "Erc20 token address"
        ).makeOptionMandatory(true)
      )
      .addOption(
        new Option(
          "-s, --spenderAddress <string>",
          "Erc20 contract address"
        ).makeOptionMandatory(true)
      )
      .addOption(
        new Option("--check-allowance", "Check allowance to export").default(true)
      )
      .action((params) => {
        run(Operator.approve, params);
      });
  },
};
