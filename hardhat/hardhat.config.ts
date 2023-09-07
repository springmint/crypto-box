import dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

dotenv.config({ path: "../.dev.env" });

const CHAIN_ID = Number(process.env.CPBOX_CHAIN_ID);

const BLOCK_NUMBER = 9400000;
const BALANCE = String(1e18 * 10); // 10ETH「每个私钥分配」
const INFURA_API_KEY = "a61e87b2fcae4aae8adcee3c7f9be805";

const privates = JSON.parse(
  process.env.CPBOX_PRIVATE_KEY_LIST as string
) as Array<string>;

const accounts = privates.map((privateKey) => ({
  privateKey,
  balance: BALANCE,
}));

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    localhost: {
      url: process.env.CPBOX_RPC_URL,
    },
    hardhat: {
      chainId: CHAIN_ID,
      forking: {
        url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
        blockNumber: BLOCK_NUMBER,
      },
      accounts,
    },
  },
};

export default config;
