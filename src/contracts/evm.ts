import { getNativeCurrency } from "../utils";
import Client from "./basic";
import { Address } from "viem";

export class EVM extends Client {
  constructor(chainId: number, privateKey?: Address) {
    super(chainId, privateKey);
  }

  async getNativeCurrency() {
    const chainId = this.chain.id;
    return getNativeCurrency(chainId);
  }

  async getBalance(address?: Address) {
    address = address ?? this.account?.address;
    if (!address) throw new Error("未输入address");

    return await this.publicClient.getBalance({ address });
  }

  async transfer(toAddress: Address, amount: bigint) {
    if (!this.walletClient) throw new Error("未初始化 privateKey");

    return await this.walletClient.sendTransaction({
      to: toAddress,
      value: amount,
    });
  }
}

export default EVM;
