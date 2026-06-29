# TaskManager

A full-stack task management application built as a technical interview exercise, demonstrating **Clean Architecture**, **Domain-Driven Design**, **CQRS with a custom in-house mediator**, **Test-Driven Development**, and modern full-stack development practices.

Authenticated users can create, read, update, and delete their own tasks. Each task has a title, description, status (Todo / In Progress / Done), and due date. Tasks are strictly scoped to their creator.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  TaskManager.API          ← Minimal APIs, Auth, OpenAPI     │
├─────────────────────────────────────────────────────────────┤
│  TaskManager.Contracts    ← DTOs shared across layers       │
├─────────────────────────────────────────────────────────────┤
│  TaskManager.Application  ← Custom Mediator, CQRS Handlers  │
├─────────────────────────────────────────────────────────────┤
│  TaskManager.Domain       ← Entities, VO, Events, Interfaces│
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  TaskManager.Infrastructure ← EF Core, Identity, PostgreSQL  │
└─────────────────────────────────────────────────────────────┘
```

**Dependency Rule:** Dependencies point inward only. The Domain layer has zero external dependencies.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | .NET | 10 (preview) |
| API Style | Native Minimal APIs | Built-in |
| API Docs | OpenAPI (built-in) + Scalar | Scalar 2.16.6 |
| Mediator | Custom In-House | — |
| ORM | Entity Framework Core | 10 (preview) |
| Database | PostgreSQL | 16 |
| Auth | ASP.NET Core Identity + JWT Bearer | Built-in |
| Validation | FluentValidation | 12.1.1 |
| Results | FluentResults | 4.0.0 |
| Mapping | Mapster | 10.0.9 |
| Testing | xUnit + NSubstitute + FluentAssertions | 2.9.3 / 5.3.0 / 8.10.0 |
| Frontend | React | 19 |
| Frontend Lang | TypeScript | 6 |
| UI Library | Material UI (MUI) | 9 |
| Styling | SCSS + MUI sx prop | — |
| State | Zustand | 5 |
| HTTP Client | Axios | 1.18 |
| Routing | React Router | 7 |
| Bundler | Vite | 6 |
| Linting | oxlint | 1.69 |
| Container | Docker + docker-compose | Latest |

---

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- [Node.js 22+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (optional — for containerized setup)
- [PostgreSQL 16](https://www.postgresql.org/download/) (if running without Docker)

---

## Quick Start

### 1. Clone & Environment Setup

```bash
git clone <repo-url>
cd TaskManager
cp .env.example .env
# Edit .env with your values (defaults work for local dev)
```

### 2. Docker Compose (Easiest)

```bash
docker compose up --build
```

- API: http://localhost:5000
- Scalar API docs: http://localhost:5000/openapi/scalar
- Frontend: http://localhost:3000
- PostgreSQL: localhost:5432

### 3. Manual Setup

#### Backend

```bash
# Update the connection string in appsettings.Development.json or set env vars
export ConnectionStrings__DefaultConnection="Host=localhost;Database=taskmanager;Username=taskmanager;Password=taskmanager_secret"
export Jwt__Secret="your_super_secret_jwt_key_min_32_chars_long_here"
export Jwt__Issuer="TaskManagerAPI"
export Jwt__Audience="TaskManagerWeb"
export FrontendUrl="http://localhost:5173"

cd src/TaskManager.API
dotnet run
```

#### Frontend

```bash
cd frontend/taskmanager-web
npm install
cp .env.example .env  # or set VITE_API_URL=http://localhost:5000
npm run dev
```

---

## Project Structure

```
TaskManager/
├── TaskManager.slnx
├── docker-compose.yml
├── .env.example
├── src/
│   ├── TaskManager.Domain/          # Entities, Value Objects, Events, Interfaces
│   ├── TaskManager.Application/     # CQRS Handlers, Mediator, Validation
│   ├── TaskManager.Contracts/       # Request/Response DTOs
│   ├── TaskManager.Infrastructure/  # EF Core, Identity, JWT, Repositories
│   ├── TaskManager.API/             # Minimal API endpoints, Middleware
│   └── TaskManager.Tests/           # Unit tests (Domain + Application + API)
└── frontend/
    └── taskmanager-web/             # React SPA
        ├── src/
        │   ├── api/                 # Axios client + API functions
        │   ├── components/          # Shared UI components
        │   ├── pages/               # Route pages
        │   ├── store/               # Zustand stores (auth, tasks)
        │   ├── theme/               # MUI theme
        │   └── types/               # TypeScript interfaces
        ├── Dockerfile
        └── nginx.conf
```

---

## Available Scripts

### Backend

| Command | Description |
|---------|-------------|
| `dotnet test src/TaskManager.Tests` | Run all unit tests |
| `dotnet run --project src/TaskManager.API` | Start API server |
| `dotnet build src/TaskManager.slnx` | Build entire solution |

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check + production build |
| `npm run lint` | Run oxlint |
| `npm run preview` | Preview production build |

---

## Docker Services

| Service | Image | Port | Description |
|---------|-------|------|-------------|
| `postgres` | `postgres:16-alpine` | `5432` | PostgreSQL database |
| `api` | Custom (multi-stage .NET build) | `5000` → `8080` | .NET 10 Minimal API |
| `frontend` | Custom (Node build + nginx) | `3000` → `80` | React SPA |

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `POSTGRES_DB` | Database name | `taskmanager` |
| `POSTGRES_USER` | Database user | `taskmanager` |
| `POSTGRES_PASSWORD` | Database password | `taskmanager_secret` |
| `JWT_SECRET` | JWT signing key (min 32 chars) | — |
| `JWT_ISSUER` | JWT issuer | `TaskManagerAPI` |
| `JWT_AUDIENCE` | JWT audience | `TaskManagerWeb` |
| `VITE_API_URL` | API base URL for frontend | `http://localhost:5000` |

---

## API Overview

All endpoints return a standard envelope: `{ success, data, errors }`.

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login, receive JWT |
| GET | `/api/auth/me` | Yes | Get current user info |

### Tasks

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/tasks` | Yes | List user's tasks |
| GET | `/api/tasks/{id}` | Yes | Get task by ID |
| POST | `/api/tasks` | Yes | Create task |
| PUT | `/api/tasks/{id}` | Yes | Update task |
| DELETE | `/api/tasks/{id}` | Yes | Delete task |
| PATCH | `/api/tasks/{id}/complete` | Yes | Mark task done |
| GET | `/api/tasks/statuses` | Yes | List statuses |

---

## Testing

```bash
# Run all tests
dotnet test src/TaskManager.Tests

# Run with verbose output
dotnet test src/TaskManager.Tests --verbosity detailed
```

Tests cover:
- **Domain**: Value object validation, entity behavior (pure unit tests)
- **Application**: Handler logic with mocked repositories
- **API**: Endpoint mapping and auth (lightweight integration via `WebApplicationFactory`)

---

## License

This project is created as a technical interview exercise.
