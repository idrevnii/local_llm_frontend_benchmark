// src/utils/pricing.ts
// Git merge conflict - разреши его!

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

    // Apply percentage discount to base price
    if (input.discountPercent && input.discountPercent > 0) {
        const discount = price * (input.discountPercent / 100);
        price = price - discount;
    }

    // Apply loyalty points redemption (1 point = 1 ruble)
    if (input.loyaltyPoints && input.loyaltyPoints > 0 && input.userPointsBalance) {
        // Cannot use more points than user has
        const maxPoints = Math.min(input.loyaltyPoints, input.userPointsBalance);
        // Cannot use more points than 50% of the price after discount
        const maxPointsByPrice = Math.floor(price * 0.5);
        pointsUsed = Math.min(maxPoints, maxPointsByPrice);
        price = price - pointsUsed;
    }

    // Price cannot be negative
    return {
        finalPrice: Math.max(price, 0),
        pointsUsed
    };
}
