# Задание: API Client для ImageProcessor

У нас есть сторонний сервис обработки изображений. Документации нет, 
но есть примеры запросов/ответов от предыдущего разработчика.

## Базовый URL
```
https://api.imageprocessor.example.com
```

## Примеры из логов

### Пример 1: Загрузка изображения
```http
POST /api/v2/images
Content-Type: multipart/form-data
Authorization: Bearer sk_live_abc123

Response 201:
{
  "id": "img_a1b2c3",
  "status": "processing",
  "created": 1705123456,
  "meta": null
}
```

### Пример 2: Проверка статуса (в процессе)
```http
GET /api/v2/images/img_a1b2c3
Authorization: Bearer sk_live_abc123

Response 200:
{
  "id": "img_a1b2c3", 
  "status": "processing",
  "progress": 45,
  "created": 1705123456,
  "meta": null
}
```

### Пример 3: Проверка статуса (завершено)
```http
GET /api/v2/images/img_a1b2c3
Authorization: Bearer sk_live_abc123

Response 200:
{
  "id": "img_a1b2c3",
  "status": "completed", 
  "progress": 100,
  "created": 1705123456,
  "completed": 1705123556,
  "meta": {
    "width": 1920,
    "height": 1080,
    "format": "webp",
    "size": 245678
  },
  "result": {
    "original": "https://cdn.example.com/img_a1b2c3/original.jpg",
    "processed": "https://cdn.example.com/img_a1b2c3/processed.webp",
    "thumbnail": "https://cdn.example.com/img_a1b2c3/thumb.webp"
  }
}
```

### Пример 4: Проверка статуса (ошибка)
```http
GET /api/v2/images/img_error123

Response 200:
{
  "id": "img_error123",
  "status": "failed",
  "progress": 23,
  "created": 1705123456,
  "error": {
    "code": "INVALID_FORMAT",
    "message": "Unsupported image format"
  }
}
```

### Пример 5: Загрузка с параметрами обработки
```http
POST /api/v2/images?resize=800x600&format=webp&quality=85
Content-Type: multipart/form-data
Authorization: Bearer sk_live_abc123

Response 201:
{
  "id": "img_x1y2z3",
  "status": "queued",
  "created": 1705123789,
  "meta": null,
  "options": {
    "resize": { "width": 800, "height": 600 },
    "format": "webp", 
    "quality": 85
  }
}
```

### Пример 6: Ошибка авторизации
```http
POST /api/v2/images
(без заголовка Authorization)

Response 401:
{
  "error": "unauthorized",
  "message": "API key required"
}
```

### Пример 7: Rate limit
```http
POST /api/v2/images
Authorization: Bearer sk_live_abc123

Response 429:
{
  "error": "rate_limit",
  "message": "Too many requests",
  "retry_after": 30
}
```

### Пример 8: Не найдено
```http
GET /api/v2/images/img_notexists

Response 404:
{
  "error": "not_found",
  "message": "Image not found"
}
```

## Твоя задача

Создай файл `ImageProcessorClient.ts` с:

1. **Полные TypeScript типы** для всех возможных ответов API
   - Используй discriminated unions для разных статусов
   - Не используй `any`

2. **Класс `ImageProcessorClient`** с методами:
   - `constructor(apiKey: string)`
   - `upload(file: File, options?: ProcessingOptions): Promise<UploadResult>`
   - `getStatus(id: string): Promise<ImageStatus>`
   - `waitForCompletion(id: string, timeoutMs?: number): Promise<CompletedImage>`

3. **Обработка ошибок**:
   - Кастомные классы ошибок для разных типов (AuthError, RateLimitError, NotFoundError)
   - Retry logic для rate limiting с exponential backoff

4. **Дополнительно**:
   - `waitForCompletion` должен делать polling каждые 2 секунды
   - Таймаут по умолчанию 5 минут
   - Логирование прогресса (опционально)

## Важно
- Выведи типы из примеров ответов
- Обрати внимание на опциональные поля
- `created` и `completed` — это Unix timestamps
- Статусы: "queued" | "processing" | "completed" | "failed"
