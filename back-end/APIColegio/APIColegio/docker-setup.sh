#!/bin/bash

echo "====================================="
echo "    API Colegio - Docker Setup"
echo "====================================="

echo ""
echo "?? Configurando entorno Docker completo..."
echo ""

# Verificar si Docker está ejecutándose
if ! command -v docker &> /dev/null; then
    echo "? Docker no está instalado o no está ejecutándose"
    echo "?? Instala Docker desde: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo "? Docker no está ejecutándose"
    echo "?? Inicia Docker Desktop o el daemon de Docker"
    exit 1
fi

echo "? Docker detectado correctamente"

echo ""
echo "?? Limpiando contenedores anteriores..."
docker-compose down --volumes --remove-orphans

echo ""
echo "?? Construyendo imágenes..."
docker-compose build --no-cache

echo ""
echo "?? Iniciando servicios..."
docker-compose up -d

echo ""
echo "? Esperando que los servicios estén listos..."
sleep 30

echo ""
echo "?? Verificando estado de los servicios..."
docker-compose ps

echo ""
echo "?? Verificando health checks..."
sleep 10

if curl -s http://localhost:8080/api/health > /dev/null 2>&1; then
    echo "? API está respondiendo correctamente"
else
    echo "??  API aún se está iniciando..."
    echo "?? Ejecuta: docker-compose logs api"
fi

echo ""
echo "?? ¡Configuración completada!"
echo ""
echo "?? Servicios disponibles:"
echo "    ?? API Swagger: http://localhost:8080/swagger"
echo "    ?? API Base:    http://localhost:8080/api"  
echo "    ?? Health:      http://localhost:8080/api/health"
echo "    ???  Adminer:     http://localhost:8081"
echo "    ?? API Key:     colegio-api-key-2024"
echo ""
echo "?? Comandos útiles:"
echo "    docker-compose logs api     # Ver logs de la API"
echo "    docker-compose logs postgres # Ver logs de PostgreSQL"  
echo "    docker-compose down         # Detener servicios"
echo "    docker-compose up -d        # Reiniciar servicios"
echo ""

read -p "Presiona Enter para continuar..."