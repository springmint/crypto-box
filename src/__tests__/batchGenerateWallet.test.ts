import BatchGenerateWallet from "../tools/batchGenerateWallet";
import { describe, expect, it } from "@jest/globals";

describe("batch generate wallet", () => {
  it("common wallet with mnemonic", async () => {
    const batchSendToken = new BatchGenerateWallet();
    const wallet = await batchSendToken.generateWithMnemonic();
    expect(wallet).toHaveProperty("address");
    expect(wallet).toHaveProperty("privateKey");
    expect(wallet).toHaveProperty("publicKey");
    expect(wallet).toHaveProperty("mnemonic");
    expect(wallet.address).toHaveLength(42);
  });

  it("common wallet", async () => {
    const batchSendToken = new BatchGenerateWallet();
    const wallet = await batchSendToken.generate();
    expect(wallet).toHaveProperty("address");
    expect(wallet).toHaveProperty("privateKey");
    expect(wallet).toHaveProperty("publicKey");
    expect(wallet).not.toHaveProperty("mnemonic");
    expect(wallet.address).toHaveLength(42);
  });

  it("special wallet with mnemonic", async () => {
    const batchSendToken = new BatchGenerateWallet();
    const matchRule = /^0xc/i;
    const wallet = await batchSendToken.generateWithMnemonic(matchRule);
    expect(wallet).toHaveProperty("address");
    expect(wallet).toHaveProperty("privateKey");
    expect(wallet).toHaveProperty("publicKey");
    expect(wallet).toHaveProperty("mnemonic");
    expect(wallet.address).toHaveLength(42);
    expect(wallet.address).toMatch(matchRule);
  }, 60000);

  it("special wallet", async () => {
    const batchSendToken = new BatchGenerateWallet();
    const matchRule = /AB$/;
    const wallet = await batchSendToken.generate(matchRule);
    expect(wallet).toHaveProperty("address");
    expect(wallet).toHaveProperty("privateKey");
    expect(wallet).toHaveProperty("publicKey");
    expect(wallet).not.toHaveProperty("mnemonic");
    expect(wallet.address).toHaveLength(42);
    expect(wallet.address).toMatch(matchRule);
  }, 60000);
});
