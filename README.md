# Student Management System — .NET 8 + React + PostgreSQL

A full-stack student records management application with a REST API backend, a React frontend, and full Docker containerization for one-command local setup.

---

## What it does

- Full CRUD for student records (name, DOB, parents, grade, section, enrollment date)
- Real-time search and grade-based filtering
- Dynamic statistics dashboard (enrollment counts by grade)
- API Key authentication on all backend endpoints
- Auto-generated Swagger/OpenAPI documentation
- Computed `age` field stored in the database via a generated column

---

## Tech stack

| Layer | Technology |
|---|---|
| Backend | ASP.NET Core 8, Entity Framework Core |
| Database | PostgreSQL 15 (generated column for age) |
| API docs | Swagger / OpenAPI |
| Auth | API Key middleware |
| Frontend | React 19, TypeScript, Vite |
| UI | Shadcn/ui + Tailwind CSS |
| Forms | React Hook Form + Zod |
| HTTP | Axios |
| Notifications | Sonner (toast) |
| Deployment | Docker + Docker Compose + Nginx |

---

## Key technical decisions

**Generated column for age**
Rather than computing age on every read or storing it as a plain integer that goes stale, the `Edad` field is a PostgreSQL generated column derived from `FechaNacimiento`. The database keeps it accurate automatically — no application-level logic needed.

**API Key authentication over JWT**
For a single-tenant internal management tool, a shared API key is simpler to operate than a full JWT flow (no token refresh, no auth server). The key is validated per-request via a custom middleware, not in individual controllers.

**Shadcn/ui over a component library**
Shadcn/ui copies components into the source tree rather than importing them from a package. This makes it easy to customize behavior without fighting library abstractions — useful when form validation logic (Zod) needs to integrate tightly with UI state.

**Nginx as reverse proxy in production**
Same pattern as a typical staging or production environment: the compiled React app is served by Nginx, which proxies `/api/*` to the .NET backend container. This mirrors real deployment topology and avoids CORS configuration entirely.

---

## Project structure

```
├── back-end/
│   └── APIColegio/
│       ├── Controllers/     # API endpoints
│       ├── Models/          # Entity models
│       ├── DTOs/            # Data transfer objects
│       ├── Data/            # EF Core DbContext
│       ├── Services/        # Business logic
│       ├── Migrations/      # EF Core migrations
│       └── Program.cs       # App configuration + middleware
├── front-end/
│   └── src/
│       ├── components/      # React components (AlumnoForm, AlumnosList, AlumnoModal)
│       ├── services/        # API calls (Axios)
│       ├── types/           # TypeScript interfaces
│       └── config/          # Environment config
├── docker-compose.yml
└── DOCKER-README.md
```

---

## Quick start (Docker)

```bash
git clone https://github.com/Alfarog507/evaluacion-dotnet-react
cd evaluacion-dotnet-react
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger |

---

## Local development (without Docker)

**Backend**
```bash
cd back-end
dotnet restore
dotnet run
```

**Frontend**
```bash
cd front-end
npm install
npm run dev
```

**Database (Docker only)**
```bash
docker run --name postgres-colegio \
  -e POSTGRES_PASSWORD=admin \
  -e POSTGRES_DB=colegiodb \
  -p 5432:5432 -d postgres:15
```

---

## Environment variables

**Backend**
```
ASPNETCORE_ENVIRONMENT=Development
ConnectionStrings__DefaultConnection=Host=localhost;Database=colegiodb;Username=postgres;Password=admin
ApiKey=your-api-key-here
```

**Frontend**
```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_TOKEN=your-api-key-here
```

---

## API endpoints

```
GET    /api/Alumnos              # List all students
GET    /api/Alumnos/{id}         # Get student by ID
POST   /api/Alumnos              # Create student
PUT    /api/Alumnos/{id}         # Update student
DELETE /api/Alumnos/{id}         # Delete student
GET    /api/Alumnos/grado/{grado} # Filter by grade
```

All endpoints require `X-Api-Key` header.

---

## Database schema

```sql
CREATE TABLE Alumnos (
  Id               SERIAL PRIMARY KEY,
  NombreAlumno     VARCHAR(100) NOT NULL,
  FechaNacimiento  TIMESTAMP NOT NULL,
  NombrePadre      VARCHAR(100) NOT NULL,
  NombreMadre      VARCHAR(100) NOT NULL,
  Grado            VARCHAR(20) NOT NULL,
  Seccion          VARCHAR(10) NOT NULL,
  FechaIngreso     TIMESTAMP NOT NULL,
  Edad             INTEGER GENERATED ALWAYS AS (
                     EXTRACT(YEAR FROM AGE(FechaNacimiento))
                   ) STORED
);
```
