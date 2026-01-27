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
      // BUG: mutation of existing array directly without updating state
      // This change was not reflected in the state because we only modified the local `items` array
      // and did not call setItems() with the updated array. The React state is immutable.
      // As a result, the cart counter did not update immediately when an item's quantity increased.
      items[existingIndex].quantity += 1;
      setItems(items); // This line was incorrect — it should have been replaced with a proper array update
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
