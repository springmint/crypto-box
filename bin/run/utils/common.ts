import { readFileSync } from "node:fs";
import { cutBreak } from "src/utils";

export function beautifyJson(
  json: object,
  keys: Array<string> | null,
  space = 0
) {
  return JSON.stringify(
    json,
    (key, value) => {
      let hasKey = true;
      if (keys) hasKey = keys.includes(key);
      if (value !== json && !hasKey) {
        return undefined;
      }
      if (typeof value === "function") {
        return undefined;
      }
      if (typeof value === "bigint") {
        return String(value);
      }
      return value;
    },
    space
  );
}

export function arrToTable(arr: any[], columns: string[]) {
  return arr.reduce((str, item) => {
    columns.forEach((column, index) => {
      str +=
        index === columns.length - 1 ? `${item[column]}\n` : `${item[column]},`;
    });
    return str;
  }, `${columns.join(",")}\n`);
}

export const trimArrItem = (arr: string[]) => {
  return arr.map((item) => item.trim());
};

export async function readFile(file: string, format: string) {
  const separatRule = /,|:/;
  const keyOrSeparators = trimArrItem(format.split(separatRule));

  const fileStr = await readFileSync(file, "utf-8");
  const rows = cutBreak(fileStr);

  return rows.map((row) => {
    const rowItems = trimArrItem(row.split(separatRule));
    const map = {} as Record<string, string>;
    keyOrSeparators.forEach((keyOrSeparator, index) => {
      const rowItem = rowItems[index];
      map[keyOrSeparator] = rowItem;
    });
    return map;
  });
}

export async function readFiles(files: Array<string>, format: string) {
  let arr = [] as Array<Record<string, string>>;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const rows = await readFile(file, format);
    arr = [...arr, ...rows];
  }
  return arr;
}
