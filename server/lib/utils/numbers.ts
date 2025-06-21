export function roundTo(value: number, decimals: number = 2): number {
  return Number(value.toFixed(decimals));
}

export function roundDecimals(num: number, decimals = 1) {
  const fator = Math.pow(10, decimals);
  return Math.round(num * fator) / fator;
}
