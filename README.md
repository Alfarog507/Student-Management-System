# 🏫 Sistema de Gestión de Alumnos

Sistema completo de gestión escolar desarrollado con arquitectura Full Stack moderna, utilizando .NET 8 para el backend y React + TypeScript para el frontend.

## 🚀 Características Principales

### ✅ Funcionalidades Implementadas

- **👥 Gestión Completa de Alumnos**: CRUD completo con validaciones
- **🔍 Filtros y Búsquedas**: Filtrado por grado y búsqueda en tiempo real
- **📊 Estadísticas**: Contadores dinámicos y reportes
- **🎨 UI Moderna**: Interfaz responsive con Shadcn/ui
- **🔔 Notificaciones**: Sistema de toast para feedback visual
- **🔒 Seguridad**: Autenticación por API Key
- **🐳 Containerización**: Docker completo para desarrollo y producción

### 🏗️ Arquitectura

`
📦 evaluacion-dotnet-react/
├── 🔧 back-end/          # API .NET 8 + PostgreSQL
├── 🎨 front-end/         # React + TypeScript + Vite
├── 🐳 docker-compose.yml # Orquestación de contenedores
└── 📚 DOCKER-README.md   # Documentación Docker
`

## 🛠️ Stack Tecnológico

### Backend (.NET 8)
- **ASP.NET Core 8** - Framework web moderno
- **Entity Framework Core** - ORM para base de datos
- **PostgreSQL** - Base de datos relacional
- **Swagger/OpenAPI** - Documentación automática de API
- **API Key Authentication** - Seguridad simplificada

### Frontend (React)
- **React 19** - Biblioteca de UI moderna
- **TypeScript** - Tipado estático
- **Vite** - Build tool ultrarrápido
- **Shadcn/ui** - Sistema de componentes elegante
- **Tailwind CSS** - Styling utility-first
- **React Hook Form + Zod** - Formularios con validación
- **Sonner** - Sistema de notificaciones toast
- **Axios** - Cliente HTTP

### DevOps & Deployment
- **Docker** - Containerización
- **Docker Compose** - Orquestación local
- **Nginx** - Servidor web para frontend
- **Health Checks** - Monitoreo de servicios

## ⚡ Inicio Rápido con Docker

### Prerrequisitos
- Docker
- Docker Compose

### Ejecutar Sistema Completo
`ash
# Clonar repositorio
git clone https://github.com/Alfarog507/evaluacion-dotnet-react.git
cd evaluacion-dotnet-react

# Ejecutar todos los servicios
docker-compose up --build

# En segundo plano
docker-compose up -d --build
`

### 🌐 URLs de Acceso
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger
- **PostgreSQL**: localhost:5432

## 🧑‍💻 Desarrollo Local

### Backend (.NET 8)
`ash
cd back-end
dotnet restore
dotnet run
`

### Frontend (React)
`ash
cd front-end
npm install
npm run dev
`

### Base de Datos
`ash
# PostgreSQL con Docker
docker run --name postgres-colegio -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=colegiodb -p 5432:5432 -d postgres:15
`

## 📁 Estructura Detallada

### Backend Structure
`
back-end/
├── Controllers/         # Controladores API
├── Models/             # Modelos de datos
├── Data/               # Contexto EF Core
├── DTOs/               # Data Transfer Objects
├── Services/           # Lógica de negocio
├── Migrations/         # Migraciones EF Core
└── Program.cs          # Configuración de la aplicación
`

### Frontend Structure
`
front-end/
├── src/
│   ├── components/     # Componentes React
│   │   ├── ui/        # Componentes Shadcn/ui
│   │   ├── AlumnoForm.tsx
│   │   ├── AlumnosList.tsx
│   │   └── AlumnoModal.tsx
│   ├── services/      # API calls
│   ├── types/         # TypeScript types
│   ├── lib/           # Utilidades
│   └── config/        # Configuración
├── public/            # Assets estáticos
└── Dockerfile         # Configuración Docker
`

## 🔧 Configuración

### Variables de Entorno

#### Backend (.NET)
`ash
ASPNETCORE_ENVIRONMENT=Development
ConnectionStrings__DefaultConnection=Host=localhost;Database=colegiodb;Username=postgres;Password=admin
ApiKey=colegio-api-key-2025
`

#### Frontend (React)
`ash
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_TOKEN=colegio-api-key-2025
`

## 📊 Base de Datos

### Esquema Principal: Alumno
`sql
CREATE TABLE Alumnos (
    Id SERIAL PRIMARY KEY,
    NombreAlumno VARCHAR(100) NOT NULL,
    FechaNacimiento TIMESTAMP NOT NULL,
    NombrePadre VARCHAR(100) NOT NULL,
    NombreMadre VARCHAR(100) NOT NULL,
    Grado VARCHAR(20) NOT NULL,
    Seccion VARCHAR(10) NOT NULL,
    FechaIngreso TIMESTAMP NOT NULL,
    Edad INTEGER GENERATED ALWAYS AS (
        EXTRACT(YEAR FROM AGE(FechaNacimiento))
    ) STORED
);
`

## 🔗 API Endpoints

`ash
GET    /api/Alumnos              # Listar todos los alumnos
GET    /api/Alumnos/{id}         # Obtener alumno por ID
POST   /api/Alumnos              # Crear nuevo alumno
PUT    /api/Alumnos/{id}         # Actualizar alumno
DELETE /api/Alumnos/{id}         # Eliminar alumno
GET    /api/Alumnos/grado/{grado}  # Filtrar por grado
`

## 🧪 Testing

### Backend
`ash
cd back-end
dotnet test
`

### Frontend
`ash
cd front-end
npm run test
`

## 🚀 Deployment

### Producción con Docker
`ash
# Build optimizado
docker-compose -f docker-compose.prod.yml up --build

# Con variables de entorno de producción
docker-compose --env-file .env.production up
`

### CI/CD Pipeline
- GitHub Actions configurado
- Build automático en push a main
- Deploy automático a contenedores

## 📚 Documentación Adicional

- [📖 Backend README](./back-end/README.md)
- [📖 Frontend README](./front-end/README.md)
- [🐳 Docker README](./DOCKER-README.md)

## 🤝 Contribución

1. Fork el proyecto
2. Crear branch feature (git checkout -b feature/nueva-funcionalidad)
3. Commit cambios (git commit -m 'feat: agregar nueva funcionalidad')
4. Push al branch (git push origin feature/nueva-funcionalidad)
5. Crear Pull Request

### Estándares de Código
- **Backend**: C# Conventions + XML Documentation
- **Frontend**: ESLint + Prettier + TypeScript strict
- **Commits**: Conventional Commits (feat, fix, docs, etc.)

## 📝 Versionado

Utilizamos [SemVer](https://semver.org/) para el versionado:
- **MAJOR**: Cambios incompatibles en API
- **MINOR**: Nueva funcionalidad compatible
- **PATCH**: Bug fixes compatibles

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Gabriel Alfaro**
- GitHub: [@Alfarog507](https://github.com/Alfarog507)
- LinkedIn: [Gabriel Alfaro](https://linkedin.com/in/gabriel-alfaro)

## 🙏 Agradecimientos

- Comunidad .NET por las excelentes herramientas
- Equipo de React por la innovación constante
- Vercel por shadcn/ui - componentes increíbles
- Radix UI por los primitivos accesibles

---

⭐ **¡Dale una estrella si te pareció útil este proyecto!** ⭐

*Desarrollado con ❤️ usando .NET 8 + React + TypeScript + Docker*
