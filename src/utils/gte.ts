import Decimal from 'decimal.js-light';

// Returns true if the value of this num1 is greater than or equal to the value of num2, otherwise returns false
export function gte(num1: number | string, num2: number | string): boolean {
  return new Decimal(num1).gte(new Decimal(num2));
}
