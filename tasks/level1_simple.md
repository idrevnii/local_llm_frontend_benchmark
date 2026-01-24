# Уровень 1: Простые задачи

Задачи, с которыми должны справиться все модели (включая Qwen3-4B).

---

## Задача 1.1: Базовый React компонент

### Промпт
```
Создай React компонент Button на TypeScript, который принимает props: 
- text (string) — текст кнопки
- onClick (function) — обработчик клика
- disabled (boolean, optional) — отключённое состояние

Экспортируй компонент как default.
```

### Критерии оценки
| Критерий | Баллы | Описание |
|----------|-------|----------|
| Компилируется | 0-1 | Нет синтаксических ошибок TypeScript |
| Функциональность | 0-3 | Кнопка рендерится, onClick работает, disabled отключает |
| Качество кода | 0-2 | Читаемость, именование |
| Edge cases | 0-2 | disabled блокирует onClick |
| TypeScript | 0-1 | Props типизированы через interface/type |
| Комментарии | 0-1 | Объяснение (не обязательно для простых задач) |

### Эталонное решение
```tsx
interface ButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function Button({ text, onClick, disabled = false }: ButtonProps) {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      {text}
    </button>
  );
}
```

---

## Задача 1.2: CSS Flexbox центрирование

### Промпт
```
Напиши CSS для класса .container, чтобы его дочерние элементы 
были центрированы по горизонтали и вертикали.
```

### Критерии оценки
| Критерий | Баллы | Описание |
|----------|-------|----------|
| Компилируется | 0-1 | Валидный CSS |
| Функциональность | 0-3 | Элементы центрируются |
| Качество кода | 0-2 | Лаконичность решения |
| Edge cases | 0-2 | Работает для любого количества детей |
| TypeScript | - | Не применимо |
| Комментарии | 0-1 | Не обязательно |

### Эталонное решение
```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

**Альтернативы (тоже засчитываются):**
```css
/* Grid вариант */
.container {
  display: grid;
  place-items: center;
}
```

---

## Задача 1.3: Простой useState хук

### Промпт
```
Напиши React компонент Counter на TypeScript с кнопками + и -, 
который показывает текущее число. Начальное значение — 0.
```

### Критерии оценки
| Критерий | Баллы | Описание |
|----------|-------|----------|
| Компилируется | 0-1 | Нет ошибок TypeScript |
| Функциональность | 0-3 | Счётчик работает в обе стороны |
| Качество кода | 0-2 | useState используется правильно |
| Edge cases | 0-2 | (не критично для этой задачи) |
| TypeScript | 0-1 | State типизирован |
| Комментарии | 0-1 | Не обязательно |

### Эталонное решение
```tsx
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState<number>(0);

  return (
    <div>
      <button onClick={() => setCount(count - 1)}>-</button>
      <span>{count}</span>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}
```

---

## Итого по Уровню 1

| Задача | Макс. баллов | Минимум для "Успех" |
|--------|--------------|---------------------|
| 1.1 Button | 10 | 7 |
| 1.2 Flexbox | 7 | 5 |
| 1.3 Counter | 10 | 7 |

**Общий минимум для прохождения уровня:** 19/27 баллов
