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
        index === columns.length - 1
          ? `${item[column] || "-"}\n`
          : `${item[column] || "-"},`;
    });
    return str;
  }, `${columns.join(",")}\n`);
}

export const trimArrItem = (arr: string[]) => {
  return arr.map((item) => item.trim());
};

type ParseFormat<
  T extends string,
  S extends string = "," | ":"
> = T extends `${infer U}${S}${infer O}` ? ParseFormat<U> | ParseFormat<O> : T;

type UnionToObj<T extends string> = { [K in T]: string };

const splitTxt = (
  txt: string,
  separators: Array<string>,
  isRetain: boolean
): Array<string> => {
  const _separators = [...separators];
  const separator = _separators.shift();
  if (!separator) return [txt];
  const [extract, ...other] = txt.split(separator);
  if (other === void 0) return [extract];
  return isRetain
    ? [
        extract,
        separator,
        ...splitTxt(other.join(separator), _separators, isRetain),
      ]
    : [extract, ...splitTxt(other.join(separator), _separators, isRetain)];
};

export const parseInput = <T extends string>(input: string, format: T) => {
  /**
   * @examplez
   * @params format: 'address,tokenId:amount'
   * @params input: '0x00...0000,1:10'
   * @return { address: 0x00...0000, tokenId: 1, amount: 10 }
   */
  const separators = extractSeparators(format);
  const splitedInput = splitTxt(input, separators, false);
  const splitedFromat = splitTxt(format, separators, false);
  return splitedFromat.reduce((map, key, index) => {
    map[key as ParseFormat<T>] = splitedInput[index];
    return map;
  }, {} as UnionToObj<ParseFormat<T>>);
};

export const parseInputList = <T extends string>(
  inputs: Array<string>,
  format: T
) => {
  return inputs.map((input) => parseInput(input, format));
};

export const extractSeparators = (format: string) => {
  const matchRule = new RegExp(`([^0-9a-zA-Z])`, "g");
  return (format.match(matchRule) || []) as Array<string>;
};

export async function readFile<T extends string>(file: string, format: T) {
  const fileStr = await readFileSync(file, "utf-8");
  const rows = cutBreak(fileStr);
  return parseInputList(rows, format);
}

export async function readFiles<T extends string>(
  files: Array<string>,
  format: T
) {
  let arr = [] as Array<Record<string, string>>;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const rows = await readFile(file, format);
    arr = [...arr, ...rows];
  }
  return arr;
}
