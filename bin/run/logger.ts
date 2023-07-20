import chalk from "chalk";
import ora, { Ora } from "ora";

class Logger {
  spinner: Ora;
  constructor() {
    this.spinner = ora({ text: "Loading...", color: "white" });
  }

  print(...messages: string[]) {
    this.spinner.stop();
    console.log(...messages);
  }

  cover(message: string) {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(message);
  }

  dye(color: "info" | "success" | "error" | string, message: string) {
    if (!message) return message;
    switch (color) {
      case "info":
        return chalk.blueBright(message);
      case "success":
        return chalk.greenBright(message);
      case "error":
        return chalk.redBright(message);
      default:
        return message;
    }
  }

  info(message: string) {
    this.spinner.stop();
    console.log(chalk.blueBright(message));
  }

  success(message: string) {
    this.spinner.succeed(chalk.greenBright(message));
  }

  error(message: string) {
    this.spinner.fail(chalk.redBright(message));
  }

  loading(message: string) {
    this.spinner.start(message);
  }
}

export { Logger };

export default new Logger();
