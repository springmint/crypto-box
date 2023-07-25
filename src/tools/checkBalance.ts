import { Address } from "viem";
import MulticallContract from "src/contracts/multicall";

class CheckBalance {
  constructor(public chainId: number, public tokenContractAddress?: Address) {}

  async checkNativeBalance(addressList: Array<Address>) {
    const multicall = new MulticallContract(this.chainId);
    return await multicall.getEVMNativeBalances(addressList);
  }

  async checkErc20Balance(addressList: Array<Address>) {
    if (!this.tokenContractAddress)
      throw new Error("未输入 Erc20 代币的合约地址");
    const multicall = new MulticallContract(this.chainId);
    return await multicall.getErc20BalancesFromMulticall(
      this.tokenContractAddress,
      addressList
    );
  }
}

export default CheckBalance;
