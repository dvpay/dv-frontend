export function round(num: number | string, precision: number): number {
  return Number(`${Math.round(Number(`${num}e+${precision}`))}e-${precision}`);
}
