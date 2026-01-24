# Уровень 4: Провальные задачи

Задачи, где все модели должны провалиться. Цель — показать границы применимости локальных LLM.

---

## Задача 4.1: Сложная бизнес-логика (Календарь бронирования)

### Промпт
```
Реализуй React TypeScript компонент BookingCalendar со следующими требованиями:

Функциональность:
1. Показывает текущий месяц с возможностью переключения
2. Пользователь выбирает период (date range): дату заезда и выезда
3. Некоторые даты недоступны (передаются через props blockedDates)
4. Минимальный период бронирования — 3 ночи
5. Нельзя выбирать даты в прошлом

UX требования:
6. При наведении на дату показывать tooltip с количеством ночей
7. При выборе первой даты подсвечивать доступный период
8. Невозможные для выбора даты (меньше 3 ночей до заблокированной) должны быть визуально отключены

Технические требования:
9. Учитывать timezone пользователя
10. Компонент должен быть controlled (value/onChange)
11. Полная типизация TypeScript, без any

Props:
- value: { startDate: Date | null, endDate: Date | null }
- onChange: (range: { startDate: Date, endDate: Date }) => void
- blockedDates: Date[]
- minNights?: number (default 3)
- timezone?: string
```

### Почему модели провалятся

1. **Слишком много взаимосвязанных требований** — 11 пунктов, которые влияют друг на друга
2. **Edge cases:**
   - Что если blockedDate в середине выбранного периода?
   - Что если между двумя заблокированными датами меньше minNights?
   - Переход между месяцами при выбранной первой дате
   - DST (переход на летнее/зимнее время)
3. **Timezone handling** — требует глубокого понимания работы с датами
4. **Размер кода** — полная реализация 300-500 строк

### Критерии оценки

| Критерий | Баллы | Описание |
|----------|-------|----------|
| Компилируется | 0-1 | Нет ошибок TypeScript |
| Функциональность | 0-3 | Сколько требований реализовано |
| Качество кода | 0-2 | Структура, разделение логики |
| Edge cases | 0-2 | Обработка граничных случаев |
| TypeScript | 0-1 | Нет any, строгие типы |
| Комментарии | 0-1 | Документация сложной логики |

### Ожидаемый результат от моделей

- **Qwen3-4B:** Даёт базовый календарь с выбором дат, но без большинства требований (2-3 балла)
- **RNJ-1 8B:** Реализует 4-5 требований, но ломается на edge cases (4-5 баллов)
- **Ministral 3 14B:** Реализует 6-7 требований, timezone сломан (5-6 баллов)

**Проходной балл:** Нет. Это задача специально на провал.

---

## Задача 4.2: Миграция React Router v5 → v6

### Промпт
```
Мигрируй следующий код с React Router v5 на v6.

Контекст:
- Это реальное приложение с аутентификацией
- Используются вложенные роуты
- Есть защищённые маршруты (PrivateRoute)
- Используются query параметры
- Есть редиректы и useHistory

Сохрани всю функциональность. Покажи полный код после миграции.
```

### Исходный код для задачи
```tsx
// App.tsx — React Router v5
import { 
  BrowserRouter, 
  Switch, 
  Route, 
  Redirect, 
  useHistory, 
  useLocation,
  useParams,
  useRouteMatch
} from 'react-router-dom';
import { useAuth } from './auth';

// Защищённый маршрут (v5 паттерн)
function PrivateRoute({ component: Component, ...rest }: any) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <div>Loading...</div>;

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

// Dashboard с вложенными роутами
function Dashboard() {
  const { path, url } = useRouteMatch();
  const history = useHistory();

  const handleLogout = () => {
    // logout logic
    history.push('/login');
  };

  return (
    <div>
      <nav>
        <Link to={`${url}`}>Overview</Link>
        <Link to={`${url}/analytics`}>Analytics</Link>
        <Link to={`${url}/settings`}>Settings</Link>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <Switch>
        <Route exact path={path}>
          <Overview />
        </Route>
        <Route path={`${path}/analytics`}>
          <Analytics />
        </Route>
        <Route path={`${path}/settings`}>
          <Settings />
        </Route>
      </Switch>
    </div>
  );
}

// Страница с query параметрами
function SearchPage() {
  const location = useLocation();
  const history = useHistory();
  const query = new URLSearchParams(location.search);
  const searchTerm = query.get('q') || '';

  const handleSearch = (term: string) => {
    history.push({
      pathname: '/search',
      search: `?q=${encodeURIComponent(term)}`,
    });
  };

  return <div>Search: {searchTerm}</div>;
}

// Страница продукта с параметрами
function ProductPage() {
  const { categoryId, productId } = useParams<{ 
    categoryId: string; 
    productId: string; 
  }>();
  
  return (
    <div>
      Category: {categoryId}, Product: {productId}
    </div>
  );
}

// Главный роутер
export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Redirect to="/dashboard" />
        </Route>
        
        <Route path="/login">
          <LoginPage />
        </Route>
        
        <Route path="/register">
          <RegisterPage />
        </Route>
        
        <PrivateRoute path="/dashboard" component={Dashboard} />
        
        <Route path="/search">
          <SearchPage />
        </Route>
        
        <Route path="/category/:categoryId/product/:productId">
          <ProductPage />
        </Route>
        
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
```

### Почему модели провалятся

1. **Много изменений API:**
   - `Switch` → `Routes`
   - `<Route component={X}>` → `<Route element={<X />}>`
   - `<Redirect>` → `<Navigate>`
   - `useHistory` → `useNavigate`
   - `useRouteMatch` → относительные пути
   - `render` prop удалён

2. **PrivateRoute паттерн полностью меняется** — нужен Outlet или wrapper

3. **Вложенные роуты** — новый синтаксис с `<Outlet />`

4. **Query параметры** — рекомендуется useSearchParams

5. **Комбинация всего** — нужно переписать 80% кода

### Критерии оценки

| Критерий | Баллы | Описание |
|----------|-------|----------|
| Компилируется | 0-1 | Нет ошибок |
| Функциональность | 0-3 | Роутинг работает |
| Качество кода | 0-2 | v6 best practices |
| Edge cases | 0-2 | PrivateRoute, nested routes |
| TypeScript | 0-1 | Типы сохранены |
| Комментарии | 0-1 | Объяснение изменений |

### Ожидаемый результат от моделей

- **Qwen3-4B:** Частичная миграция, много ошибок (2-3 балла)
- **RNJ-1 8B:** Базовые роуты работают, вложенные сломаны (4-5 баллов)  
- **Ministral 3 14B:** Большинство работает, но PrivateRoute неправильный (5-6 баллов)

**Проходной балл:** Нет. Это задача специально на провал.

---

## Итого по Уровню 4

| Задача | Макс. баллов | Ожидаемый максимум от лучшей модели |
|--------|--------------|-------------------------------------|
| 4.1 Календарь | 10 | 5-6 |
| 4.2 Миграция | 10 | 5-6 |

**Цель этого уровня:** Показать, что локальные LLM пока не готовы к:
- Сложным задачам с множеством взаимосвязанных требований
- Миграциям между major версиями библиотек
- Задачам, требующим глубокого понимания edge cases

### Главный вывод для доклада

> Локальные LLM отлично справляются с типовыми задачами (Уровни 1-2), 
> неплохо — со сложными изолированными задачами (Уровень 3),
> но пока не готовы заменить опытного разработчика в задачах, 
> требующих системного мышления и глубокого понимания контекста.
