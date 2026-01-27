// ProductCard.tsx — REFACTORED
import { useState, useEffect, useMemo, useCallback } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  discount?: number;
}

type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY';

interface Props {
  product: Product;
  onAddToCart: (product: Product) => void;
  currency: Currency;
}

export default function ProductCard({ product, onAddToCart, currency }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Memoized price calculation
  const finalPrice = useMemo(() => {
    if (product.discount) {
      return product.price - (product.price * product.discount / 100);
    }
    return product.price;
  }, [product.price, product.discount]);
  
  // Memoized formatted prices
  const formattedPrice = useMemo(() => {
    return `${currency}${finalPrice.toFixed(2)}`;
  }, [currency, finalPrice]);
  
  const formattedOriginalPrice = useMemo(() => {
    return `${currency}${product.price.toFixed(2)}`;
  }, [currency, product.price]);
  
  // Memoized click handler
  const handleClick = useCallback(() => {
    onAddToCart(product);
  }, [onAddToCart, product]);
  
  // Memoized hover handlers
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);
  
  // Fixed effect with proper dependency
  useEffect(() => {
    console.log('Product rendered');
  }, [product.id]);
  
  return (
    <div 
      style={{ border: isHovered ? '2px solid blue' : '1px solid gray' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
