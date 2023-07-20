import {
  mainnet,
  goerli,
  Chain,
  bsc,
  bscTestnet,
  polygon,
  polygonZkEvmTestnet,
  optimism,
  optimismGoerli,
  arbitrum,
  arbitrumGoerli,
  zkSync,
  zkSyncTestnet,
  avalanche,
  avalancheFuji,
} from "viem/chains";

export const SUPPORTED_CHAIN_MAP = {
  mainnet,
  goerli,
  bsc,
  bscTestnet,
  polygon,
  polygonZkEvmTestnet,
  optimism,
  optimismGoerli,
  arbitrum,
  arbitrumGoerli,
  zkSync,
  zkSyncTestnet,
  avalanche,
  avalancheFuji,
};

export const SUPPORTED_CHAINS: Chain[] = Object.values(SUPPORTED_CHAIN_MAP);

export const SUPPORTED_CHAIN_ID_MAP = SUPPORTED_CHAINS.reduce((map, item) => {
  map[item.id] = item;
  return map;
}, {} as { [ChainId: number]: Chain });
