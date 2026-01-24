# Уровень 3: Сложные задачи

Задачи, требующие reasoning, понимания контекста и опыта. Ministral 3 14B должен справиться.

---

## Задача 3.1: Рефакторинг компонента

### Промпт
```
Вот React компонент с проблемами. Отрефактори его:
- Убери дублирование кода
- Добавь мемоизацию где нужно для производительности
- Исправь потенциальные баги
- Улучши типизацию TypeScript

Исходный код:
```

### Исходный код для задачи
```tsx
// ProductCard.tsx — ПЛОХОЙ КОД ДЛЯ РЕФАКТОРИНГА
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
  
  // Баг: вычисление в рендере без мемоизации
  let finalPrice = product.price;
  if (product.discount) {
    finalPrice = product.price - (product.price * product.discount / 100);
  }
  
  // Дублирование: форматирование цены
  const formattedPrice = currency + finalPrice.toFixed(2);
  const formattedOriginalPrice = currency + product.price.toFixed(2);
  
  // Потенциальный баг: новая функция на каждый рендер
  const handleClick = () => {
    onAddToCart(product);
  };
  
  // Странный эффект без зависимостей
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

### Критерии оценки
| Критерий | Баллы | Описание |
|----------|-------|----------|
| Компилируется | 0-1 | Нет ошибок |
| Функциональность | 0-3 | Сохранена функциональность |
| Качество кода | 0-2 | useMemo, useCallback, вынесенные функции |
| Edge cases | 0-2 | Исправлен useEffect |
| TypeScript | 0-1 | Улучшенные типы |
| Комментарии | 0-1 | Объяснение изменений |

### Эталонное решение
```tsx
import { useMemo, useCallback, memo } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  discount?: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  currency: string;
}

// Вынесенная утилита форматирования
const formatPrice = (price: number, currency: string): string => {
  return `${currency}${price.toFixed(2)}`;
};

// Вынесенный расчёт финальной цены
const calculateFinalPrice = (price: number, discount?: number): number => {
  if (!discount) return price;
  return price * (1 - discount / 100);
};

function ProductCard({ product, onAddToCart, currency }: ProductCardProps) {
  // Мемоизация вычислений
  const finalPrice = useMemo(
    () => calculateFinalPrice(product.price, product.discount),
    [product.price, product.discount]
  );

  const formattedPrice = useMemo(
    () => formatPrice(finalPrice, currency),
    [finalPrice, currency]
  );

  const formattedOriginalPrice = useMemo(
    () => formatPrice(product.price, currency),
    [product.price, currency]
  );

  // Мемоизация callback
  const handleClick = useCallback(() => {
    onAddToCart(product);
  }, [onAddToCart, product]);

  // Удалён бесполезный useEffect

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      {product.discount && (
        <div className="discount-info">
          <span className="original-price">{formattedOriginalPrice}</span>
          <span className="discount-badge">-{product.discount}%</span>
        </div>
      )}
      <p className="final-price">{formattedPrice}</p>
      <button onClick={handleClick}>Add to Cart</button>
    </div>
  );
}

// React.memo для предотвращения лишних рендеров
export default memo(ProductCard);
```

---

## Задача 3.2: Оптимизация производительности

### Промпт
```
Компонент ProductList рендерит 1000 товаров и тормозит при скролле и 
при изменении поиска. Проанализируй проблемы и предложи оптимизации.
Покажи реализацию как минимум двух способов оптимизации.

Исходный код:
```

### Исходный код для задачи
```tsx
// ProductList.tsx — МЕДЛЕННЫЙ КОД
import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface Props {
  products: Product[]; // 1000+ элементов
}

export default function ProductList({ products }: Props) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Фильтрация на каждый рендер
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Получение категорий на каждый рендер
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

### Критерии оценки
| Критерий | Баллы | Описание |
|----------|-------|----------|
| Компилируется | 0-1 | Нет ошибок |
| Функциональность | 0-3 | Оптимизации работают |
| Качество кода | 0-2 | useMemo, виртуализация, debounce |
| Edge cases | 0-2 | Минимум 2 разных подхода |
| TypeScript | 0-1 | Типизация сохранена |
| Комментарии | 0-1 | Объяснение каждой оптимизации |

### Ожидаемые оптимизации
1. **useMemo** для фильтрации и списка категорий
2. **useDebounce** для поиска
3. **Виртуализация** (react-window / react-virtualized)
4. **React.memo** для ProductCard
5. **Pagination** или **Infinite scroll**

---

## Задача 3.3: Архитектурная задача

### Промпт
```
У нас есть приложение с множеством форм (регистрация, профиль, настройки, 
оформление заказа), которые используют одинаковую логику валидации:
- email, phone, required, minLength, maxLength, pattern

Как бы ты организовал переиспользуемую систему валидации? 
Предложи архитектуру и покажи пример использования.

Требования:
- Декларативное описание правил
- Возможность добавлять кастомные правила
- Типобезопасность (TypeScript)
- Сообщения об ошибках на русском
```

