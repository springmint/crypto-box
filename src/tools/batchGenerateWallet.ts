import {
  getRandomSigningKey,
  getRandomSigningKey2,
  sleep,
  MnemonicLen,
  defaultPath,
} from "../utils";

class BatchGenerateWallet {
  constructor(public len = MnemonicLen.len_12, public path = defaultPath) {}

  async generateWithMnemonic(matchRule?: RegExp) {
    while (true) {
      const signingKey = getRandomSigningKey(this.len, this.path);
      if (!matchRule || matchRule.test(signingKey.address)) {
        return signingKey;
      }
      await sleep(0);
    }
  }

  async generate(matchRule?: RegExp) {
    while (true) {
      const signingKey = getRandomSigningKey2();
      if (!matchRule || matchRule.test(signingKey.address)) {
        return signingKey;
      }
      await sleep(0);
    }
  }
}

export default BatchGenerateWallet;
