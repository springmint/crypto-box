import { SUPPORTED_CHAIN_ID_MAP } from "../constants";

export function getNativeCurrency(chainId: number) {
  return SUPPORTED_CHAIN_ID_MAP[chainId].nativeCurrency;
}
