interface PricingInput {
    basePrice: number;
    discountPercent?: number;
    loyaltyPoints?: number;
    userPointsBalance?: number;
}

interface PricingResult {
  finalPrice: number;
  pointsUsed: number;
}

/**
 * Calculate final price with discount and loyalty points redemption
 */
export function calculateFinalPrice(input: PricingInput): PricingResult {
  let price = input.basePrice;
  let pointsUsed = 0;

  // Apply percentage discount first (to base price)
  if (input.discountPercent !== undefined && input.discountPercent > 0) {
    const discount = price * (input.discountPercent / 100);
    price = price - discount;
  }

  // Price cannot be negative after any operations
  price = Math.max(price, 0);

  // Redeem loyalty points (1 point = 1 ruble)
  if (input.loyaltyPoints !== undefined && input.loyaltyPoints > 0 && input.userPointsBalance !== undefined) {
    // Cannot use more points than user has
    const maxPoints = Math.min(input.loyaltyPoints, input.userPointsBalance);
    // Cannot reduce price below 0
    pointsUsed = Math.min(maxPoints, price);
    price = price - pointsUsed;
  }

  return {
    finalPrice: Math.max(price, 0),
    pointsUsed
  };
}
