# 🔧 Solución a los Errores de RPC

## 🐛 Problema Identificado

Los errores de RPC y "missing revert data" se debían a que:

1. **Anvil se había quedado en un estado inconsistente** - No respondía correctamente a las solicitudes
2. **Los contratos se perdieron** - Al reiniciar Anvil, se perdió todo el estado de la blockchain
3. **Las direcciones en `.env.local` estaban desactualizadas** - Apuntaban a contratos que ya no existían

## ✅ Solución Aplicada

### 1. Reinicio de Anvil
- Se detuvo el proceso anterior de Anvil
- Se reinició Anvil limpiamente
- Se verificó que responda correctamente (chainId: 31337)

### 2. Redespliegue de Contratos
Se desplegaron nuevamente los contratos con las siguientes direcciones:

```
MinimalForwarder: 0x5FbDB2315678afecb367f032d93F642f64180aa3
DAOVoting: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

### 3. Actualización de Configuración
Se actualizó `web/.env.local` con las nuevas direcciones de los contratos.

## 🔄 Próximos Pasos

### Opción 1: Reiniciar el Frontend (RECOMENDADO)
```bash
# Detener el servidor frontend actual (Ctrl+C)
# Luego reiniciarlo:
cd /mnt/c/Users/jcmxo/dao/web
npm run dev
```

### Opción 2: Refrescar la Página
1. Abre el navegador en `http://localhost:3000`
2. Haz un **hard refresh**: `Ctrl + Shift + R` (o `Cmd + Shift + R` en Mac)
3. Conecta tu wallet nuevamente

### Opción 3: Verificar MetaMask
1. Asegúrate de estar en la red **Localhost 8545** (Chain ID: 31337)
2. Si no, agrega la red:
   - Network Name: `Localhost 8545`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`

## 🔍 Verificar que Todo Funciona

1. **Verificar Anvil está corriendo:**
   ```bash
   curl -X POST http://127.0.0.1:8545 -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'
   ```
   Debe devolver: `"result": "0x7a69"` (31337 en hex)

2. **Verificar contratos desplegados:**
   ```bash
   cd /mnt/c/Users/jcmxo/dao/sc
   cast code 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 --rpc-url http://127.0.0.1:8545
   ```
   Debe devolver código (no `0x` vacío)

3. **Verificar balance del DAO:**
   ```bash
   cast call 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 "totalBalance()(uint256)" \
     --rpc-url http://127.0.0.1:8545
   ```
   Debe devolver: `0x0000000000000000000000000000000000000000000000000000000000000000` (0 ETH)

## 📝 Nota Importante

**Cuando reinicies Anvil, los contratos se perderán.** Esto es normal porque Anvil es una blockchain en memoria. Si necesitas persistencia:

1. Usa `anvil --state anvil_state.json` para guardar el estado
2. O simplemente redesplegar los contratos cada vez que reinicies Anvil

## 🎯 Estado Actual

✅ Anvil corriendo correctamente  
✅ Contratos desplegados  
✅ `.env.local` actualizado  
⏳ **Pendiente:** Reiniciar frontend y recargar la página en el navegador

