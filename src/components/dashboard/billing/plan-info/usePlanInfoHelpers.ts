
export function usePlanInfoHelpers() {
  // Format price per credit with proper precision
  const formatPricePerCredit = (price?: number) => {
    if (!price || price < 0.001) return "0.00299";
    // Format with the right number of decimal places and remove trailing zeros
    return price.toFixed(5).replace(/0+$/, '').replace(/\.$/, '.00');
  };

  return {
    formatPricePerCredit
  };
}
