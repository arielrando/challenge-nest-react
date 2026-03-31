# Ecommerce App con NestJS y PostgreSQL

## Descripción

Este proyecto es una API de ecommerce construida con NestJS, PostgreSQL y TypeORM.  
También incluye un frontend simple en React + Vite (`frontend/`) para validar el flujo completo de punta a punta.

## Stack Tecnológico

- NestJS
- PostgreSQL
- TypeORM
- Jest
- `@nestjs/event-emitter`
- React + Vite

## Eventos de Dominio

Después de crear un borrador o activar un producto, la aplicación emite:

- `product.created`
- `product.activated`

Los consumidores viven en `src/domain-events/` y no se importan desde `ProductModule`, para mantener desacople entre módulos.  
Para la demo web, esos eventos se exponen por SSE en `GET /events/stream`.

## Frontend (React)

La UI está dentro del mismo repositorio, en `frontend/`.

1. Levantá el backend en `http://localhost:3000`
2. En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

3. Abrí `http://localhost:5173`, iniciá sesión (por ejemplo con el admin del seed) y ejecutá:
   crear borrador -> guardar detalles -> activar.

El panel inferior muestra `product.created` y `product.activated` vía SSE, además de respuestas REST.

Variables útiles del frontend:

- `API_PROXY_TARGET=http://127.0.0.1:3000` (proxy local de `vite dev`)
- `VITE_API_BASE_URL=https://tu-api.onrender.com` (frontend deployado contra backend deployado)

Frontend con Docker:

```bash
docker compose up frontend
```

O todo junto:

```bash
docker compose up
```

El frontend queda en `http://localhost:5173`.

## Puesta en Marcha

Cloná el repositorio y abrí la raíz del proyecto (donde están `package.json` y `docker-compose.yml`).

### Variables de Entorno

- Copiá `.env.example` a `.env` en la raíz.
- Docker Compose usa el `.env` de raíz para sustituir variables `${...}`.
- El backend Nest **no lee automáticamente** ese `.env` de raíz.
  Lee variables desde `src/common/envs` mediante:
  - `src/config/index.ts`
  - `src/database/typeorm/typeOrm.config.ts`
- Para ejecutar sin Docker, mantené `src/common/envs/development.env` alineado con tus credenciales de DB.
- TypeORM espera `DATABASE_USER` (no `DATABASE_USERNAME`).
- CORS del backend se configura con:
  - `FRONTEND_ALLOWED_ORIGINS=https://mi-front.onrender.com,http://localhost:5173`
- En cloud, el backend escucha `PORT` del entorno (`main.ts` usa `3000` como fallback).

### Opción A — API y Postgres con Docker

```bash
docker compose up -d --build
```

Como `synchronize: false`, en una DB vacía primero corré migraciones y después seed:

```bash
docker compose exec api npm run migration:run
docker compose exec api npm run seed:run
```

Si cambiaste variables en compose y el contenedor ya estaba arriba:

```bash
docker compose up -d --force-recreate api
```

### Opción B — Postgres en Docker, API en Host

```bash
docker compose up -d postgres
```

Luego ejecutá API en host:

```bash
npm install
npm run migration:run
npm run seed:run
npm run start:dev
```


Orden recomendado en una base nueva:

`migraciones -> seed -> levantar app`

## Testing

```bash
npm install
npm run test
```
o con docker

```bash
docker compose exec api npm run test
```

## Contribuir

1. Fork del repositorio
2. Hacer cambios
3. Abrir Pull Request
