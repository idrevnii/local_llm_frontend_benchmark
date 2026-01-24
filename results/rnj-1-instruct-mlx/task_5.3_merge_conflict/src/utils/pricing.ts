// src/utils/pricing.ts
// Resolved merge conflict with all business requirements

interface PricingInput {
    basePrice: number;
    discountPercent?: number;
    loyaltyPoints?: number;
    userPointsBalance?: number;
}

interface PricingResult {
  finalPrice: number;
  pointsUsed: number;
  discountApplied: number;
}

/**
 * Calculate final price with both discount and loyalty points redemption
 * 
 * Business requirements:
 * 1. Discounts applied to base price first
 * 2. Loyalty points redeemed after discount
 * 3. Final price cannot be negative
 * 4. Points converted 1:1 to rubles
 * 5. Cannot use more points than available
 * 6. Cannot use more than 50% of price after discount in points
 */
export function calculateFinalPrice(input: PricingInput): PricingResult {
    let price = input.basePrice;
    let pointsUsed = 0;
    let discountApplied = 0;

    // Apply percentage discount first
    if (input.discountPercent && input.discountPercent > 0) {
        discountApplied = price * (input.discountPercent / 100);
        price = price - discountApplied;
    }

    // Redeem loyalty points (1 point = 1 ruble)
    if (input.loyaltyPoints && input.loyaltyPoints > 0 && input.userPointsBalance) {
        // Cannot use more points than user has
        const maxPointsByBalance = Math.min(input.loyaltyPoints, input.userPointsBalance);
        // Cannot use more than 50% of price after discount
        const maxPointsByLimit = Math.min(price * 0.5, price); // 50% of price after discount
        pointsUsed = Math.min(maxPointsByBalance, maxPointsByLimit);
        price = price - pointsUsed;
    }

    // Ensure final price is not negative
    price = Math.max(price, 0);

    return {
        finalPrice: price,
        pointsUsed,
        discountApplied
    };
}
