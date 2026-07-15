# ntlstl.places

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TypeORM](https://img.shields.io/badge/TypeORM-FE0803?style=flat-square&logo=typeorm&logoColor=white)](https://typeorm.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![MinIO](https://img.shields.io/badge/MinIO-C72E49?style=flat-square&logo=minio&logoColor=white)](https://min.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![Jest](https://img.shields.io/badge/Jest-C21325?style=flat-square&logo=jest&logoColor=white)](https://jestjs.io/)
[![Grafana](https://img.shields.io/badge/Grafana-F46800?style=flat-square&logo=grafana&logoColor=white)](https://grafana.com/)
[![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=flat-square&logo=prometheus&logoColor=white)](https://prometheus.io/)

Backend приложения для карточек мест ("places/cards") с тегами, лайками, ролями, загрузкой файлов и авторизацией через Яндекс OAuth.

## Стек

- **Backend**: NestJS, TypeORM, PostgreSQL, Passport (JWT + Yandex OAuth), `@nestjs/swagger`
- **Файлы**: MinIO (S3-совместимое хранилище), `sharp` для обработки изображений
- **Логи и метрики**: Winston (консоль, ротация файлов, Loki, опционально Telegram), Prometheus (`@willsoto/nestjs-prometheus`)
- **Тесты**: Jest (unit + e2e)
- **Инфраструктура**: Docker Compose (PostgreSQL, pgAdmin, MinIO, Loki, Prometheus, Grafana)

## Структура

```
nest-places/
├── src/
│   ├── auth/       # локальная аутентификация, JWT
│   ├── oauth/      # Яндекс OAuth
│   ├── users/      # пользователи
│   ├── cards/      # карточки мест
│   ├── tags/       # теги
│   ├── likes/      # лайки
│   ├── roles/      # роли
│   ├── files/       # загрузка и обработка файлов
│   ├── minio/       # клиент MinIO (глобальный модуль)
│   ├── hash/        # хеширование паролей
│   ├── metrics/      # Prometheus-провайдеры
│   └── common/       # конфиги, гварды, декораторы
├── migrations/       # SQL для инициализации БД
├── docker-compose.yml
└── prometheus.yml
```

## Возможности

- Регистрация и вход через Яндекс OAuth, JWT-токен в `access_token` cookie
- CRUD карточек мест с тегами, привязкой к автору (`eager`-связь с `User`)
- Лайки карточек — доступны и анонимным пользователям (`CustomJwtGuard` подставляет `userId: -1`)
- Роли и защита эндпоинтов через `RolesGuard` + `@Roles(...)`
- Загрузка и обработка изображений (MinIO + `sharp`)
- Логирование (Winston + Loki, опционально Telegram) и метрики (Prometheus) на `/metrics`
- Swagger-документация на `/api`

## Быстрый старт

### Требования

- Node.js 20+
- Docker + Docker Compose
- Зарегистрированное приложение в [Яндекс OAuth](https://oauth.yandex.ru)

### Переменные окружения

Создайте `.env` в корне проекта:

```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=newPassword
POSTGRES_DB=nestplaces

JWT_SECRET=

CLIENT_YANDEX_ID=        # ID приложения Яндекс OAuth
CLIENT_YANDEX_SECRET=    # Секрет приложения
CLIENT_YANDEX_REDIRECT=  # http://<host>/oauth/yandex/redirect

MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=
MINIO_SECRET_KEY=

TELEGRAM_TOKEN=          # опционально, для алертов в Telegram
TELEGRAM_CHAT_ID=        # опционально
```

Опциональные переменные для `docker-compose.yml` (можно задать в `.env` рядом с ним):

| Переменная | По умолчанию | Описание |
|---|---|---|
| `POSTGRES_USER` | `postgres` | Пользователь БД |
| `POSTGRES_PASSWORD` | `newPassword` | Пароль БД |
| `POSTGRES_DB` | `my-db-name` | Имя базы |
| `MINIO_ROOT_USER` | `admin` | Логин MinIO |
| `MINIO_ROOT_PASSWORD` | `very-hard-password` | Пароль MinIO |

### Запуск инфраструктуры

```bash
docker compose up -d
```

| Сервис | URL |
|---|---|
| PostgreSQL | localhost:5432 |
| pgAdmin | http://localhost:8080 |
| MinIO API | http://localhost:9000 |
| MinIO Console | http://localhost:8000 |
| Loki | http://localhost:3100 |
| Grafana | http://localhost:3200 |
| Prometheus | http://localhost:9090 |

### Запуск приложения

```bash
npm install
npm run start:dev
```

API поднимется на `http://localhost:3000`, Swagger — на `http://localhost:3000/api`, метрики Prometheus — на `http://localhost:3000/metrics`.

## Сервисы (docker-compose)

- **postgres** — PostgreSQL 13, данные в `./postgresdata`, инициализация из `migrations/dbinit.sql`
- **pgadmin** — веб-интерфейс для PostgreSQL
- **minio** — S3-совместимое хранилище файлов, бакет `main` создаётся автоматически
- **loki** — хранилище логов приложения
- **grafana** — дашборды для Prometheus и Loki
- **prometheus** — сбор метрик с `/metrics` приложения (см. `prometheus.yml`)

Сам backend в `docker-compose.yml` закомментирован — приложение обычно запускается локально через `npm run start:dev` поверх поднятой инфраструктуры.

## Тесты

```bash
# unit-тесты
npm run test
npm run test:watch
npm run test:cov

# конкретный файл или тест
npx jest src/cards/cards.service.spec.ts
npx jest -t "название теста"

# e2e
npm run test:e2e
```

## Прочее

```bash
npm run lint      # eslint --fix
npm run format    # prettier --write
npm run doc        # API-документация через compodoc, http://localhost:8088
```

## Лицензия

[UNLICENSED](LICENSE)