### Критерии оценки
| Критерий | Баллы | Описание |
|----------|-------|----------|
| Компилируется | 0-1 | Нет ошибок |
| Функциональность | 0-3 | Система работает |
| Качество кода | 0-2 | Расширяемость, DRY |
| Edge cases | 0-2 | Кастомные правила, i18n |
| TypeScript | 0-1 | Дженерики, условные типы |
| Комментарии | 0-1 | Документация API |

### Эталонное решение (одно из возможных)
```tsx
// validation/types.ts
type ValidationRule<T = string> = {
  validate: (value: T) => boolean;
  message: string;
};

type ValidationSchema<T> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};

type ValidationErrors<T> = {
  [K in keyof T]?: string;
};

// validation/rules.ts
export const rules = {
  required: (message = 'Обязательное поле'): ValidationRule => ({
    validate: (value) => value !== undefined && value !== null && value !== '',
    message,
  }),

  email: (message = 'Неверный формат email'): ValidationRule => ({
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message,
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    validate: (value) => value.length >= min,
    message: message ?? `Минимум ${min} символов`,
  }),

  phone: (message = 'Неверный формат телефона'): ValidationRule => ({
    validate: (value) => /^\+?[0-9]{10,15}$/.test(value.replace(/\s/g, '')),
    message,
  }),

  custom: <T>(fn: (value: T) => boolean, message: string): ValidationRule<T> => ({
    validate: fn,
    message,
  }),
};

// validation/useValidation.ts
import { useState, useCallback } from 'react';

export function useValidation<T extends Record<string, any>>(
  schema: ValidationSchema<T>
) {
  const [errors, setErrors] = useState<ValidationErrors<T>>({});

  const validateField = useCallback(
    (field: keyof T, value: T[keyof T]): string | undefined => {
      const fieldRules = schema[field];
      if (!fieldRules) return undefined;

      for (const rule of fieldRules) {
        if (!rule.validate(value)) {
          return rule.message;
        }
      }
      return undefined;
    },
    [schema]
  );

  const validateAll = useCallback(
    (data: T): boolean => {
      const newErrors: ValidationErrors<T> = {};
      let isValid = true;

      for (const field in schema) {
        const error = validateField(field, data[field]);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      }

      setErrors(newErrors);
      return isValid;
    },
    [schema, validateField]
  );

  return { errors, validateField, validateAll, setErrors };
}

// Пример использования
interface RegistrationForm {
  email: string;
  password: string;
  phone: string;
}

const registrationSchema: ValidationSchema<RegistrationForm> = {
  email: [rules.required(), rules.email()],
  password: [rules.required(), rules.minLength(8)],
  phone: [rules.phone()],
};

function RegistrationPage() {
  const { errors, validateField, validateAll } = useValidation(registrationSchema);
  // ... использование
}
```

---

## Задача 3.4: Исправление бага по описанию

### Промпт
```
Пользователи жалуются: "После добавления товара в корзину, 
счётчик в хедере обновляется только после перезагрузки страницы."

Проанализируй код контекста корзины, найди и исправь проблему.
Объясни, в чём была ошибка.

Код контекста:
```

### Исходный код для задачи
```tsx
// CartContext.tsx — КОД С БАГОМ
import { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  totalCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    const existingIndex = items.findIndex(i => i.id === newItem.id);
    
    if (existingIndex >= 0) {
      // БАГ: мутация существующего массива
      items[existingIndex].quantity += 1;
      setItems(items);
    } else {
      setItems([...items, { ...newItem, quantity: 1 }]);
    }
  };

  const removeItem = (id: number) => {
    setItems(items.filter(i => i.id !== id));
  };

  // БАГ: вычисление вне useMemo, но это не главная проблема
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, totalCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
```

### Критерии оценки
| Критерий | Баллы | Описание |
|----------|-------|----------|
| Компилируется | 0-1 | Нет ошибок |
| Функциональность | 0-3 | Баг исправлен |
| Качество кода | 0-2 | Иммутабельность |
| Edge cases | 0-2 | Объяснение проблемы |
| TypeScript | 0-1 | Типизация сохранена |
| Комментарии | 0-1 | Объяснение бага |

### Эталонное решение
```tsx
const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
  setItems(prevItems => {
    const existingIndex = prevItems.findIndex(i => i.id === newItem.id);
    
    if (existingIndex >= 0) {
      // ИСПРАВЛЕНО: создаём новый массив и новый объект
      return prevItems.map((item, index) => 
        index === existingIndex 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      return [...prevItems, { ...newItem, quantity: 1 }];
    }
  });
};

// Объяснение бага:
// React сравнивает ссылки на объекты. Когда мы делаем:
// items[existingIndex].quantity += 1;
// setItems(items);
// Мы мутируем существующий объект и передаём ту же ссылку на массив.
// React видит, что ссылка не изменилась, и не перерендеривает компоненты.
```

---

## Итого по Уровню 3

| Задача | Макс. баллов | Минимум для "Успех" |
|--------|--------------|---------------------|
| 3.1 Рефакторинг | 10 | 7 |
| 3.2 Оптимизация | 10 | 7 |
| 3.3 Архитектура | 10 | 6 |
| 3.4 Баг-фикс | 10 | 7 |

**Общий минимум для прохождения уровня:** 27/40 баллов
