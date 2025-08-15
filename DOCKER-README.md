# 🏫 Sistema de Gestión de Alumnos - Colegio

Sistema completo de gestión de alumnos desarrollado con .NET 8 (Backend) y React + TypeScript (Frontend).

## 🛠️ Tecnologías

### Backend
- .NET 8 API
- PostgreSQL
- Entity Framework Core

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui
- Sonner (Notificaciones)

## 🚀 Ejecutar con Docker

### Prerrequisitos
- Docker
- Docker Compose

### Comandos

`ash
# Construir y ejecutar todos los servicios
docker-compose up --build

# Ejecutar en segundo plano
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Parar todos los servicios
docker-compose down

# Parar y eliminar volúmenes (base de datos)
docker-compose down -v
`

## 🌐 Acceso a la aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Base de datos**: localhost:5432

## 📊 Servicios

### PostgreSQL
- **Puerto**: 5432
- **Base de datos**: colegiodb
- **Usuario**: postgres
- **Contraseña**: admin

### Backend (.NET 8)
- **Puerto**: 8080
- **Health Check**: http://localhost:8080/api/health

### Frontend (React)
- **Puerto**: 3000
- **Servidor web**: Nginx

## 🔧 Desarrollo

Para desarrollo local sin Docker:

### Backend
`ash
cd back-end
dotnet restore
dotnet run
`

### Frontend
`ash
cd front-end
npm install
npm run dev
`

## 📝 Notas

- El frontend hace proxy automático de las llamadas /api/ al backend
- La base de datos se inicializa automáticamente con las migraciones
- Todos los servicios tienen health checks configurados
- Los datos de PostgreSQL se persisten en un volumen Docker
