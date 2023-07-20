import { Address } from "abitype";
import { getNativeCurrency } from "../utils";
import Client from "./basic";

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

  async transfer() {
    // TODO when need
  }
}

export default EVM;
