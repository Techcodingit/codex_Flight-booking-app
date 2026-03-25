# Staff Travel Booking Platform (Full Stack)

A devops-friendly full-stack project for **staff travel booking** with React + Express + PostgreSQL.

## Features
- React SPA with protected routes and pages: login/register, dashboard search, flight results, payment, confirmation, nominees, bookings, helpline, about.
- Indigo-inspired blue/white responsive shell with sidebar + cards.
- Express backend with JWT auth, official email-domain registration validation, REST APIs, DB initialization + airport seed.
- Booking history, nominee management, support query intake.
- Mock flight search flow and downloadable PDF PNR ticket generation.
- Dockerized setup with Compose for frontend + backend + Postgres.

## Project Structure
- `frontend/` React + Vite SPA
- `backend/` Express API + PostgreSQL integration
- `docker-compose.yml` multi-service local stack

## Local Run (without Docker)
### 1) Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 2) Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend: `http://localhost:5173`  
API: `http://localhost:5000`

## Docker Run
```bash
docker compose up --build
```

Services:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- PostgreSQL: `localhost:5432`

## API Overview
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/flights/airports`
- `GET /api/flights/search`
- `GET/POST /api/nominees`
- `GET/POST /api/bookings`
- `GET /api/bookings/:id/ticket`
- `POST /api/support`
- `GET /health`

## DevOps Practice Ideas
- Add Nginx reverse proxy and TLS termination.
- Add GitHub Actions for lint/test/build and container publishing.
- Add migrations tooling (e.g., Prisma, Knex, Flyway).
- Add Prometheus/Grafana monitoring and health probes.
- Add Terraform for infra provisioning.
