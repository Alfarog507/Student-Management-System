# ?? Docker Configuration - API Colegio

Esta documentación explica cómo ejecutar la API Colegio completa usando Docker.

## ?? Inicio Rápido

### Método 1: Script Automático (Recomendado)

```bash
# Windows
./docker-setup.bat

# Linux/macOS
chmod +x docker-setup.sh
./docker-setup.sh
```

### Método 2: Manual

```bash
# 1. Construir y ejecutar todos los servicios
docker-compose up -d --build

# 2. Verificar que todo esté funcionando
docker-compose ps
curl http://localhost:8080/api/health
```

## ??? Arquitectura de Contenedores

```
???????????????????    ???????????????????    ???????????????????
?   API Colegio   ?    ?   PostgreSQL    ?    ?    Adminer      ?
?   (.NET 8)      ??????   Database      ?    ?  (DB Admin)     ?
?   Port: 8080    ?    ?   Port: 5432    ?    ?   Port: 8081    ?
???????????????????    ???????????????????    ???????????????????
```

## ?? Servicios Incluidos

| Servicio | Puerto | Descripción | URL |
|----------|--------|-------------|-----|
| **API** | 8080 | API .NET 8 principal | http://localhost:8080/swagger |
| **PostgreSQL** | 5432 | Base de datos | `postgres://postgres:admin@localhost:5432/colegiodb` |
| **Adminer** | 8081 | Administrador web de BD | http://localhost:8081 |

## ?? Variables de Entorno

### API Container
```env
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://+:8080
ConnectionStrings__DefaultConnection=Host=postgres;Database=colegiodb;Username=postgres;Password=admin;Port=5432
ApiKey=colegio-api-key-2024
```

### PostgreSQL Container
```env
POSTGRES_DB=colegiodb
POSTGRES_USER=postgres
POSTGRES_PASSWORD=admin
```

## ?? Comandos Útiles

### Gestión de Servicios
```bash
# Iniciar todos los servicios
docker-compose up -d

# Detener todos los servicios
docker-compose down

# Reiniciar un servicio específico
docker-compose restart api

# Ver estado de servicios
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f api
docker-compose logs -f postgres
```

### Desarrollo y Debug
```bash
# Reconstruir solo la API
docker-compose build api --no-cache

# Entrar al contenedor de la API
docker exec -it colegio_api bash

# Entrar a PostgreSQL
docker exec -it colegio_postgres psql -U postgres -d colegiodb

# Ver configuración de red
docker network ls
docker network inspect apicolegio_colegio-network
```

### Datos y Volúmenes
```bash
# Ver volúmenes
docker volume ls

# Hacer backup de la base de datos
docker exec colegio_postgres pg_dump -U postgres colegiodb > backup.sql

# Restaurar backup
docker exec -i colegio_postgres psql -U postgres -d colegiodb < backup.sql

# Limpiar todo (incluyendo datos)
docker-compose down --volumes
docker volume prune
```

## ?? Health Checks

### Verificaciones Automáticas
- **API**: `curl http://localhost:8080/api/health`
- **PostgreSQL**: `pg_isready -U postgres -d colegiodb`

### Endpoints de Monitoreo
```bash
# Health check básico
curl http://localhost:8080/api/health

# Health check detallado
curl http://localhost:8080/api/health/detailed

# Información de la API
curl http://localhost:8080/api/health/info
```

## ?? Acceso a la API

### Autenticación
Todos los endpoints de alumnos requieren el header:
```
X-API-Key: colegio-api-key-2024
```

### Ejemplo de Uso
```bash
# Obtener todos los alumnos
curl -X GET "http://localhost:8080/api/alumnos" \
  -H "X-API-Key: colegio-api-key-2024" \
  -H "Accept: application/json"

# Crear nuevo alumno
curl -X POST "http://localhost:8080/api/alumnos" \
  -H "X-API-Key: colegio-api-key-2024" \
  -H "Content-Type: application/json" \
  -d '{
    "nombreAlumno": "Test Student",
    "fechaNacimiento": "2010-01-01",
    "nombrePadre": "Test Father", 
    "nombreMadre": "Test Mother",
    "grado": "5to",
    "seccion": "A",
    "fechaIngreso": "2021-02-01"
  }'
```

## ??? Administración de Base de Datos

### Usando Adminer (Recomendado)
1. Ve a http://localhost:8081
2. Configura la conexión:
   - **System**: PostgreSQL
   - **Server**: postgres
   - **Username**: postgres  
   - **Password**: admin
   - **Database**: colegiodb

### Usando Cliente PostgreSQL
```bash
# Desde línea de comandos
docker exec -it colegio_postgres psql -U postgres -d colegiodb

# Consultas útiles
\dt                    # Listar tablas
\d alumnos            # Describir tabla alumnos
SELECT * FROM alumnos; # Ver todos los alumnos
\q                     # Salir
```

## ??? Solución de Problemas

### La API no inicia
```bash
# Ver logs detallados
docker-compose logs api

# Verificar que PostgreSQL esté listo
docker-compose logs postgres

# Verificar health checks
docker-compose ps
```

### Error de conexión a base de datos
```bash
# Verificar red entre contenedores
docker exec colegio_api ping postgres

# Verificar variables de entorno
docker exec colegio_api env | grep Connection
```

### Puerto ocupado
```bash
# Verificar qué está usando el puerto
netstat -tulpn | grep 8080

# Cambiar puerto en docker-compose.yml
ports:
  - "8081:8080"  # Usar puerto 8081 en lugar de 8080
```

### Reconstruir desde cero
```bash
# Limpiar todo
docker-compose down --volumes --rmi all
docker system prune -a

# Reconstruir
docker-compose up -d --build
```

## ?? URLs de Acceso Rápido

- **?? Swagger UI**: http://localhost:8080/swagger
- **?? API Base**: http://localhost:8080/api
- **?? Health Check**: http://localhost:8080/api/health
- **??? Adminer**: http://localhost:8081

## ?? Configuración para Producción

Para desplegar en producción, considera:

1. **Variables de entorno seguras**:
   ```env
   ApiKey=tu-api-key-super-secreta
   POSTGRES_PASSWORD=contraseña-muy-segura
   ```

2. **Reverse proxy** (Nginx/Traefik):
   ```nginx
   location /api/ {
       proxy_pass http://api:8080/;
   }
   ```

3. **Volúmenes persistentes**:
   ```yaml
   volumes:
     - /var/lib/postgresql/data:/var/lib/postgresql/data
   ```

4. **Limits de recursos**:
   ```yaml
   deploy:
     resources:
       limits:
         memory: 512M
         cpus: '0.5'
   ```

---

¡Listo para desarrollo frontend! ??