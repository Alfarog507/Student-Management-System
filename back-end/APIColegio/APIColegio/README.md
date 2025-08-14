# 🎓 API Colegio - Sistema de Gestión de Alumnos

API RESTful completa para la gestión de alumnos de un colegio desarrollada con .NET 8 y PostgreSQL.

[![.NET 8](https://img.shields.io/badge/.NET-8-purple.svg)](https://dotnet.microsoft.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![Swagger](https://img.shields.io/badge/API-Documented-green.svg)](http://localhost:8080/swagger)

---

## 🚀 Características Principales

- ✅ **API RESTful** con .NET 8 y C# 12
- ✅ **Base de datos PostgreSQL** con Entity Framework Core
- ✅ **Autenticación API Key** para seguridad
- ✅ **Documentación automática** con Swagger/OpenAPI
- ✅ **Docker Support** completo para desarrollo y producción
- ✅ **Migraciones automáticas** de base de datos
- ✅ **Respuestas estructuradas** con metadatos
- ✅ **Validaciones de negocio** automáticas
- ✅ **Health checks** para monitoreo
- ✅ **CORS configurado** para frontend React

---

## 🐳 Inicio Rápido con Docker (Recomendado)

### ⚡ Método 1: Script Automático

**Windows:**
```bash
# Ejecutar configuración completa
./docker-setup.bat
```

**Linux/macOS:**
```bash
# Dar permisos y ejecutar
chmod +x docker-setup.sh
./docker-setup.sh
```

### 🔧 Método 2: Docker Compose Manual

```bash
# Construir e iniciar todos los servicios
docker-compose up -d --build

# Verificar estado
docker-compose ps

# Ver logs
docker-compose logs -f api
```

### 🌐 Servicios Disponibles

| Servicio | Puerto | URL | Descripción |
|----------|--------|-----|-------------|
| **API** | 8080 | http://localhost:8080/swagger | Documentación Swagger |
| **PostgreSQL** | 5432 | - | Base de datos |
| **Adminer** | 8081 | http://localhost:8081 | Admin web de BD |

---

## 💻 Desarrollo Local (Sin Docker)

### 📋 Requisitos
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [PostgreSQL 15+](https://www.postgresql.org/download/)
- [Entity Framework Tools](https://docs.microsoft.com/en-us/ef/core/cli/dotnet)

### 🛠️ Configuración Manual

```bash
# 1. Clonar y preparar
git clone https://github.com/tu-usuario/api-colegio.git
cd api-colegio/back-end/APIColegio
dotnet restore

# 2. Configurar PostgreSQL local
# Crear base de datos: colegiodb
# Usuario: postgres, Password: admin

# 3. Aplicar migraciones
dotnet ef database update

# 4. Ejecutar aplicación
dotnet run
```

---

## 🔑 Autenticación

La API utiliza autenticación por **API Key**:

```http
X-API-Key: colegio-api-key-2024
```

### 🔓 Configurar en Swagger UI:
1. Ve a http://localhost:8080/swagger
2. Haz clic en **"Authorize"** 🔓
3. Ingresa: `colegio-api-key-2024`
4. Haz clic en **"Authorize"**
5. ¡Ya puedes probar todos los endpoints! 🚀

---

## 🎯 Endpoints Principales

### 👥 Gestión de Alumnos (🔒 Requiere API Key)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/alumnos` | Obtener todos los alumnos |
| `GET` | `/api/alumnos/{id}` | Obtener alumno por ID |
| `GET` | `/api/alumnos/grado/{grado}` | Obtener alumnos por grado |
| `POST` | `/api/alumnos` | Crear nuevo alumno |

### 🏥 Health & Monitoreo (🌐 Público)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/health` | Estado básico de la API |
| `GET` | `/api/health/info` | Información de la API |
| `GET` | `/api/health/detailed` | Health check detallado |

---

## 📝 Ejemplos de Uso

### 🔍 Consultar Todos los Alumnos

```bash
curl -X GET "http://localhost:8080/api/alumnos" \
  -H "X-API-Key: colegio-api-key-2024" \
  -H "Accept: application/json"
```

### 🆕 Crear Nuevo Alumno

```bash
curl -X POST "http://localhost:8080/api/alumnos" \
  -H "X-API-Key: colegio-api-key-2024" \
  -H "Content-Type: application/json" \
  -d '{
    "nombreAlumno": "María González Pérez",
    "fechaNacimiento": "2011-07-20",
    "nombrePadre": "Juan González",
    "nombreMadre": "Ana Pérez",
    "grado": "4to",
    "seccion": "B",
    "fechaIngreso": "2023-02-01"
  }'
```

### 🏥 Health Check

```bash
curl -X GET "http://localhost:8080/api/health"
```

---

## 🧪 Datos de Prueba

La aplicación incluye **3 alumnos precargados**:

| ID | Alumno | Grado | Sección |
|----|--------|-------|---------|
| 1 | Juan Pérez García | 5to | A |
| 2 | Ana López Martínez | 6to | B |
| 3 | Luis Fernández Ruiz | 4to | A |

---

## 🐳 Comandos Docker Útiles

### Gestión de Servicios
```bash
# Iniciar servicios
docker-compose up -d

# Ver estado
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f api
docker-compose logs -f postgres

# Detener servicios
docker-compose down

# Reconstruir solo la API
docker-compose build api --no-cache
docker-compose up -d api
```

### Desarrollo y Debug
```bash
# Entrar al contenedor de la API
docker exec -it colegio_api bash

# Entrar a PostgreSQL
docker exec -it colegio_postgres psql -U postgres -d colegiodb

# Backup de base de datos
docker exec colegio_postgres pg_dump -U postgres colegiodb > backup.sql

# Limpiar todo y empezar de nuevo
docker-compose down --volumes
docker-compose up -d --build
```

---

## 🌐 Integración con Frontend

### CORS Configurado
La API ya tiene CORS configurado para desarrollo frontend:

```csharp
// Orígenes permitidos
"http://localhost:3000"  // React (Create React App)
"http://localhost:5173"  // Vite
"http://localhost:8080"  // Docker
```

### Variables de Entorno para Frontend

```env
# .env para frontend React
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_API_KEY=colegio-api-key-2024
```

### Ejemplo de Fetch en React

```javascript
// services/api.js
const API_URL = process.env.REACT_APP_API_URL;
const API_KEY = process.env.REACT_APP_API_KEY;

export const getAlumnos = async () => {
  const response = await fetch(`${API_URL}/alumnos`, {
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json',
    },
  });
  return response.json();
};
```

---

## 📊 Modelo de Datos

### 📋 Tabla: alumnos

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| **id** | `int` | Clave primaria | `1` |
| **nombre_alumno** | `varchar(100)` | Nombre completo | `"Juan Pérez García"` |
| **fecha_nacimiento** | `date` | Fecha de nacimiento | `"2010-05-15"` |
| **nombre_padre** | `varchar(100)` | Nombre del padre | `"Carlos Pérez López"` |
| **nombre_madre** | `varchar(100)` | Nombre de la madre | `"María García Hernández"` |
| **grado** | `varchar(20)` | Grado académico | `"5to"`, `"6to"` |
| **seccion** | `varchar(10)` | Sección | `"A"`, `"B"`, `"C"` |
| **fecha_ingreso** | `date` | Fecha de ingreso | `"2021-02-01"` |

---

## 🛠️ Solución de Problemas

### 🐳 Problemas con Docker

```bash
# API no responde
docker-compose logs api

# PostgreSQL no inicia
docker-compose logs postgres
docker-compose restart postgres

# Problemas de red entre contenedores
docker exec colegio_api ping postgres

# Puerto ocupado
# Cambiar puertos en docker-compose.yml
```

### 💾 Problemas de Base de Datos

```bash
# Recrear base de datos
docker-compose down --volumes
docker-compose up -d

# Ver datos en PostgreSQL
docker exec -it colegio_postgres psql -U postgres -d colegiodb
SELECT * FROM alumnos;
```

### 🔧 Desarrollo Local

```bash
# Error de migración
dotnet ef database drop --force
dotnet ef database update

# Puerto ocupado
dotnet run --urls http://localhost:5001
```

---

## 🚀 Desarrollo Frontend

### ✅ La API está lista para:
- ✅ **React** con Create React App
- ✅ **Vue.js** con Vite
- ✅ **Angular** con CLI
- ✅ **Svelte** con SvelteKit

### 📋 Siguiente Paso: Frontend React

```bash
# En otra terminal/directorio
npx create-react-app colegio-frontend
cd colegio-frontend

# Configurar variables de entorno
echo "REACT_APP_API_URL=http://localhost:8080/api" > .env
echo "REACT_APP_API_KEY=colegio-api-key-2024" >> .env

# Iniciar desarrollo
npm start
```

---

## 📄 Documentación Adicional

- 📖 **Swagger UI**: http://localhost:8080/swagger
- 🐳 **Docker Guide**: [DOCKER.md](DOCKER.md)
- 🔧 **API Reference**: Disponible en Swagger
- 🏥 **Health Monitoring**: `/api/health/*`

---

## 🏆 Estado del Proyecto

### ✅ Backend Completado
- [x] **API RESTful** con .NET 8
- [x] **Base de datos** PostgreSQL
- [x] **Autenticación** API Key
- [x] **Documentación** Swagger completa
- [x] **Docker** containerización completa
- [x] **CORS** configurado para frontend
- [x] **Health checks** implementados

### 🚧 Próximo: Frontend React
- [ ] **React App** con TypeScript
- [ ] **Material-UI** o Bootstrap
- [ ] **Estado global** con Context API
- [ ] **Formularios** de creación/edición
- [ ] **Tablas** con filtros y paginación

---

## 📞 Soporte

### 🆘 Obtener Ayuda
1. 📖 Consultar Swagger: http://localhost:8080/swagger
2. 🏥 Verificar health: http://localhost:8080/api/health
3. 📋 Ver logs: `docker-compose logs api`
4. 🐳 Documentación Docker: [DOCKER.md](DOCKER.md)

### 📧 Contacto
- **Repository**: https://github.com/tu-usuario/api-colegio
- **Issues**: https://github.com/tu-usuario/api-colegio/issues

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

**¡API lista para producción! Ahora puedes desarrollar el frontend sin preocuparte por el backend.** 🎉🚀