import { useState, useMemo } from 'react';
import debounce from 'lodash.debounce';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface Props {
  products: Product[];
}

export default function ProductList({ products }: Props) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Debounced search handler
  const debouncedSearch = useMemo(() => 
    debounce((value: string) => setSearch(value), 300), 
    []
  );

  // Memoize filtered products and categories
  const { filteredProducts, categories } = useMemo(() => {
    const filtered = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !selectedCategory || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    const uniqueCategories = [...new Set(products.map(p => p.category))];
    
    return { filteredProducts: filtered, categories: uniqueCategories };
  }, [products, search, selectedCategory]);

  return (
    <div>
      <input 
        value={search} 
        onChange={e => debouncedSearch(e.target.value)}
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

      <div>
        {filteredProducts.map(product => (
          <div key={product.id} style={{ padding: 16, borderBottom: '1px solid #eee' }}>
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <span>{product.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
