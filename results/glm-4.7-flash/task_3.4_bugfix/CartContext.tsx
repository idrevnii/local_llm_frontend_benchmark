// CartContext.tsx — FIXED VERSION
import { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  totalCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    const existingIndex = items.findIndex(i => i.id === newItem.id);
    
    if (existingIndex >= 0) {
      // BUG FIX: Instead of mutating the existing array directly,
      // we create a copy of the array and update the quantity in the copy.
      // This ensures React detects the state change and triggers a re-render.
      const updatedItems = [...items];
      updatedItems[existingIndex].quantity += 1;
      setItems(updatedItems);
    } else {
      setItems([...items, { ...newItem, quantity: 1 }]);
    }
  };

  const removeItem = (id: number) => {
    setItems(items.filter(i => i.id !== id));
  };

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, totalCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
