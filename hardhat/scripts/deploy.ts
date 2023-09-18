import { Token } from "../typechain-types/contracts/Token";
import { ethers, artifacts } from "hardhat";
import path from "node:path";
import fs from "node:fs";

async function main() {
  const token = await ethers.deployContract("Token", ["Crypto box", "CPBOX"]);

  await token.waitForDeployment();

  saveTokenInfo(token);
  overrideEnv(token);
}

function saveTokenInfo(token: Token) {
  const contractsDir = path.join(__dirname, "../token");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "cpbox-info.json"),
    JSON.stringify({ tokenAddress: token.target }, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync("Token");
  fs.writeFileSync(
    path.join(contractsDir, "cpbox-abi.json"),
    JSON.stringify(TokenArtifact, null, 2)
  );
}

function overrideEnv(token: Token) {
  const envFile = path.join(__dirname, "../../.dev.env");
  const envBarFile = path.join(__dirname, "../../.dev.env.bar");

  const fileContent = fs.readFileSync(envBarFile).toString();
  fs.writeFileSync(
    envFile,
    fileContent
      .split("\n")
      .map((row) =>
        row.replace(
          /CPBOX_TOKEN_ADDRESS\s*=\s*[0-9a-fA-FxX]*$/,
          `CPBOX_TOKEN_ADDRESS = ${token.target}`
        )
      )
      .join("\n")
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
