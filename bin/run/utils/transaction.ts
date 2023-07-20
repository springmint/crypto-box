import { TransactionReceipt } from "viem";
import { beautifyJson } from "./common";

export function beautifyJsonOfReceipt(receipt: TransactionReceipt) {
  return beautifyJson(
    receipt,
    [
      "blockHash",
      "blockNumber",
      "contractAddress",
      "cumulativeGasUsed",
      "effectiveGasPrice",
      "from",
      "to",
      "gasUsed",
      "transactionHash",
      "transactionIndex",
      "type",
    ],
    2
  );
}
