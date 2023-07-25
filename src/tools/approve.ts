import { Address } from "viem";
import { LikeErc20 } from "src/contracts";
import Client from "src/contracts/basic";

export type ApproveParams = Array<{
  privateKey: Address;
  amount: bigint;
}>;

class Approve extends Client {
  constructor(
    public chainId: number,
    public tokenContractAddrss: Address,
    public spender: Address
  ) {
    super(chainId);
  }

  async getErc20Allowance(params: Array<Address>) {
    return await Promise.allSettled(
      params.map(async (address) => {
        const erc20 = new LikeErc20(this.tokenContractAddrss, this.chainId);
        return await erc20.getAllowce(this.spender, address);
      })
    );
  }

  async approveErc20(params: ApproveParams) {
    return await Promise.allSettled(
      params.map(async ({ privateKey, amount }) => {
        const erc20 = new LikeErc20(
          this.tokenContractAddrss,
          this.chainId,
          privateKey
        );
        return await erc20.approve(this.spender, amount);
      })
    );
  }
}

export default Approve;
