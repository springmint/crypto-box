import { Address, formatUnits, parseUnits } from "viem";
import { Multicall, ContractCallContext } from "ethereum-multicall";
import { MULTICALL_MAP } from "../constants";
import { formatDecimal } from "../utils";
import MULTICALL_ABI from "./abi/multicall";
import Client from "./basic";
import LikeErc20 from "./likeErc20";
import { erc20Abi } from "abitype/test";

const MULTICALL_CONTRACT = "0xca11bde05977b3631167028862be2a173976ca11";

class MulticallContract extends Client {
  static ABI = MULTICALL_ABI;
  constructor(chainId: number, privateKey?: Address) {
    super(chainId, privateKey);
  }

  async getEVMNativeBalances(addressList: Array<Address>) {
    const multicallContract =
      MULTICALL_MAP[this.chain.id] || MULTICALL_CONTRACT;

    return await this.getEVMNativeBalancesFromMulticall(
      addressList,
      multicallContract
    );
  }

  async getEVMNativeBalancesFromMulticall(
    addresss: Array<Address>,
    multicallAddress: Address
  ) {
    const decimals = this.chain.nativeCurrency.decimals;
    const results = await this.publicClient.multicall({
      contracts: addresss.map((address) => ({
        address: multicallAddress,
        abi: MULTICALL_ABI,
        functionName: "getEthBalance",
        args: [address],
      })),
    });
    return results.map(({ error, status, result }, index) => {
      if (status === "success") {
        const wei = result as bigint;
        return {
          address: addresss[index],
          balanceOfWei: wei,
          balance: formatUnits(wei, decimals),
        };
      } else {
        return {
          error: error.message,
          address: addresss[index],
        };
      }
    });
  }

  async getErc20BalancesFromMulticall(
    tokenAddress: Address,
    addresss: Array<string>
  ) {
    const erc20 = new LikeErc20(tokenAddress, this.chain.id);
    const decimals = await erc20.getDecimals();
    const results = await this.publicClient.multicall({
      contracts: addresss.map((address) => ({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address],
      })),
    });
    return results.map(({ error, status, result }, index) => {
      if (status === "success") {
        const wei = result as bigint;
        return {
          address: addresss[index],
          balanceOfWei: wei,
          balance: formatUnits(wei, decimals),
        };
      } else {
        return {
          error: error.message,
          address: addresss[index],
        };
      }
    });
  }
}

export default MulticallContract;
