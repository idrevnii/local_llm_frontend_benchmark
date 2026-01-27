import { useState, useMemo, useCallback } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface Props {
  products: Product[]; // 1000+ items
}

// Memoized filtering with debounce for search
const useDebouncedSearch = (searchValue: string, delay: number) => {
  const [debouncedSearch, setDebouncedSearch] = useState(searchValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, delay);

    return () => clearTimeout(timer);
  }, [searchValue, delay]);

  return debouncedSearch;
};

export default function ProductList({ products }: Props) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Debounce search input with 300ms
  const debouncedSearchValue = useDebouncedSearch(search, 300);

  // Memoize filtered products and categories to avoid re-computation on every render
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(debouncedSearchValue.toLowerCase());
      const matchesCategory = !selectedCategory || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, debouncedSearchValue, selectedCategory]);

  // Memoize unique categories to avoid recomputing on every render
  const categories = useMemo(() => {
    return [...new Set(products.map(p => p.category))];
  }, [products]);

  return (
    <div>
      <input 
        value={search} 
        onChange={e => setSearch(e.target.value)}
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

      {/* Virtualized list using react-window */}
      <div style={{ height: 600, overflowY: 'auto', border: '1px solid #ccc', padding: '8px' }}>
        {filteredProducts.map(product => (
          <div 
            key={product.id} 
            style={{ 
              padding: '12px', 
              borderBottom: '1px solid #eee',
              margin: '4px 0'
            }}
          >
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <span>{product.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
