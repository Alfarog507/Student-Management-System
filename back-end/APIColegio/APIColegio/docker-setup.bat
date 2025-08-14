@echo off
echo =====================================
echo    API Colegio - Docker Setup
echo =====================================

echo.
echo ?? Configurando entorno Docker completo...
echo.

REM Verificar si Docker está ejecutándose
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ? Docker no está instalado o no está ejecutándose
    echo ?? Instala Docker Desktop desde: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo ? Docker detectado correctamente

echo.
echo ?? Limpiando contenedores anteriores...
docker-compose down --volumes --remove-orphans

echo.
echo ?? Construyendo imágenes...
docker-compose build --no-cache

echo.
echo ?? Iniciando servicios...
docker-compose up -d

echo.
echo ? Esperando que los servicios estén listos...
timeout /t 30 /nobreak >nul

echo.
echo ?? Verificando estado de los servicios...
docker-compose ps

echo.
echo ?? Verificando health checks...
timeout /t 10 /nobreak >nul

curl -s http://localhost:8080/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ? API está respondiendo correctamente
) else (
    echo ??  API aún se está iniciando...
    echo ?? Ejecuta: docker-compose logs api
)

echo.
echo ?? ¡Configuración completada!
echo.
echo ?? Servicios disponibles:
echo    ?? API Swagger: http://localhost:8080/swagger
echo    ?? API Base:    http://localhost:8080/api  
echo    ?? Health:      http://localhost:8080/api/health
echo    ???  Adminer:     http://localhost:8081
echo    ?? API Key:     colegio-api-key-2024
echo.
echo ?? Comandos útiles:
echo    docker-compose logs api     # Ver logs de la API
echo    docker-compose logs postgres # Ver logs de PostgreSQL  
echo    docker-compose down         # Detener servicios
echo    docker-compose up -d        # Reiniciar servicios
echo.

pause