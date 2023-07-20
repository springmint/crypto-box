import { Address, isAddress } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { password, input, confirm } from "@inquirer/prompts";

export async function enterPrivateKey(prompt = "Enter private key") {
  return (await password({
    message: prompt,
    mask: "*",
    validate(privateKey) {
      try {
        privateKeyToAccount(privateKey as Address);
        return true;
      } catch (error) {
        return (error as Error).message;
      }
    },
  })) as Address;
}

export async function enterContractAddress(
  prompt = "Enter contract address",
  errorTxt = "invalid address"
) {
  return (await input({
    message: prompt,
    validate(address) {
      const isValidAddress = isAddress(address);
      return isValidAddress ? true : errorTxt;
    },
  })) as Address;
}

export async function toConfirm(
  prompt = "Please confirm",
  confirmTxt = "yes",
  noTxt = "no"
) {
  return await confirm({
    message: prompt,
    default: true,
    transformer(isConfirm) {
      return isConfirm ? confirmTxt : noTxt;
    },
  });
}

export async function enterErc20TokenAddress() {
  return await enterContractAddress(
    "Enter erc20 token address",
    "address must be 20 bytes, hex or bigint, not string"
  );
}

export async function confirmApprove() {
  return await toConfirm(
    "Need approve, Whether to approve",
    "Approve",
    "Reject"
  );
}
