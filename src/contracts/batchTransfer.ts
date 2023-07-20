import { WalletClient, getContract, Address, Account } from "viem";
import TRANSFER_ABI from "./abi/transfer";
import { TRANSFER_MAP } from "../constants";
import Client from "./basic";

export interface TransferItem {
  address: Address;
  amount: bigint;
}

const wrapTransferParams = (addressAndAmounts: Array<TransferItem>) => {
  const addresss: Array<Address> = [];
  const amounts: Array<bigint> = [];
  let totalAmount = BigInt(0);
  addressAndAmounts.forEach(({ address, amount }) => {
    addresss.push(address);
    amounts.push(amount);
    totalAmount = totalAmount += amount;
  });
  return { addresss, amounts, totalAmount };
};

class BatchTransfer extends Client {
  declare account: Account;
  declare walletClient: WalletClient;
  contractAddress: Address;
  constructor(chainId: number, privateKey: Address) {
    super(chainId, privateKey);
    this.contractAddress = TRANSFER_MAP[chainId];
  }

  private async getContract() {
    return getContract({
      address: this.contractAddress,
      abi: TRANSFER_ABI,
      publicClient: this.publicClient,
      walletClient: this.walletClient,
    });
  }

  async batchTransferErc20Token(
    tokenAddress: Address,
    addressAndAmounts: Array<TransferItem>
  ) {
    const chain = this.chain;
    const account = this.account;
    const contract = await this.getContract();
    const { addresss, amounts } = wrapTransferParams(addressAndAmounts);
    return await contract.write.multiTransferToken(
      [tokenAddress, addresss, amounts],
      { chain, account }
    );
  }

  async batchTransferNativeToken(addressAndAmounts: Array<TransferItem>) {
    const chain = this.chain;
    const account = this.account;
    const contract = await this.getContract();
    const { totalAmount, addresss, amounts } =
      wrapTransferParams(addressAndAmounts);
    return await contract.write.multiTransferETH([addresss, amounts], {
      chain,
      account,
      value: totalAmount,
    });
  }
}

export default BatchTransfer;
