import { Option, Argument, Command } from "commander";
import run, { Operator } from "../run";

export default {
  install(program: Command) {
    program
      .command(Operator.generateWallet)
      .description("Batch generate wallet")
      .addArgument(
        new Argument("[type]", "Wallet type")
          .choices(["privateKey", "mnemonic"])
          .default("mnemonic")
      )
      .addOption(
        new Option(
          "-f, --file <string>",
          "Export file path"
        ).makeOptionMandatory(true)
      )
      .addOption(
        new Option("-l, --len <number>", "Mnemonic len").argParser(parseInt)
      )
      .addOption(new Option("-p, --path <string>", "Generate path"))
      .addOption(
        new Option("-c, --count <number>", "Count")
          .preset(1)
          .argParser((v, p) => parseInt(v) || p)
          .default(1)
      )
      .addOption(
        new Option("--prefix <string>", "Prefix")
          .conflicts("suffix")
          .implies({ count: 1 })
      )
      .addOption(
        new Option("--suffix <string>", "Suffix")
          .conflicts("prefix")
          .implies({ count: 1 })
      )
      .addOption(new Option("--case-sensitive", "Case sensitive"))
      .action((argument, params) => {
        run(Operator.generateWallet, argument, params);
      });
  },
};
