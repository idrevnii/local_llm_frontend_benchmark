# Task 3.2: Performance Optimization

This ProductList component renders 1000 products and is slow during scrolling and search. Analyze the problems and propose optimizations. Implement at least two optimization approaches.

## Source code to optimize

```tsx
// ProductList.tsx — SLOW CODE
import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface Props {
  products: Product[]; // 1000+ items
}

export default function ProductList({ products }: Props) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filtering on every render
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Getting categories on every render
  const categories = [...new Set(products.map(p => p.category))];

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
```

## Expected optimizations
- useMemo for filtering and categories
- useDebounce for search
- Virtualization (react-window)
- React.memo for ProductCard
- Pagination or infinite scroll

## Expected file
Create optimized `ProductList.tsx` in this directory.
