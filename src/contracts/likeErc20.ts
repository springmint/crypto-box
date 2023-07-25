import { getContract, Address, formatUnits } from "viem";
import { erc20Abi } from "abitype/test";
import { MAX_HEX_BIGINT } from "../constants";
import Client from "./basic";

class LikeErc20 extends Client {
  constructor(
    public contractAddress: Address,
    chainId: number,
    privateKey?: Address
  ) {
    super(chainId, privateKey);
  }

  private getContract() {
    return getContract({
      address: this.contractAddress,
      abi: erc20Abi,
      publicClient: this.publicClient,
      walletClient: this.walletClient,
    });
  }

  async getDecimals() {
    return await this.publicClient.readContract({
      address: this.contractAddress,
      abi: erc20Abi,
      functionName: "decimals",
    });
  }

  async getSymbol() {
    return await this.publicClient.readContract({
      address: this.contractAddress,
      abi: erc20Abi,
      functionName: "symbol",
    });
  }

  async getBalance(address: Address) {
    const balanceOfWei = await this.publicClient.readContract({
      address: this.contractAddress,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [address],
    });
    const decimal = await this.getDecimals();

    return {
      wei: balanceOfWei,
      token: formatUnits(balanceOfWei, decimal),
    };
  }

  async getAllowce(address: Address, spender: Address) {
    return await this.publicClient.readContract({
      address: this.contractAddress,
      abi: erc20Abi,
      functionName: "allowance",
      args: [address, spender],
    });
  }

  async approve(spender: Address, amount?: bigint) {
    if (!this.walletClient) throw new Error("没有传私钥进来");
    const account = this.account!;
    const chain = this.chain;
    const contract = this.getContract();

    return await contract.write.approve(
      [spender, amount ? amount : MAX_HEX_BIGINT],
      { chain, account }
    );
  }
}

export default LikeErc20;
