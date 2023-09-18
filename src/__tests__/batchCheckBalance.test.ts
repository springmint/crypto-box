import { describe, expect, it } from "@jest/globals";
import { Address, parseEther } from "viem";
import { BatchCheckBalance } from "../tools";
import EVM from "../contracts/evm";
import Erc20 from "../contracts/likeErc20";

const chainId = Number(process.env.CPBOX_CHAIN_ID);
const erc20TokenAddress = process.env.CPBOX_TOKEN_ADDRESS as Address;
const privateKeys = JSON.parse(
  process.env.CPBOX_PRIVATE_KEY_LIST as string
) as Array<Address>;
const hasTokenPrivateKey = privateKeys[0];
const sendBalanceList = [
  {
    address: "0x0000000000123456789abcdef000000000000001" as Address,
    amount: parseEther("0.002", "wei"),
    balance: BigInt("0"),
    erc20Balance: BigInt("0"),
  },
  {
    address: "0x0000000000123456789abcdef000000000000002" as Address,
    amount: parseEther("0.0001", "wei"),
    balance: BigInt("0"),
    erc20Balance: BigInt("0"),
  },
  {
    address: "0x0000000000123456789abcdef000000000000003" as Address,
    amount: parseEther("0.0000001", "wei"),
    balance: BigInt("0"),
    erc20Balance: BigInt("0"),
  },
];

describe("batch check native balance", () => {
  it("check native token balance", async () => {
    const evm = new EVM(chainId, hasTokenPrivateKey);
    const batchCheckBalance = new BatchCheckBalance(chainId);

    for (let i = 0; i < sendBalanceList.length; i++) {
      const { address } = sendBalanceList[i];
      sendBalanceList[i].balance = await evm.getBalance(address);
    }

    for (let i = 0; i < sendBalanceList.length; i++) {
      const { address, amount } = sendBalanceList[i];
      await evm.transfer(address, amount);
    }

    const sendBalanceMap = sendBalanceList.reduce((map, item) => {
      map[item.address] = item;
      return map;
    }, {} as { [Address: string]: { amount: bigint; balance: bigint } });
    const addressList = sendBalanceList.map(({ address }) => address);
    const balances = await batchCheckBalance.checkNativeBalance(addressList);
    balances.forEach(({ error, balanceOfWei, address }, index) => {
      if (!error) {
        const expectBalance =
          sendBalanceMap[address].balance + sendBalanceMap[address].amount;
        expect(balanceOfWei).toBe(expectBalance);
      }
    });
  });
});

describe("batch check erc20 balance", () => {
  it("check erc20 token balance", async () => {
    const erc20 = new Erc20(erc20TokenAddress, chainId, hasTokenPrivateKey);
    const batchCheckBalance = new BatchCheckBalance(chainId, erc20TokenAddress);

    for (let i = 0; i < sendBalanceList.length; i++) {
      const { address } = sendBalanceList[i];
      sendBalanceList[i].erc20Balance = (await erc20.getBalance(address)).wei;
    }

    for (let i = 0; i < sendBalanceList.length; i++) {
      const { address, amount } = sendBalanceList[i];
      await erc20.transfer(address, amount);
    }

    const sendBalanceMap = sendBalanceList.reduce((map, item) => {
      map[item.address] = {
        amount: item.amount,
        erc20Balance: item.erc20Balance,
      };
      return map;
    }, {} as { [Address: string]: { amount: bigint; erc20Balance: bigint } });

    const addressList = sendBalanceList.map(({ address }) => address);
    const balances = await batchCheckBalance.checkErc20Balance(addressList);
    balances.forEach(({ error, balanceOfWei, address }) => {
      if (!error) {
        const expectBalance =
          sendBalanceMap[address].erc20Balance + sendBalanceMap[address].amount;
        expect(balanceOfWei).toBe(expectBalance);
      }
    });
  });
});
