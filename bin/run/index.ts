import batchSendToken, { BatchSendTokenParams } from "./batchSendToken";
import batchGenerateWallet, {
  BatchGenerateWalletParams,
} from "./batch-generate-wallet";

export enum Operator {
  batchSendToken = "batchSend",
  generateWallet = "generate",
}
 
export type RunParams<T extends Operator> = {
  [Operator.batchSendToken]: BatchSendTokenParams;
  [Operator.generateWallet]: BatchGenerateWalletParams;
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
  }
}
