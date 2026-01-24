# Task 3.1: Component Refactoring

Refactor this React component:
- Remove code duplication
- Add memoization where needed for performance
- Fix potential bugs
- Improve TypeScript typing

## Source code to refactor

```tsx
// ProductCard.tsx — NEEDS REFACTORING
import { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  discount?: number;
}

interface Props {
  product: Product;
  onAddToCart: (product: Product) => void;
  currency: string;
}

export default function ProductCard({ product, onAddToCart, currency }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Bug: calculation in render without memoization
  let finalPrice = product.price;
  if (product.discount) {
    finalPrice = product.price - (product.price * product.discount / 100);
  }
  
  // Duplication: price formatting
  const formattedPrice = currency + finalPrice.toFixed(2);
  const formattedOriginalPrice = currency + product.price.toFixed(2);
  
  // Potential bug: new function on every render
  const handleClick = () => {
    onAddToCart(product);
  };
  
  // Strange effect without dependencies
  useEffect(() => {
    console.log('Product rendered');
  });
  
  return (
    <div 
      style={{ border: isHovered ? '2px solid blue' : '1px solid gray' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3>{product.name}</h3>
      {product.discount && (
        <div>
          <span style={{ textDecoration: 'line-through' }}>
            {formattedOriginalPrice}
          </span>
          <span style={{ color: 'red' }}> -{product.discount}%</span>
        </div>
      )}
      <p>{formattedPrice}</p>
      <button onClick={handleClick}>Add to Cart</button>
    </div>
  );
}
```

## Expected file
Create refactored `ProductCard.tsx` in this directory.
