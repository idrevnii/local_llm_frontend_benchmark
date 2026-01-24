import { useState, useMemo } from 'react';

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

const calculateFinalPrice = (price: number, discount?: number): number => {
  if (!discount) return price;
  return price - (price * discount / 100);
};

const formatPrice = (price: number, currency: string): string => {
  return `${currency}${price.toFixed(2)}`;
};

export default function ProductCard({ product, onAddToCart, currency }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Memoize price calculations
  const finalPrice = useMemo(() => calculateFinalPrice(product.price, product.discount), [product.price, product.discount]);
  const formattedPrice = useMemo(() => formatPrice(finalPrice, currency), [finalPrice, currency]);
  const formattedOriginalPrice = useMemo(() => formatPrice(product.price, currency), [product.price, currency]);
  
  // Use useCallback for event handler
  const handleClick = () => {
    onAddToCart(product);
  };
  
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
