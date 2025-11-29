#!/bin/bash

echo "🔄 Reiniciando el frontend para usar las nuevas direcciones de contratos..."
echo ""

# Matar procesos de Next.js
echo "1️⃣ Deteniendo procesos de Next.js..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "npm.*dev" 2>/dev/null || true
sleep 2

# Limpiar caché de Next.js
echo "2️⃣ Limpiando caché de Next.js..."
cd /mnt/c/Users/jcmxo/dao/web
rm -rf .next 2>/dev/null || true
echo "   ✅ Caché limpiada"

# Verificar que .env.local existe y tiene las nuevas direcciones
echo ""
echo "3️⃣ Verificando configuración..."
if grep -q "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512" .env.local 2>/dev/null; then
    echo "   ✅ .env.local contiene las nuevas direcciones"
else
    echo "   ⚠️  .env.local podría no tener las direcciones actualizadas"
fi

# Iniciar el frontend
echo ""
echo "4️⃣ Iniciando el frontend..."
echo "   💡 El servidor se iniciará en segundo plano"
echo "   💡 Verás la URL cuando esté listo"
echo ""
npm run dev > /tmp/nextjs_dev.log 2>&1 &

sleep 5

# Verificar que esté corriendo
if pgrep -f "next dev" > /dev/null; then
    echo ""
    echo "✅ Frontend iniciado correctamente"
    echo ""
    echo "📋 Próximos pasos:"
    echo "   1. Abre http://localhost:3000 en tu navegador"
    echo "   2. Haz un HARD REFRESH: Ctrl + Shift + R (o Cmd + Shift + R en Mac)"
    echo "   3. Conecta tu wallet en MetaMask"
    echo "   4. Los errores de RPC deberían desaparecer"
    echo ""
    echo "📄 Para ver los logs del frontend:"
    echo "   tail -f /tmp/nextjs_dev.log"
else
    echo ""
    echo "❌ Error al iniciar el frontend"
    echo "   Revisa los logs: tail -f /tmp/nextjs_dev.log"
fi

