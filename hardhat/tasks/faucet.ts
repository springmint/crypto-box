import fs from "node:fs";
import { task } from "hardhat/config";

task("faucet", "Cpbox faucet")
  .addPositionalParam("receiver")
  .setAction(async ({ receiver }, { ethers }) => {
    const addressesFile = __dirname + "/../token/cpbox-info.json";

    if (!fs.existsSync(addressesFile)) {
      console.error("You need to deploy your contract first");
      return;
    }

    const addressJson = fs.readFileSync(addressesFile).toString();
    const address = JSON.parse(addressJson);

    if ((await ethers.provider.getCode(address.Token)) === "0x") {
      console.error("You need to deploy your contract first");
      return;
    }

    const token = await ethers.getContractAt("Token", address.Token);

    const tx = await token.transfer(receiver, 10_000);
    await tx.wait();

    console.log(`Transferred 10_000 tokens to ${receiver}`);
  });
