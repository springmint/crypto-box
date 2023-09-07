import { describe, expect, it } from "@jest/globals";
import { Address, parseEther } from "viem";
import { Evm, LikeErc20 } from "../contracts";
import BatchSendToken from "../tools/batchSendToken";

const chainId = Number(process.env.CPBOX_CHAIN_ID);
const privateKeys = JSON.parse(
  process.env.CPBOX_PRIVATE_KEY_LIST as string
) as Array<Address>;

const sendParams = [
  {
    address: "0x8258fa56642a8b9AD770272972004EC9Dc1fC4e7" as Address,
    amount: parseEther("0.002", "wei"),
    balance: BigInt("0"),
  },
  {
    address: "0x2192c4C8842D7650aC63613F20a0De7ab9F9c63a" as Address,
    amount: parseEther("0.0001", "wei"),
    balance: BigInt("0"),
  },
];
const totalSend = sendParams.reduce(
  (sum, { amount }) => sum + amount,
  BigInt(0)
);

const erc20TokenAddress = process.env.CPBOX_LE_ETH as Address;

describe("Batch send token", () => {
  it("native token", async () => {
    const batchSendToken = new BatchSendToken(chainId, privateKeys[0]);
    const evm = new Evm(chainId);
    const address = batchSendToken.account.address;
    const oldBalance = await evm.getBalance(address);
    expect(oldBalance).toBeGreaterThan(BigInt(0));

    for (let i = 0; i < sendParams.length; i++) {
      const { address } = sendParams[i];
      sendParams[i].balance = await evm.getBalance(address);
    }

    const hash = await batchSendToken.sendNativeToken(sendParams);
    const transaction =
      await batchSendToken.publicClient.waitForTransactionReceipt({ hash });

    const nowBalance = await evm.getBalance(address);
    expect(nowBalance).toBe(
      oldBalance -
        totalSend -
        transaction.gasUsed * transaction.effectiveGasPrice
    );

    for (let i = 0; i < sendParams.length; i++) {
      const { address, amount, balance } = sendParams[i];
      const nowBalance = await evm.getBalance(address);
      expect(balance + amount).toBe(nowBalance);
    }
  }, 60000);

  it("erc20 token", async () => {
    const batchSendToken = new BatchSendToken(
      chainId,
      privateKeys[0],
      erc20TokenAddress
    );
    const erc20 = new LikeErc20(erc20TokenAddress, chainId, privateKeys[0]);
    const address = batchSendToken.account.address;
    const oldBalance = await erc20.getBalance(address);
    expect(oldBalance.wei).toBeGreaterThan(BigInt(0));

    for (let i = 0; i < sendParams.length; i++) {
      const { address } = sendParams[i];
      const balance = await erc20.getBalance(address);
      sendParams[i].balance = balance.wei;
    }

    const hash = await batchSendToken.sendErc20Token(sendParams);
    await batchSendToken.publicClient.waitForTransactionReceipt({ hash });

    const nowBalance = await erc20.getBalance(address);
    expect(nowBalance.wei).toBe(oldBalance.wei - totalSend);

    for (let i = 0; i < sendParams.length; i++) {
      const { address, amount, balance } = sendParams[i];
      const nowBalance = await erc20.getBalance(address);
      expect(balance + amount).toBe(nowBalance.wei);
    }
  }, 60000);
});
