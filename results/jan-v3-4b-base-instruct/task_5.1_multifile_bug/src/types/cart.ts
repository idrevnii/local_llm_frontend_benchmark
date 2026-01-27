export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    addedAt: string;  // Changed from Date to string
}

export interface Cart {
    items: CartItem[];
    updatedAt: string;  // Changed from Date to string
}
