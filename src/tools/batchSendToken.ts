import { Address } from "viem";
import { BatchTransfer } from "../contracts";

type SendTokenParams = Array<{
  address: Address;
  amount: bigint;
}>;

class BatchSendToken extends BatchTransfer {
  constructor(
    chainId: number,
    privateKey: Address,
    public tokenContractAddress?: Address
  ) {
    super(chainId, privateKey);
  }

  async sendNativeToken(params: SendTokenParams) {
    return await this.batchTransferNativeToken(params);
  }

  async sendErc20Token(params: SendTokenParams) {
    if (!this.tokenContractAddress)
      throw new Error("未输入 Erc20 代币的合约地址");
    return await this.batchTransferErc20Token(
      this.tokenContractAddress,
      params
    );
  }
}

export default BatchSendToken;
