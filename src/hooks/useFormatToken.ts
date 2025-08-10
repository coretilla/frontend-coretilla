export function formatToken(amount: number): string {
  const decimals = amount >= 1 ? 2 : 8;
  return parseFloat(amount.toFixed(decimals)).toString();
}
