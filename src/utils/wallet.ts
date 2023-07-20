import {
  generatePrivateKey,
  privateKeyToAccount,
  publicKeyToAddress,
} from "viem/accounts";
import {
  generateMnemonic,
  mnemonicToSeedSync,
} from "ethereum-cryptography/bip39";
import { HDKey } from "ethereum-cryptography/hdkey";
import { wordlist } from "ethereum-cryptography/bip39/wordlists/english";
import { bytesToHex } from "ethereum-cryptography/utils";
import { Address } from "viem";

export const defaultPath = "m/44'/60'/0'/0/0";

export enum MnemonicLen {
  len_12 = 16 * 8,
  len_15 = 20 * 8,
  len_18 = 24 * 8,
  len_21 = 28 * 8,
  len_24 = 32 * 8,
}

// 这个是HDWallet  分层确定钱包， 生成钱包的时候使用
//desc 长度给 16, 20, 24, 28, 32 会生成 12, 15, 18, 21, 24 个 mnemonic 单词
export const getRandomSigningKey = (
  length: MnemonicLen = MnemonicLen.len_12,
  path = defaultPath
) => {
  const mnemonic = generateMnemonic(wordlist, length);
  const seedArr = mnemonicToSeedSync(mnemonic);
  const hdkey = HDKey.fromMasterSeed(seedArr).derive(path);
  const { privateKey, publicKey } = hdkey;
  const _privateKey = `0x${bytesToHex(privateKey!)}`;
  const _publicKey: Address = `0x${bytesToHex(publicKey!)}`;

  return {
    privateKey: _privateKey,
    publicKey: _publicKey,
    mnemonic,
    address: publicKeyToAddress(_publicKey),
  };
};

// 这个是Nodeterministic  非确定下钱包 计算靓号的时候使用
export const getRandomSigningKey2 = () => {
  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);
  return {
    privateKey,
    address: account.address,
    publicKey: account.publicKey,
  };
};
