import { privateKeyToAccount } from "viem/accounts";
import {
  Address,
  createPublicClient,
  createWalletClient,
  http,
  fallback,
  PublicClient,
  WalletClient,
  Account,
  Chain,
} from "viem";
import { SUPPORTED_CHAIN_ID_MAP } from "../constants";

const RPC_URL_LIST = import.meta.env.RPC_URL_LIST;
console.log("import.meta--------");
console.log(RPC_URL_LIST);
console.log("import.meta--------");
const transports = RPC_URL_LIST.map((rpcUrl) => http(rpcUrl));

class Client {
  chain: Chain;
  publicClient: PublicClient;
  protected walletClient?: WalletClient;
  protected account?: Account;
  constructor(chainId: number, privateKey?: Address) {
    this.chain = SUPPORTED_CHAIN_ID_MAP[chainId];
    if (!this.chain) throw new Error("不支持的网络");

    this.publicClient = createPublicClient({
      chain: this.chain,
      transport: fallback([...transports, http()]),
    });

    if (privateKey) {
      this.account = privateKeyToAccount(privateKey);

      this.walletClient = createWalletClient({
        chain: this.chain,
        account: this.account,
        transport: fallback([...transports, http()]),
      });
    }
  }
}

export default Client;
