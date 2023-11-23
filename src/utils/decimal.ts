import Decimal from 'decimal.js-light';

export function decimal(num: number | string): string {
  return new Decimal(num).toString();
}
