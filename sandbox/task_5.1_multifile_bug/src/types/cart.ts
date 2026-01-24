export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    addedAt: Date;  // Важно: Date объект
}

export interface Cart {
    items: CartItem[];
    updatedAt: Date;
}
