import batchSendToken, { BatchSendTokenParams } from "./batchSendToken";
import batchGenerateWallet, {
  BatchGenerateWalletParams,
} from "./batch-generate-wallet";
import checkBalance, { CheckBalanceParams, CheckType } from "./checkBalance";
import approve, { ApproveParams } from "./approve";

export enum Operator {
  batchSendToken = "batchSend",
  generateWallet = "generate",
  checkBalance = "checkBalance",
  approve = "approve",
}

export type RunParams<T extends Operator> = {
  [Operator.batchSendToken]: BatchSendTokenParams;
  [Operator.generateWallet]: BatchGenerateWalletParams;
  [Operator.checkBalance]: CheckBalanceParams;
  [Operator.approve]: ApproveParams;
}[T];

export default function run<T extends Operator>(
  commond: T,
  argument?: RunParams<T> | string,
  params?: RunParams<T>
) {
  params = typeof argument === "string" ? params : argument;
  switch (commond) {
    case Operator.batchSendToken:
      batchSendToken(
        argument as string,
        params as RunParams<Operator.batchSendToken>
      );
      break;
    case Operator.generateWallet:
      batchGenerateWallet(
        argument as string,
        params as RunParams<Operator.generateWallet>
      );
      break;
    case Operator.checkBalance:
      checkBalance(
        argument as CheckType,
        params as RunParams<Operator.checkBalance>
      );
      break;
    case Operator.approve:
      approve(params as RunParams<Operator.approve>);
      break;
  }
}
