/**
 *
 * Takes in the current and new price, along with the previous percentage change that lead to the current price.
 * Calculates the new percentage change for a timeframe
 *
 * @param currentPrice the price before the change
 * @param newPrice the price after the change
 * @param currentPercent the percentage change amount that led to the current price
 * @returns
 */
export const getUpdatedPercentChange = (
  currentPrice: number,
  newPrice: number,
  currentPercent: number
) => {
  // Recover the original baseline price from currentPrice and currentChangePercent
  const priceBeforePercentageChange = currentPrice / (1 + currentPercent / 100);

  // Compute the new percent change from baseline to newPrice
  const newPercentageChange =
    ((newPrice - priceBeforePercentageChange) / priceBeforePercentageChange) *
    100;

  return newPercentageChange;
};
