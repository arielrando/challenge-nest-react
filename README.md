# Ecommerce App with NestJS and PostgreSQL

## Description

This project is an ecommerce API built with NestJS, PostgreSQL, and TypeORM.  
It now includes a small React + Vite frontend (`frontend/`) used to validate the full flow end-to-end.

## Technology Stack

- NestJS
- PostgreSQL
- TypeORM
- Jest
- `@nestjs/event-emitter`
- React + Vite

## Domain Events

After creating a product draft or activating a product, the app emits:

- `product.created`
- `product.activated`

Consumers live in `src/domain-events/` and are not imported from `ProductModule`, so modules remain decoupled.  
For the frontend demo, those events are forwarded through SSE at `GET /events/stream`.

## Frontend (React)

The UI is inside this same repository under `frontend/`.

1. Start backend at `http://localhost:3000`
2. In another terminal:

```bash
cd frontend
npm install
npm run dev
```

3. Open `http://localhost:5173`, log in (for example seed admin), and run:
   create draft -> add details -> activate.

The bottom panel shows `product.created` and `product.activated` via SSE, plus REST responses.

Useful frontend variables:

- `API_PROXY_TARGET=http://127.0.0.1:3000` (for local `vite dev` proxy)
- `VITE_API_BASE_URL=https://your-api.onrender.com` (for deployed frontend calling deployed backend)

Frontend with Docker:

```bash
docker compose up frontend
```

Or run everything:

```bash
docker compose up
```

Frontend is served at `http://localhost:5173`.

## Getting Started

Clone the repository and open the project root (where `package.json` and `docker-compose.yml` are located).

### Environment Variables

- Copy `.env.example` to `.env` in the project root.
- Docker Compose reads the root `.env` for `${...}` substitutions.
- Backend Nest **does not automatically read the root `.env`**.
  It reads `src/common/envs` through:
  - `src/config/index.ts`
  - `src/database/typeorm/typeOrm.config.ts`
- For non-Docker local runs, keep `src/common/envs/development.env` aligned with your desired DB credentials.
- TypeORM expects `DATABASE_USER` (not `DATABASE_USERNAME`).
- Backend CORS can be configured with:
  - `FRONTEND_ALLOWED_ORIGINS=https://my-front.onrender.com,http://localhost:5173`
- In cloud, backend listens on `PORT` from environment (`main.ts` fallback is `3000`).

### Option A — API and Postgres with Docker

```bash
docker compose up -d --build
```

Because `synchronize: false`, run migrations before seed/use on an empty DB:

```bash
docker compose exec api npm run migration:run
docker compose exec api npm run seed:run
```

If you changed compose env values while containers are already running:

```bash
docker compose up -d --force-recreate api
```

### Option B — Postgres in Docker, API on Host

```bash
docker compose up -d postgres
```

Then run API on host:

```bash
npm install
npm run migration:run
npm run seed:run
npm run start:dev
```

Recommended order for a new database:

`migrations -> seed -> start app`

## Testing

```bash
npm install
npm run test
```
or with docker

```bash
docker compose exec api npm run test
```

## Contributing

1. Fork this repository
2. Make your changes
3. Submit a pull request
