#!/bin/bash

echo "========================================"
echo "    Script de configuración de BD"
echo "========================================"

echo ""
echo "Instalando herramientas de Entity Framework..."
dotnet tool install --global dotnet-ef

echo ""
echo "Creando migración inicial..."
dotnet ef migrations add InitialCreate

echo ""
echo "Aplicando migraciones a la base de datos..."
dotnet ef database update

echo ""
echo "? Base de datos configurada exitosamente!"
echo ""
echo "Para ejecutar la aplicación:"
echo "dotnet run"
echo ""
echo "Para acceder a Swagger:"
echo "http://localhost:5000/swagger"
echo ""