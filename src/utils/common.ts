import BigNumber from "bignumber.js";

export function sleep(time: number = 1500): Promise<void> {
  return new Promise((resolve) => setTimeout(() => resolve(), time));
}

export function isNumber(num: number | string) {
  return !BigNumber(num).isNaN();
}

export const cutBreak = (text: string, isTrimEmpty: boolean = true) => {
  const splited = text.split(/\n|\r\n/g).map((t) => t.trim());
  return isTrimEmpty ? splited.filter(Boolean) : splited;
};

export function simplifyNumber(
  num: Numberify,
  decimal = 3,
  rm: BigNumber.RoundingMode = BigNumber.ROUND_HALF_UP
) {
  num = num.toString();
  if (!isNumber(num)) return num;
  const size = 1000;
  let bignumber = BigNumber(num);
  if (bignumber.lt(size)) return fixedPresicion(num, decimal, rm);

  let i = 0;
  const unit = ["", "K", "M", "B"];
  while (++i < unit.length) {
    bignumber = bignumber.div(size);
    if (bignumber.lt(size)) break;
  }

  return fixedPresicion(bignumber.toFixed(), 1, rm) + unit[i];
}

export function fixedPresicion(
  num: Numberify,
  precision = 6,
  rm: BigNumber.RoundingMode = BigNumber.ROUND_HALF_UP
) {
  num = num.toString();
  if (!isNumber(num)) return num;
  return parseFloat(BigNumber(num).toFixed(precision, rm)).toString();
}

export function formatDecimal(num: Numberify, decimal = 18) {
  num = num.toString();
  if (!isNumber(num)) return num;
  const factor = BigNumber(10).pow(decimal);
  return BigNumber(num).div(factor).toFixed();
}

export function parseDecimal(num: Numberify, decimal: number = 18) {
  num = num.toString();
  if (!isNumber(num)) return num;
  const factor = BigNumber(10).pow(decimal);
  return BigNumber(num).times(factor).toFixed();
}

export function readabilityNumber(num: Numberify, precision = 2) {
  num = num.toString();
  if (!isNumber(num)) return num;
  return BigNumber(num).toFormat(precision, {
    decimalSeparator: ".",
    groupSeparator: ",",
    groupSize: 3,
  });
}

export function toPercentage(num: Numberify, precision = 2) {
  num = num.toString();
  if (!isNumber(num)) return num;
  return parseFloat(BigNumber(num).times(100).toFixed(precision)) + "%";
}
