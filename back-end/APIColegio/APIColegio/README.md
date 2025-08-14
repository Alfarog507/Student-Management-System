# 🎓 API Colegio - Sistema de Gestión de Alumnos

API RESTful completa para la gestión de alumnos de un colegio desarrollada con .NET 8 y PostgreSQL.

[![.NET 8](https://img.shields.io/badge/.NET-8-purple.svg)](https://dotnet.microsoft.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![Swagger](https://img.shields.io/badge/API-Documented-green.svg)](http://localhost:5000/swagger)

---

## 🚀 Características Principales

- ✅ **API RESTful** con .NET 8 y C# 12
- ✅ **Base de datos PostgreSQL** con Entity Framework Core
- ✅ **Autenticación API Key** para seguridad
- ✅ **Documentación automática** con Swagger/OpenAPI
- ✅ **Docker Support** para desarrollo local
- ✅ **Migraciones automáticas** de base de datos
- ✅ **Respuestas estructuradas** con metadatos
- ✅ **Validaciones de negocio** automáticas
- ✅ **Logging detallado** para debugging
- ✅ **Health checks** para monitoreo

---

## 📋 Requisitos del Sistema

### Software Necesario
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (recomendado)
- [PostgreSQL 15+](https://www.postgresql.org/download/) (alternativo)
- [Entity Framework Tools](https://docs.microsoft.com/en-us/ef/core/cli/dotnet)

### Hardware Mínimo
- RAM: 4GB
- Disco: 2GB disponibles
- CPU: Dual-core 2GHz

---

## 🛠️ Configuración e Instalación

### 🎯 Método 1: Configuración Automática (Recomendado)

**Windows:**
```bash
# Ejecutar script de configuración completa
./setup-database.bat
```

**Linux/macOS:**
```bash
# Dar permisos y ejecutar
chmod +x setup-database.sh
./setup-database.sh
```

### 🔧 Método 2: Configuración Manual

#### Paso 1: Clonar y Preparar
```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/api-colegio.git
cd api-colegio/back-end/APIColegio

# Restaurar dependencias
dotnet restore
```

#### Paso 2: Base de Datos con Docker
```bash
# Iniciar PostgreSQL
docker-compose up -d

# Verificar que está ejecutándose
docker ps
```

#### Paso 3: Configurar Entity Framework
```bash
# Instalar herramientas EF (si no están instaladas)
dotnet tool install --global dotnet-ef

# Crear migración inicial
dotnet ef migrations add InitialCreate

# Aplicar migraciones
dotnet ef database update
```

#### Paso 4: Ejecutar la Aplicación
```bash
# Ejecutar en modo desarrollo
dotnet run

# O compilar y ejecutar
dotnet build
dotnet run --no-build
```

---

## 🐳 Docker y Contenedores

### PostgreSQL con Docker Compose
```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:15
    container_name: colegio_postgres
    environment:
      POSTGRES_DB: colegiodb
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: admin
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

### Comandos Útiles de Docker
```bash
# Iniciar servicios
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f postgres

# Conectarse a PostgreSQL
docker exec -it colegio_postgres psql -U postgres -d colegiodb

# Detener servicios
docker-compose down

# Limpiar volúmenes (elimina datos)
docker-compose down -v
```

---

## 🔧 Configuración Detallada

### Variables de Entorno (.env)
```env
# Base de datos
DATABASE_URL=Host=localhost;Database=colegiodb;Username=postgres;Password=admin;Port=5432

# Autenticación
API_KEY=colegio-api-key-2024

# Entorno
ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=http://localhost:5000
```

### Configuración appsettings.json
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore.Database.Command": "None"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=colegiodb;Username=postgres;Password=admin;Port=5432"
  },
  "ApiKey": "colegio-api-key-2024",
  "AllowedHosts": "*"
}
```

---

## 📚 Documentación de la API

### 🌐 Acceso a la Documentación
Una vez ejecutándose la aplicación:

- **📖 Swagger UI:** http://localhost:5000/swagger
- **🔗 OpenAPI JSON:** http://localhost:5000/swagger/v1/swagger.json
- **🌐 API Base URL:** http://localhost:5000/api
- **🏥 Health Check:** http://localhost:5000/api/health

### 🔑 Autenticación

La API utiliza autenticación por **API Key**. Incluye este header en todas las peticiones:

```http
X-API-Key: colegio-api-key-2024
```

#### Configurar en Swagger UI:
1. 🔓 Haz clic en **"Authorize"**
2. 🔑 Ingresa: `colegio-api-key-2024`
3. ✅ Haz clic en **"Authorize"**
4. 🚀 ¡Ya puedes probar todos los endpoints!

---

## 📊 Modelo de Datos

### 📋 Tabla: alumnos

| Campo | Tipo | Longitud | Descripción | Ejemplo |
|-------|------|----------|-------------|---------|
| **id** | `int` | - | Clave primaria (auto-incremento) | `1` |
| **nombre_alumno** | `varchar` | 100 | Nombre completo del alumno | `"Juan Pérez García"` |
| **fecha_nacimiento** | `date` | - | Fecha de nacimiento | `"2010-05-15"` |
| **nombre_padre** | `varchar` | 100 | Nombre completo del padre | `"Carlos Pérez López"` |
| **nombre_madre** | `varchar` | 100 | Nombre completo de la madre | `"María García Hernández"` |
| **grado** | `varchar` | 20 | Grado académico | `"5to"`, `"6to"`, `"1ro"` |
| **seccion** | `varchar` | 10 | Sección del grado | `"A"`, `"B"`, `"C"` |
| **fecha_ingreso** | `date` | - | Fecha de ingreso al colegio | `"2021-02-01"` |

### 🔍 Índices de Base de Datos
- `idx_alumnos_grado` - Optimiza consultas por grado
- `idx_alumnos_seccion` - Optimiza consultas por sección

---

## 🎯 Endpoints Disponibles

### 👥 Gestión de Alumnos (🔒 Requiere Autenticación)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/alumnos` | Obtener todos los alumnos | 🔒 |
| `GET` | `/api/alumnos/{id}` | Obtener alumno por ID | 🔒 |
| `GET` | `/api/alumnos/grado/{grado}` | Obtener alumnos por grado | 🔒 |
| `POST` | `/api/alumnos` | Crear nuevo alumno | 🔒 |

### 🏥 Health & Monitoreo (🌐 Público)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/health` | Estado de la API | 🌐 |
| `GET` | `/api/health/info` | Información de la API | 🌐 |
| `GET` | `/api/health/detailed` | Health check detallado | 🌐 |

---

## 📝 Ejemplos de Uso

### 🔍 Consultar Todos los Alumnos

```bash
curl -X GET "http://localhost:5000/api/alumnos" \
  -H "X-API-Key: colegio-api-key-2024" \
  -H "Accept: application/json"
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombreAlumno": "Juan Pérez García",
      "fechaNacimiento": "2010-05-15",
      "nombrePadre": "Carlos Pérez López",
      "nombreMadre": "María García Hernández",
      "grado": "5to",
      "seccion": "A",
      "fechaIngreso": "2021-02-01",
      "edad": 13,
      "gradoCompleto": "5to A"
    }
  ],
  "message": "Alumnos obtenidos exitosamente",
  "count": 1,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 📊 Consultar por Grado

```bash
curl -X GET "http://localhost:5000/api/alumnos/grado/5to" \
  -H "X-API-Key: colegio-api-key-2024"
```

### 🆕 Crear Nuevo Alumno

```bash
curl -X POST "http://localhost:5000/api/alumnos" \
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
curl -X GET "http://localhost:5000/api/health"
```

**Respuesta:**
```json
{
  "status": "Healthy",
  "message": "API Colegio funcionando correctamente",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0",
  "environment": "Development",
  "uptime": 3600
}
```

---

## 🧪 Datos de Prueba

La aplicación incluye **3 alumnos precargados** automáticamente:

| ID | Alumno | Grado | Sección | Padre | Madre |
|----|--------|-------|---------|-------|-------|
| 1 | Juan Pérez García | 5to | A | Carlos Pérez López | María García Hernández |
| 2 | Ana López Martínez | 6to | B | Roberto López Silva | Carmen Martínez Rodríguez |
| 3 | Luis Fernández Ruiz | 4to | A | José Fernández Castro | Laura Ruiz Morales |

---

## 📝 Comandos Útiles

### Entity Framework
```bash
# Ver estado de migraciones
dotnet ef migrations list

# Crear nueva migración
dotnet ef migrations add NombreMigracion

# Aplicar migraciones
dotnet ef database update

# Revertir a migración específica
dotnet ef database update NombreMigracionAnterior

# Generar script SQL
dotnet ef migrations script

# Eliminar última migración (sin aplicar)
dotnet ef migrations remove

# Regenerar base de datos (desarrollo)
dotnet ef database drop --force
dotnet ef database update
```

### Desarrollo
```bash
# Ejecutar en modo watch (auto-reload)
dotnet watch run

# Compilar en modo Release
dotnet build -c Release

# Ejecutar tests (cuando estén implementados)
dotnet test

# Limpiar build
dotnet clean

# Verificar formato de código
dotnet format --verify-no-changes
```

---

## 🚨 Códigos de Estado HTTP

### Respuestas Exitosas
- **200 OK** - Operación exitosa
- **201 Created** - Recurso creado exitosamente

### Errores del Cliente
- **400 Bad Request** - Datos inválidos o faltantes
- **401 Unauthorized** - API Key faltante o inválida
- **404 Not Found** - Recurso no encontrado
- **409 Conflict** - Conflicto de datos (ej: alumno duplicado)

### Errores del Servidor
- **500 Internal Server Error** - Error interno del servidor

---

## 🛠️ Solución de Problemas

### 🐛 Problemas Comunes

#### 1. Error de Conexión a PostgreSQL
```bash
# Verificar que Docker esté ejecutándose
docker ps

# Reiniciar PostgreSQL
docker-compose restart postgres

# Ver logs de PostgreSQL
docker-compose logs postgres
```

#### 2. Error de Migración
```bash
# Eliminar migración problemática
dotnet ef migrations remove

# Recrear base de datos
dotnet ef database drop --force
dotnet ef migrations add InitialCreate
dotnet ef database update
```

#### 3. Puerto Ocupado
```bash
# Verificar procesos en puerto 5000
netstat -tulpn | grep 5000

# Usar puerto alternativo
dotnet run --urls http://localhost:5001
```

#### 4. API Key Inválida
- ✅ Verificar header: `X-API-Key: colegio-api-key-2024`
- ✅ Confirmar configuración en `appsettings.json`
- ✅ Usar Swagger UI para probar autenticación

---

## 🔍 Estado del Proyecto

### ✅ Completado
- [x] **Configuración base** (.NET 8, PostgreSQL)
- [x] **Modelo de datos** Alumno con validaciones
- [x] **Entity Framework** con migraciones
- [x] **Autenticación API Key** completa
- [x] **Controladores RESTful** con DTOs
- [x] **Documentación Swagger** detallada
- [x] **Docker support** para desarrollo
- [x] **Health checks** para monitoreo
- [x] **Respuestas estructuradas** con metadatos
- [x] **Validaciones de negocio** automáticas

### 🚧 Próximas Mejoras
- [ ] **Tests unitarios** y de integración
- [ ] **Paginación** para consultas grandes
- [ ] **Filtros avanzados** de búsqueda
- [ ] **Audit logs** para trazabilidad
- [ ] **Rate limiting** para protección
- [ ] **Caching** para mejor performance
- [ ] **Métricas y monitoring** avanzado
- [ ] **Front-end React** (siguiente fase)

---

## 📞 Soporte y Contribución

### 🆘 Obtener Ayuda
1. 📖 Consultar documentación en `/swagger`
2. 🏥 Verificar health checks en `/api/health`
3. 📋 Revisar logs de la aplicación
4. 🐳 Verificar estado de Docker containers

### 🤝 Contribuir
1. Fork del repositorio
2. Crear branch feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'feat: agregar nueva funcionalidad'`
4. Push al branch: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

### 📧 Contacto
- **Email:** soporte@apicolegio.com
- **Repository:** https://github.com/tu-usuario/api-colegio
- **Issues:** https://github.com/tu-usuario/api-colegio/issues

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 🏆 Créditos

Desarrollado como parte de una **evaluación técnica de .NET y React**.

**Tecnologías utilizadas:**
- ⚡ .NET 8 & C# 12
- 🐘 PostgreSQL 15
- 🔧 Entity Framework Core
- 📖 Swagger/OpenAPI
- 🐳 Docker & Docker Compose
- 🔐 API Key Authentication

---

**¡Gracias por usar API Colegio! 🎓**