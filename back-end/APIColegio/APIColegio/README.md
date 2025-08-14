# API Colegio

API RESTful para la gestión de alumnos de un colegio desarrollada con .NET 8 y PostgreSQL.

## 🚀 Características

- ✅ API RESTful con .NET 8
- ✅ Base de datos PostgreSQL con Entity Framework Core
- ✅ Autenticación con API Key
- ✅ Documentación automática con Swagger
- ✅ Docker support para PostgreSQL
- ✅ Migraciones automáticas de base de datos

## 📋 Requisitos

- .NET 8 SDK
- PostgreSQL 15+ (o Docker)
- Entity Framework Tools

## 🛠️ Configuración Rápida

### Opción 1: Script Automático (Recomendado)

**Windows:**
```bash
# Ejecutar el script de configuración
./setup-database.bat
```

**Linux/macOS:**
```bash
# Dar permisos y ejecutar               
chmod +x setup-database.sh
./setup-database.sh
```

### Opción 2: Configuración Manual

1. **Iniciar PostgreSQL con Docker:**
   ```bash
   docker-compose up -d
   ```

2. **Instalar herramientas de Entity Framework:**
   ```bash
   dotnet tool install --global dotnet-ef
   ```

3. **Crear y aplicar migraciones:**
   ```bash
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```

4. **Ejecutar la aplicación:**
   ```bash
   dotnet run
   ```

## 🐳 Docker

Para usar PostgreSQL con Docker:

```bash
# Iniciar contenedor
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener contenedor
docker-compose down
```

## 🔧 Configuración de la Base de Datos

### Variables de Entorno (.env)
```env
DATABASE_URL=Host=localhost;Database=colegiodb;Username=postgres;Password=admin;Port=5432
API_KEY=colegio-api-key-2024
ASPNETCORE_ENVIRONMENT=Development
```

### Configuración en appsettings.json
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=colegiodb;Username=postgres;Password=admin;Port=5432"
  },
  "ApiKey": "colegio-api-key-2024"
}
```

## 📚 Documentación de la API

Una vez que la aplicación esté ejecutándose:

- **Swagger UI:** http://localhost:5000/swagger
- **API Base URL:** http://localhost:5000/api

## 🔑 Autenticación

La API utiliza autenticación por API Key. Incluye el siguiente header en tus peticiones:

```
X-API-Key: colegio-api-key-2024
```

## 📊 Modelo de Datos

### Tabla: alumnos
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | int | Clave primaria (auto-incremento) |
| nombre_alumno | varchar(100) | Nombre completo del alumno |
| fecha_nacimiento | date | Fecha de nacimiento |
| nombre_padre | varchar(100) | Nombre completo del padre |
| nombre_madre | varchar(100) | Nombre completo de la madre |
| grado | varchar(20) | Grado académico (ej: "5to", "6to") |
| seccion | varchar(10) | Sección (ej: "A", "B") |
| fecha_ingreso | date | Fecha de ingreso al colegio |

## 🎯 Endpoints Disponibles

### Alumnos
- `POST /api/alumnos` - Crear un nuevo alumno
- `GET /api/alumnos` - Obtener todos los alumnos
- `GET /api/alumnos/grado/{grado}` - Obtener alumnos por grado

### Ejemplo de Uso

**Crear Alumno:**
```bash
curl -X POST "http://localhost:5000/api/alumnos" \
  -H "X-API-Key: colegio-api-key-2024" \
  -H "Content-Type: application/json" \
  -d '{
    "nombreAlumno": "María González",
    "fechaNacimiento": "2011-07-20",
    "nombrePadre": "Juan González",
    "nombreMadre": "Ana Martínez",
    "grado": "4to",
    "seccion": "B",
    "fechaIngreso": "2023-02-01"
  }'
```

**Consultar por Grado:**
```bash
curl -X GET "http://localhost:5000/api/alumnos/grado/5to" \
  -H "X-API-Key: colegio-api-key-2024"
```

## 🧪 Datos de Prueba

La aplicación incluye datos de prueba que se cargan automáticamente:
- Juan Pérez García (5to A)
- Ana López Martínez (6to B)
- Luis Fernández Ruiz (4to A)

## 📝 Comandos Útiles de Entity Framework

```bash
# Ver estado de migraciones
dotnet ef migrations list

# Crear nueva migración
dotnet ef migrations add <NombreMigración>

# Aplicar migraciones
dotnet ef database update

# Revertir a migración específica
dotnet ef database update <NombreMigración>

# Generar script SQL
dotnet ef migrations script

# Eliminar última migración (sin aplicar)
dotnet ef migrations remove
```

## 🔍 Estado del Proyecto

### Completado ✅
- [x] Configuración base del proyecto (.NET 8)
- [x] Modelo de datos Alumno
- [x] Configuración de PostgreSQL con Entity Framework
- [x] DbContext y configuración de base de datos
- [x] Docker Compose para PostgreSQL
- [x] Scripts de configuración automática
- [x] Documentación Swagger
- [x] Datos de prueba (seed data)

### Pendiente 🚧
- [ ] Controladores y servicios
- [ ] Autenticación API Key
- [ ] DTOs y validaciones
- [ ] Manejo de errores
- [ ] Logging
- [ ] Tests unitarios
- [ ] Front-end React

## 🚀 Próximos Pasos

1. **Configurar la base de datos** (ACTUAL)
2. Crear controladores y servicios
3. Implementar autenticación
4. Agregar validaciones y DTOs
5. Crear front-end React
6. Implementar tests

## 📞 Soporte

Si encuentras algún problema:

1. Verifica que PostgreSQL esté ejecutándose
2. Confirma que las migraciones se aplicaron correctamente
3. Revisa los logs de la aplicación
4. Consulta la documentación de Swagger en `/swagger`

---

**Nota:** Este proyecto es parte de una evaluación técnica de .NET y React.