export function numberFormatter(num: number | string, precision?: number): string {
  const priceFormatterDigits = new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    maximumFractionDigits: precision || 0,
  });
  return priceFormatterDigits.format(Number(num)).split(',').join('.');
}
