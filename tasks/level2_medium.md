# Уровень 2: Средние задачи

Типовые задачи фронтенд-разработки. RNJ-1 и Ministral должны справиться полностью.

---

## Задача 2.1: Кастомный хук useDebounce

### Промпт
```
Реализуй кастомный React хук useDebounce<T>(value: T, delay: number): T, 
который возвращает debounced значение. Хук должен:
- Возвращать value с задержкой delay (в миллисекундах)
- Сбрасывать таймер при изменении value
- Корректно очищать таймер при размонтировании
```

### Критерии оценки
| Критерий | Баллы | Описание |
|----------|-------|----------|
| Компилируется | 0-1 | Нет ошибок TypeScript |
| Функциональность | 0-3 | Debounce работает корректно |
| Качество кода | 0-2 | useEffect + setTimeout |
| Edge cases | 0-2 | Cleanup при unmount |
| TypeScript | 0-1 | Дженерик типизация |
| Комментарии | 0-1 | Объяснение логики |

### Эталонное решение
```tsx
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: сбрасываем таймер при изменении value или unmount
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

---

## Задача 2.2: CSS Grid Layout

### Промпт
```
Создай CSS Grid layout для следующей структуры:
- Header на всю ширину сверху
- Sidebar слева (250px фиксированная ширина)
- Main content справа (занимает оставшееся место)
- Footer на всю ширину снизу

Минимальная высота страницы — 100vh.
Используй семантические имена grid-area.
```

### Критерии оценки
| Критерий | Баллы | Описание |
|----------|-------|----------|
| Компилируется | 0-1 | Валидный CSS |
| Функциональность | 0-3 | Layout соответствует описанию |
| Качество кода | 0-2 | Использование grid-template-areas |
| Edge cases | 0-2 | min-height: 100vh, responsive |
| TypeScript | - | Не применимо |
| Комментарии | 0-1 | Объяснение структуры |

### Эталонное решение
```css
.layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  min-height: 100vh;
}

.header {
  grid-area: header;
}

.sidebar {
  grid-area: sidebar;
}

.main {
  grid-area: main;
}

.footer {
  grid-area: footer;
}
```

---

## Задача 2.3: Компонент с условным рендерингом

### Промпт
```
Создай TypeScript компонент UserCard который:
- Принимает объект user: { name: string, email: string, avatar?: string, role: 'user' | 'admin' }
- Если avatar есть — показывает картинку <img>
- Если avatar нет — показывает initials (первые буквы имени и фамилии)
- Если role === 'admin' — показывает бейдж "Admin" рядом с именем
```

### Критерии оценки
| Критерий | Баллы | Описание |
|----------|-------|----------|
| Компилируется | 0-1 | Нет ошибок TypeScript |
| Функциональность | 0-3 | Все условия работают |
| Качество кода | 0-2 | Чистый JSX, без вложенных тернарников |
| Edge cases | 0-2 | Имя из одного слова, пустой avatar |
| TypeScript | 0-1 | User типизирован корректно |
| Комментарии | 0-1 | Объяснение логики initials |

### Эталонное решение
```tsx
interface User {
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
}

interface UserCardProps {
  user: User;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function UserCard({ user }: UserCardProps) {
  const { name, email, avatar, role } = user;

  return (
    <div className="user-card">
      <div className="avatar">
        {avatar ? (
          <img src={avatar} alt={name} />
        ) : (
          <span className="initials">{getInitials(name)}</span>
        )}
      </div>
      <div className="info">
        <h3>
          {name}
          {role === 'admin' && <span className="badge">Admin</span>}
        </h3>
        <p>{email}</p>
      </div>
    </div>
  );
}
```

---

## Задача 2.4: Форма с валидацией

### Промпт
```
Создай React TypeScript компонент RegistrationForm с полями:
- Email (валидация формата email)
- Password (минимум 8 символов)
- Confirm Password (должен совпадать с Password)

Требования:
- Показывай ошибки под каждым полем
- Кнопка Submit активна только когда форма валидна
- Валидация происходит при потере фокуса (onBlur)
- При успешной отправке выводи alert('Success!')
```

### Критерии оценки
| Критерий | Баллы | Описание |
|----------|-------|----------|
| Компилируется | 0-1 | Нет ошибок TypeScript |
| Функциональность | 0-3 | Все валидации работают |
| Качество кода | 0-2 | State management, без дублирования |
| Edge cases | 0-2 | Кнопка disabled, пустые поля |
| TypeScript | 0-1 | Типизация state и handlers |
| Комментарии | 0-1 | Объяснение валидации |

### Эталонное решение
```tsx
import { useState } from 'react';

interface FormState {
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegistrationForm() {
  const [form, setForm] = useState<FormState>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = (field: keyof FormState, value: string): string | undefined => {
    switch (field) {
      case 'email':
        return !emailRegex.test(value) ? 'Invalid email format' : undefined;
      case 'password':
        return value.length < 8 ? 'Password must be at least 8 characters' : undefined;
      case 'confirmPassword':
        return value !== form.password ? 'Passwords do not match' : undefined;
    }
  };

  const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, [field]: value }));
    
    if (touched[field]) {
      setErrors(prev => ({ ...prev, [field]: validate(field, value) }));
    }
  };

  const handleBlur = (field: keyof FormState) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(prev => ({ ...prev, [field]: validate(field, form[field]) }));
  };

  const isValid = 
    emailRegex.test(form.email) &&
    form.password.length >= 8 &&
    form.password === form.confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      alert('Success!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange('email')}
          onBlur={handleBlur('email')}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div>
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange('password')}
          onBlur={handleBlur('password')}
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>

      <div>
        <input
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange('confirmPassword')}
          onBlur={handleBlur('confirmPassword')}
        />
        {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
      </div>

      <button type="submit" disabled={!isValid}>
        Register
      </button>
    </form>
  );
}
```

---

## Задача 2.5: CSS анимация

### Промпт
```
Создай CSS анимацию для loading spinner:
- Круглая форма (border-radius)
- Часть границы другого цвета (создаёт эффект вращения)
- Бесконечное вращение с плавной анимацией
- Размер: 40x40 пикселей
```

### Критерии оценки
| Критерий | Баллы | Описание |
|----------|-------|----------|
| Компилируется | 0-1 | Валидный CSS |
| Функциональность | 0-3 | Спиннер вращается бесконечно |
| Качество кода | 0-2 | @keyframes, animation shorthand |
| Edge cases | 0-2 | Плавность (linear или ease) |
| TypeScript | - | Не применимо |
| Комментарии | 0-1 | Не обязательно |

### Эталонное решение
```css
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
```

---

## Итого по Уровню 2

| Задача | Макс. баллов | Минимум для "Успех" |
|--------|--------------|---------------------|
| 2.1 useDebounce | 10 | 7 |
| 2.2 Grid Layout | 9 | 6 |
| 2.3 UserCard | 10 | 7 |
| 2.4 Форма | 10 | 7 |
| 2.5 CSS animation | 9 | 6 |

**Общий минимум для прохождения уровня:** 33/48 баллов
