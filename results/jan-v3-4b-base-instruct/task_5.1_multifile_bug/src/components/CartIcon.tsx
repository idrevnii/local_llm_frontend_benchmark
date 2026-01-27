import React from 'react';
import { useCart } from '../context/CartContext';

interface CartIconProps {
    onClick?: () => void;
}

export function CartIcon({ onClick }: CartIconProps) {
    const { getItemCount, getTotalPrice } = useCart();

    const count = getItemCount();
    const total = getTotalPrice();

    // Debug: This shows the issue
    // On first load after refresh, count is 0 even though localStorage has data
    console.log('CartIcon render:', { count, total });

    return (
        <button
            className="cart-icon"
            onClick={onClick}
            aria-label={`Shopping cart with ${count} items`}
        >
            <span className="cart-emoji">🛒</span>
            {count > 0 && (
                <span className="cart-badge">{count}</span>
            )}
            {total > 0 && (
                <span className="cart-total">${total.toFixed(2)}</span>
            )}
        </button>
    );
}

export default CartIcon;
