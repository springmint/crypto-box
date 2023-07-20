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

// const infura = http(
//   "https://mainnet.infura.io/v3/432bf8bcedde4dad86675aab0f54c86a"
// );
const infura = http();

class Client {
  chain: Chain;
  publicClient: PublicClient;
  walletClient?: WalletClient;
  account?: Account;
  constructor(chainId: number, privateKey?: Address) {
    this.chain = SUPPORTED_CHAIN_ID_MAP[chainId];
    if (!this.chain) throw new Error("不支持的网络");

    this.publicClient = createPublicClient({
      chain: this.chain,
      transport: fallback([infura]),
    });

    if (privateKey) {
      this.account = privateKeyToAccount(privateKey);

      this.walletClient = createWalletClient({
        chain: this.chain,
        account: this.account,
        transport: fallback([infura]),
      });
    }
  }
}

export default Client;
