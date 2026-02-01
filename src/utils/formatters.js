/**
 * Formats numbers into currency (USD).
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

/**
 * Formats large numbers for impact stats (e.g., 1200 -> 1.2k).
 */
export const formatImpact = (value) => {
  return new Intl.NumberFormat('en-US', {
    notation: "compact",
    compactDisplay: "short",
  }).format(value);
};