import { Address } from "viem";
import { readFiles, enterErc20TokenAddress } from "./utils";
import logger from "./logger";
import { BatchCheckBalance } from "src/main";
import { writeFileSync } from "node:fs";
import { arrToTable } from "./utils";

export enum CheckType {
  erc20 = "erc20",
  native = "native",
}

export interface CheckBalanceParams {
  out?: string;
  files: Array<string>;
  chainId: number;
  tokenAddress?: Address;
}

export const FORMAT = "address";

const checkNativeBalance = async (chainId: number, addressList: Address[]) => {
  const checkBalance = new BatchCheckBalance(chainId);
  logger.loading("Checking...");
  return await checkBalance.checkNativeBalance(addressList);
};

const checkErc20Balance = async (
  chainId: number,
  addressList: Address[],
  tokenAddress?: Address
) => {
  if (!tokenAddress) {
    tokenAddress = await enterErc20TokenAddress();
  }
  const checkBalance = new BatchCheckBalance(chainId, tokenAddress);
  logger.loading("Checking...");
  return checkBalance.checkErc20Balance(addressList);
};

export default async function (type: CheckType, params: CheckBalanceParams) {
  const { out, files, chainId } = params;
  let { tokenAddress } = params;

  let addresss = (await readFiles(files, FORMAT)).map(
    ({ address }) => address
  ) as Address[];

  let balanceInfos;
  if (type === "erc20") {
    logger.info("Batch check erc20 token balance");
    balanceInfos = await checkErc20Balance(chainId, addresss, tokenAddress);
  } else {
    logger.info("Batch check native token balance");
    balanceInfos = await checkNativeBalance(chainId, addresss);
  }
  const tableData = arrToTable(balanceInfos, ["address", "balance", "error"]);
  if (out) {
    logger.loading(`Check success, Writing to ${out}`);
    writeFileSync(out, tableData);
  } else {
    console.log(tableData);
  }
  logger.success("Check Finished");
  process.exit();
}
