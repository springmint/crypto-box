import { describe, expect, it } from "@jest/globals";
import { Address } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { BatchApprove } from "../tools";

const chainId = Number(process.env.CPBOX_CHAIN_ID);
const erc20TokenAddress = process.env.CPBOX_TOKEN_ADDRESS as Address;
const privateKeys = JSON.parse(
  process.env.CPBOX_PRIVATE_KEY_LIST as string
) as Array<Address>;
const spender = "0x00000000001234567890abcdef000000000000000000000001";

describe("batch approve", () => {
  let approveCounts = privateKeys.map(() =>
    BigInt((Math.random() * 10000).toFixed(0))
  );

  it("check allowance", async () => {
    const approveParams = privateKeys.map((privateKey, i) => ({
      privateKey,
      amount: approveCounts[i],
    }));
    const batchApprove = new BatchApprove(chainId, erc20TokenAddress, spender);
    await batchApprove.approveErc20(approveParams);

    const addressListFromPrivateKeys = privateKeys
      .map(privateKeyToAccount)
      .map((account) => account.address);
    const allowances = await batchApprove.getErc20Allowance(
      addressListFromPrivateKeys
    );

    for (let i = 0; i < allowances.length; i++) {
      const allowance = allowances[i];
      if (allowance.status === "fulfilled") {
        expect(allowance.value).toBe(approveCounts[i]);
      }
    }
  });
});
