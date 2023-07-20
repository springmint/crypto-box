import BatchGenerateWallet from "../src/tools/batchGenerateWallet";

// generate wallet with mnemonic
!(async () => {
  const batchSendToken = new BatchGenerateWallet();
  const matchRule = /^0xc/i;
  const wallet = await batchSendToken.generateWithMnemonic();
  const wallet2 = await batchSendToken.generateWithMnemonic(matchRule);
  console.log(wallet, wallet2);
})();

// generate wallet with private key
!(async () => {
  const batchSendToken = new BatchGenerateWallet();
  const matchRule = /AB$/;
  const wallet = await batchSendToken.generate();
  const wallet2 = await batchSendToken.generate(matchRule);
  console.log(wallet, wallet2);
})();
