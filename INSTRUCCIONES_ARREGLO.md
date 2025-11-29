# 🔧 Arreglar el Problema de la Aplicación Anterior

## El Problema
Estás viendo la aplicación "Document Registry dApp" en lugar de la nueva aplicación DAO porque hay múltiples servidores corriendo.

## ✅ Solución Rápida

### Opción 1: Usar el Puerto Actual (Más Rápido)
La aplicación DAO está corriendo en el puerto **3008**. Simplemente abre:
```
http://localhost:3008
```

### Opción 2: Limpiar Todo y Reiniciar (Recomendado)

**Paso 1:** Cierra todas las pestañas del navegador que tengan localhost abierto

**Paso 2:** En la terminal, ejecuta:
```bash
# Detener TODOS los servidores
pkill -9 node
pkill -9 npm
pkill -9 next

# Liberar todos los puertos
for port in {3000..3010}; do
    lsof -ti:$port 2>/dev/null | xargs kill -9 2>/dev/null
done

# Esperar 3 segundos
sleep 3
```

**Paso 3:** Iniciar solo la aplicación DAO:
```bash
cd /mnt/c/Users/jcmxo/dao/web
npm run dev
```

**Paso 4:** Cuando veas "Ready" y "Local: http://localhost:XXXX", abre ese puerto en el navegador

**Paso 5:** En el navegador, haz un **Hard Refresh**:
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

## 🎯 Verificar que es la App Correcta

La aplicación DAO debe mostrar:
- Título: **"DAO Voting"**
- Subtítulo: "Gasless governance powered by meta-transactions"
- Botón: "Connect Wallet"
- Secciones: "Fund DAO" y "Create Proposal"

Si ves "Document Registry dApp", sigue los pasos de arriba.

