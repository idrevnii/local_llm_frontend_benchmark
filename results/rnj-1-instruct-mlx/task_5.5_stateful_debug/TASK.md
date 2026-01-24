# Deploy Script Debug

Скрипт деплоя перестал работать. Последний успешный деплой был 3 дня назад.

## Симптомы
- Деплой падает на этапе запуска сервисов
- Ошибка: "Invalid configuration"
- Rollback происходит автоматически

## Структура проекта
```
logs/
└── deploy.log       # Лог последнего деплоя

config/
├── nginx.yaml
├── postgres.yaml
├── redis.yaml
├── api-gateway.yaml
└── api-gateway.yaml.bak   # Бэкап от 3 дней назад
```