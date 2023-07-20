import { parentPort } from "node:worker_threads";
import BatchGenerateWallet from "src/tools/batchGenerateWallet";

export interface Task {
  type: string;
  len: number;
  path: string;
  prefix?: string;
  suffix?: string;
  caseSensitive: boolean;
}

export const runTask = async (task: Task) => {
  let { type, len, path, prefix, suffix, caseSensitive } = task;
  const batchGenerateWallet = new BatchGenerateWallet(len, path);

  let rule: RegExp | undefined;
  if (prefix) {
    rule = new RegExp(`^0x${prefix}`, caseSensitive ? "" : "i");
  }
  if (suffix) {
    rule = new RegExp(`${suffix}$`, caseSensitive ? "" : "i");
  }

  if (type === "privateKey") {
    return await batchGenerateWallet.generate(rule);
  } else {
    return await batchGenerateWallet.generateWithMnemonic(rule);
  }
};

parentPort!.on("message", async (task: Task) => {
  const wallet = await runTask(task);
  parentPort!.postMessage(wallet);
});
