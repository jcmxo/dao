#!/bin/bash

# Script para iniciar el proyecto DAO
# Uso: ./start.sh

echo "🚀 Iniciando proyecto DAO..."
echo ""

# Verificar que Anvil está corriendo
if ! curl -s http://127.0.0.1:8545 > /dev/null 2>&1; then
    echo "⚠️  Anvil no está corriendo."
    echo "Por favor, abre una nueva terminal y ejecuta:"
    echo "   anvil"
    echo ""
    echo "Presiona Enter cuando Anvil esté corriendo..."
    read
fi

# Verificar .env.local
if [ ! -f "web/.env.local" ]; then
    echo "⚠️  No se encontró web/.env.local"
    echo "Por favor, crea el archivo con las variables de entorno."
    echo "Ver COMO_EJECUTAR.md para más detalles."
    exit 1
fi

echo "✅ Verificaciones completadas"
echo ""
echo "Iniciando frontend..."
echo ""

cd web
npm run dev

