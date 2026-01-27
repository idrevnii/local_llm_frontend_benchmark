import { useState, useMemo, memo } from 'react';
import { FixedSizeList as List } from 'react-window';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface Props {
  products: Product[];
}

// Memoized ProductCard component
const ProductCard = memo(({ product }: { product: Product }) => (
  <div style={{ padding: 16, borderBottom: '1px solid #eee' }}>
    <h3>{product.name}</h3>
    <p>${product.price}</p>
    <span>{product.category}</span>
  </div>
));

ProductCard.displayName = 'ProductCard';

// Virtualized row component
const Row = ({ index, style, data }: { index: number; style: React.CSSProperties; data: Product[] }) => (
  <div style={style}>
    <ProductCard product={data[index]} />
  </div>
);

export default function ProductList({ products }: Props) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Memoized filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !selectedCategory || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  // Memoized unique categories
  const categories = useMemo(() => {
    return [...new Set(products.map(p => p.category))];
  }, [products]);

  // Debounced search handler
  const debouncedSetSearch = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return (value: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setSearch(value), 300);
    };
  }, []);

  return (
    <div>
      <input 
        value={search} 
        onChange={e => debouncedSetSearch(e.target.value)}
        placeholder="Search..."
      />
      
      <div>
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
            style={{ 
              background: cat === selectedCategory ? 'blue' : 'white' 
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ height: 600, width: '100%' }}>
        <List
          height={600}
          itemCount={filteredProducts.length}
          itemSize={80}
          width="100%"
          itemData={filteredProducts}
        >
          {Row}
        </List>
      </div>
    </div>
  );
}
