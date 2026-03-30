# Ecommerce App with Nest.js and Postgres

## Description

This project is an ecommerce application built using Nest.js and Postgres. The focus is on writing clean, modular, and testable code, and following a well-organized project structure.

## Technology Stack

- Nest.js
- PostgreSQL
- TypeORM
- Jest
- `@nestjs/event-emitter` (eventos de dominio en proceso)
- React + Vite (demo en `frontend/`)

## Domain events

Tras crear un borrador de producto o activarlo, la aplicación emite eventos (`product.created`, `product.activated`). Los consumidores viven en `src/domain-events/` y no se importan desde `ProductModule`, para no acoplar módulos: el flujo usa el bus global configurado en `AppModule`.

Para la demo web, esos mismos hechos se reenvían por **Server-Sent Events**: `GET /events/stream` (sin envolver en el interceptor JSON estándar).

## Frontend (React)

La UI vive en **`frontend/`** dentro del mismo repositorio (un solo clon; el proxy de Vite apunta al API en el puerto 3000). No hace falta un repo aparte salvo preferencia de equipo.

1. Levantá el backend en `http://localhost:3000`.
2. En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

3. Abrí `http://localhost:5173`, iniciá sesión (p. ej. admin del seed), ejecutá el flujo crear → detalles → activar. La lista inferior muestra eventos **`product.created`** y **`product.activated`** en vivo vía SSE, además de llamadas REST.

Variable opcional al arrancar Vite en el host: `API_PROXY_TARGET=http://127.0.0.1:3000` si el API no está en el host por defecto.

**Frontend con Docker** (misma red que el API; el proxy usa el hostname `api`):

```bash
docker compose up frontend
```

O junto con todo: `docker compose up`. La UI queda en **http://localhost:5173**. La primera vez el contenedor ejecuta `npm install` dentro del volumen `frontend_node_modules` (puede tardar un poco).

## Getting Started

Clone the repository and open the project root (the folder that contains `package.json` and `docker-compose.yml`).

### Environment variables

- **Raíz del repo:** copiá `.env.example` a **`.env`** (no se versiona). Ahí van credenciales de Postgres, `JWT_SECRET`, puertos y las variables **`VITE_*`** del demo de React. Docker Compose usa ese archivo para sustituir `${...}` en `docker-compose.yml`.
- **Nest sin Docker:** sigue pudiendo usar `src/common/envs/development.env`; mantené `DATABASE_*` y secretos alineados con el `.env` de la raíz si usás ambos.
- TypeORM espera **`DATABASE_USER`** (no `DATABASE_USERNAME`).

**Frontend / Vite:** el `vite.config.js` lee el `.env` de la **raíz** (`envDir` apunta al monorepo). Solo las variables con prefijo **`VITE_`** llegan al código del navegador; igual **no son secretos** (cualquiera puede verlas en el bundle). Usalas solo para defaults de demo local.

**Docker Compose:** ya no lleva contraseñas fijas; tomá los valores del `.env` (o los defaults del compose si no existe archivo).

### Option A — API and Postgres with Docker

```bash
docker compose up -d --build
```

With the schema, TypeORM has **`synchronize: false`**, so you must run migrations **before** seeding or using the app against an empty database:

```bash
docker compose exec api npm run migration:run
docker compose exec api npm run seed:run
```

The API listens on port **3000**. If the `api` container was already running when you changed `docker-compose.yml`, recreate it so env vars apply: `docker compose up -d --force-recreate api`.

### Option B — Postgres in Docker, API on the host

Start only Postgres (or use `docker compose up -d postgres` and stop the `api` service if you prefer):

```bash
docker compose up -d postgres
```

Install dependencies and point `DATABASE_HOST` to `localhost` in `src/common/envs/development.env` (see `.env.example`).

```bash
npm install
npm run migration:run
npm run seed:run
npm run start:dev
```

### Migrations

```bash
npm run migration:run
```

To generate a new migration after entity changes:

```bash
npm run migration:generate --name=<migrationName>
```

### Seed

```bash
npm run seed:run
```

Order for a **new** database: **migrations → seed → start app**.

## Testing

1. Install dependencies: `npm install`
2. Run the tests: `npm run test`

## Contributing

If you are interested in contributing to this project, please follow these guidelines:

1. Fork this repository
2. Make your changes
3. Submit a pull request
