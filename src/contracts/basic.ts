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
  FallbackTransport,
} from "viem";
import { SUPPORTED_CHAIN_ID_MAP } from "../constants";

const transports = [http(process.env.CPBOX_RPC_URL)];

class Client {
  chain: Chain;
  publicClient: PublicClient<FallbackTransport, Chain>;
  protected walletClient?: WalletClient<FallbackTransport, Chain, Account>;
  protected account?: Account;
  constructor(chainId: number, privateKey?: Address) {
    this.chain = SUPPORTED_CHAIN_ID_MAP[chainId];
    if (!this.chain) throw new Error("不支持的网络");

    this.publicClient = createPublicClient({
      chain: this.chain,
      transport: fallback([...transports]),
    });

    if (privateKey) {
      this.account = privateKeyToAccount(privateKey);

      this.walletClient = createWalletClient({
        chain: this.chain,
        account: this.account,
        transport: fallback([...transports]),
      });
    }
  }
}

export default Client;
