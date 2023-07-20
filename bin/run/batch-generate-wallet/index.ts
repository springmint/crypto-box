import { writeFileSync, appendFileSync } from "node:fs";
import os from "node:os";
import { MnemonicLen, defaultPath } from "src/main";
import WorkerPool from "./workPool";
import logger from "../logger";
import { arrToTable, beautifyJson } from "../utils";

export interface BatchGenerateWalletParams {
  len?: number;
  path?: string;
  count: number;
  prefix?: string;
  suffix?: string;
  caseSensitive?: boolean;
  file: string;
}

interface Wallet {
  privateKey: string;
  publicKey: `0x${string}`;
  mnemonic?: string;
  address: `0x${string}`;
}

const defaultOptions = {
  len: MnemonicLen.len_12,
  path: defaultPath,
  caseSensitive: false,
};

const pool = new WorkerPool(os.availableParallelism());

const generate = async (
  type: "privateKey" | "mnemonic",
  params: BatchGenerateWalletParams
) => {
  const { count } = params;
  let wallets = [] as Wallet[];
  return new Promise<Wallet[]>((resolve) => {
    logger.loading(`Genetating...`);
    for (let i = 0; i < count; i++) {
      pool.runTask(
        { type, ...{ ...defaultOptions, ...params } },
        (err, result) => {
          if (!err) {
            wallets.push(result);
            logger.cover(
              `Progress - ${logger.dye("info", `${wallets.length}/${count}`)}`
            );
            if (wallets.length === count) {
              logger.print(
                `Progress -`,
                logger.dye("info", `${wallets.length}/${count}`)
              );
              pool.close();
              resolve(wallets);
            } else {
              logger.loading(`Genetating...`);
            }
          } else {
            logger.error((err as Error).message);
          }
        }
      );
    }
  });
};

export default async function (
  type: string,
  params: BatchGenerateWalletParams
) {
  logger.info("Batch generate wallet");
  const { file } = params;

  const wallets = await generate(type as "privateKey" | "mnemonic", params);

  const columns = ["privateKey", "address", "publicKey"];
  if (type === "mnemonic") {
    columns.push("mnemonic");
  }
  const tableData = arrToTable(wallets, columns);

  writeFileSync(file, tableData);
  logger.success("Generate Finished");
  process.exit();
}
