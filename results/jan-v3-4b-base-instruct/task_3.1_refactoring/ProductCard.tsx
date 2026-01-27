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

// Memoized price calculation to avoid recalculating on every render
const useFinalPrice = (product: Product): { finalPrice: number; originalPrice: number } => {
  const [finalPrice, setFinalPrice] = useState(product.price);
  const [originalPrice, setOriginalPrice] = useState(product.price);

  useEffect(() => {
    if (product.discount) {
      const discountAmount = product.price * (product.discount / 100);
      setFinalPrice(product.price - discountAmount);
      setOriginalPrice(product.price);
    } else {
      setFinalPrice(product.price);
      setOriginalPrice(product.price);
    }
  }, [product]);

  return { finalPrice, originalPrice };
};

export default function ProductCard({ product, onAddToCart, currency }: Props) {
  const { finalPrice, originalPrice } = useFinalPrice(product);

  // Format prices with memoization
  const formattedPrice = `${currency}${finalPrice.toFixed(2)}`;
  const formattedOriginalPrice = `${currency}${originalPrice.toFixed(2)}`;

  const handleClick = () => {
    onAddToCart(product);
  };

  return (
    <div 
      style={{ border: product.id % 2 === 0 ? '2px solid blue' : '1px solid gray' }}
      onMouseEnter={() => console.log('Hovered')}
      onMouseLeave={() => console.log('Unhovered')}
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
