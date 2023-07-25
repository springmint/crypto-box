import { LikeErc20 } from "src/contracts";
import { Address, parseUnits } from "viem";
import logger from "./logger";
import { BatchApprove } from "src/main";
import { writeFileSync } from "node:fs";
import { beautifyJsonOfReceipt, readFiles, arrToTable } from "./utils";
import { privateKeyToAccount } from "viem/accounts";

export interface ApproveParams {
  out?: string;
  files: Array<string>;
  chainId: number;
  tokenAddress: Address;
  spenderAddress: Address;
  checkAllowan: boolean;
}

export const FORMAT = "privateKey,amount";

const checkAllowance = async (
  chainId: number,
  tokenAddress: Address,
  spenderAddress: Address,
  addressList: Array<Address>
) => {
  logger.loading("Check allowance...");
  const batchApprove = new BatchApprove(chainId, tokenAddress, spenderAddress);
  const allowances = await batchApprove.getErc20Allowance(addressList);
  logger.info("Check finished");
  return allowances.map((allowance, index) => ({
    allowance,
    address: addressList[index],
  }));
};

const getTokenDecimals = async (chainId: number, tokenAddress: Address) => {
  const erc20 = new LikeErc20(tokenAddress, chainId);
  return await erc20.getDecimals();
};

const approve = async (
  chainId: number,
  tokenAddress: Address,
  spenderAddress: Address,
  privateKeyList: Array<{
    privateKey: Address;
    amount: bigint;
  }>
) => {
  logger.loading("Approve...");
  const batchApprove = new BatchApprove(chainId, tokenAddress, spenderAddress);
  const hashs = await batchApprove.approveErc20(privateKeyList);
  logger.success("Transaction submited");
  await Promise.allSettled(
    hashs.map(async (hash) => {
      try {
        if (hash.status === "fulfilled") {
          logger.print(
            "Txn",
            logger.dye("info", hash.value),
            logger.dye("warn", "Confirm...")
          );
          const receipt =
            await batchApprove.publicClient.waitForTransactionReceipt({
              hash: hash.value,
            });
          logger.success(`${hash.value}: Transaction confirmed`);
          logger.print(
            "Receipt\n",
            logger.dye("info", beautifyJsonOfReceipt(receipt))
          );
        } else {
          logger.error(`Transaction fail: ${hash.reason}`);
        }
      } catch (error) {
        logger.error(`Transaction fail`);
        logger.print("Error\n", logger.dye("error", (error as Error).message));
      }
    })
  );
};

export default async function (params: ApproveParams) {
  const { out, files, chainId, tokenAddress, spenderAddress, checkAllowan } =
    params;

  let addresss = (await readFiles(files, FORMAT)) as Array<{
    privateKey: Address;
    amount: string;
  }>;
  const decimals = await getTokenDecimals(chainId, tokenAddress);

  const privateKeyList = addresss.map(({ privateKey, amount }) => {
    return { privateKey, amount: parseUnits(amount, decimals) };
  });

  await approve(chainId, tokenAddress, spenderAddress, privateKeyList);

  if (checkAllowan) {
    const allowances = await checkAllowance(
      chainId,
      tokenAddress,
      spenderAddress,
      addresss.map(({ privateKey }) => privateKeyToAccount(privateKey).address)
    );
    const allowanceInfo = allowances.map((item) => {
      if (item.allowance.status === "fulfilled") {
        return { allowance: item.allowance.value, address: item.address };
      } else {
        return { error: item.allowance.reason, address: item.address };
      }
    });
    const tableData = arrToTable(allowanceInfo, [
      "address",
      "allowance",
      "error",
    ]);
    if (out) {
      logger.loading(`Writing to ${out}`);
      writeFileSync(out, tableData);
    } else {
      console.log(tableData);
    }
  }

  logger.success("Approve Finished");
  process.exit();
}
