import { createContext, useContext, ReactNode, useCallback, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Cart, CartItem } from '../types/cart';

interface CartContextType {
    cart: Cart;
    addItem: (item: Omit<CartItem, 'quantity' | 'addedAt'>) => void;
    removeItem: (id: string) => void;
    getItemCount: () => number;
    getTotalPrice: () => number;
}

// Default empty cart
const defaultCart: Cart = {
    items: [],
    updatedAt: new Date()
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useLocalStorage<Cart>('shopping-cart', defaultCart);

    const addItem = useCallback((newItem: Omit<CartItem, 'quantity' | 'addedAt'>) => {
        const existingIndex = cart.items.findIndex(i => i.id === newItem.id);

        if (existingIndex >= 0) {
            // Item exists, increment quantity
            const updatedItems = cart.items.map((item, idx) =>
                idx === existingIndex
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
            setCart({
                items: updatedItems,
                updatedAt: new Date()
            });
        } else {
            // New item
            const newCartItem: CartItem = {
                ...newItem,
                quantity: 1,
                addedAt: new Date()
            };
            setCart({
                items: [...cart.items, newCartItem],
                updatedAt: new Date()
            });
        }
    }, [cart, setCart]);

    const removeItem = useCallback((id: string) => {
        setCart({
            items: cart.items.filter(item => item.id !== id),
            updatedAt: new Date()
        });
    }, [cart, setCart]);

    const getItemCount = useCallback(() => {
        return cart.items.reduce((sum, item) => sum + item.quantity, 0);
    }, [cart.items]);

    const getTotalPrice = useCallback(() => {
        return cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }, [cart.items]);

    const value = useMemo(() => ({
        cart,
        addItem,
        removeItem,
        getItemCount,
        getTotalPrice
    }), [cart, addItem, removeItem, getItemCount, getTotalPrice]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
}
