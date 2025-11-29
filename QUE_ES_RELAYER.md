# 🤔 ¿Qué es el Relayer?

## 📖 Respuesta Rápida

**Relayer** (o "Relayed") es el **servidor backend** que:
- ✅ Recibe las firmas de los usuarios
- ✅ **Paga el gas** de las transacciones
- ✅ Ejecuta las transacciones en la blockchain
- ✅ Permite que los usuarios usen el DAO **sin pagar gas**

---

## 🎯 ¿Qué Hace el Relayer?

### Función Principal:

El relayer es como un **"mensajero pagado"** que:
1. Recibe tu firma (sin costo para ti)
2. Toma tu firma y la envía a la blockchain
3. **Paga el gas** con sus propios fondos
4. Ejecuta la transacción en el DAO

### Analogía Simple:

```
Sin Relayer:
Usuario → Paga gas → Ejecuta transacción ❌ (usuario paga)

Con Relayer:
Usuario → Firma → Relayer paga gas → Ejecuta transacción ✅ (relayer paga)
```

---

## 🏗️ Arquitectura del Relayer

### Componentes:

```
┌─────────┐
│ Usuario │
└────┬────┘
     │ 1. Firma EIP-712 (GRATIS)
     ↓
┌──────────────┐
│   Frontend   │
│   (Next.js)  │
└────┬─────────┘
     │ 2. Envía firma
     ↓
┌──────────────────┐
│   RELAYER        │  ← Este es el relayer
│   (Backend API)  │
│   - Tiene fondos │
│   - Paga gas     │
└────┬─────────────┘
     │ 3. Ejecuta con gas
     ↓
┌──────────────────┐
│ MinimalForwarder│
│  (Smart Contract)│
└────┬─────────────┘
     │ 4. Verifica y ejecuta
     ↓
┌──────────────┐
│  DAOVoting   │
│  (DAO)       │
└──────────────┘
```

---

## 📁 Implementación en Este Proyecto

### 1. **API Route del Relayer**

**Archivo:** `web/app/api/relay/route.ts`

**Estado:** ✅ **IMPLEMENTADO COMPLETO**

**Funciones:**
- ✅ Recibe firma del frontend
- ✅ Verifica firma con MinimalForwarder
- ✅ Ejecuta transacción usando MinimalForwarder.execute()
- ✅ **Paga el gas** con la wallet del relayer

**Código clave:**
```typescript
// Conecta wallet del relayer (tiene fondos)
const relayerWallet = new ethers.Wallet(relayerPrivateKey, provider);

// Conecta a MinimalForwarder
const forwarder = new ethers.Contract(forwarderAddress, FORWARDER_ABI, relayerWallet);

// Verifica firma
const isValid = await forwarder.verify(req, signature);

// Ejecuta transacción (relayer paga gas)
const tx = await forwarder.execute(req, signature, {
  gasLimit: BigInt(forwardRequest.gas) + 50000n,
});
```

---

### 2. **Función sendToRelayer()**

**Archivo:** `web/lib/metaTransaction.ts`

**Estado:** ✅ **IMPLEMENTADO**

**Función:**
- ✅ Envía firma y request al relayer
- ✅ Llama a `/api/relay`
- ✅ Retorna el hash de la transacción

**Código:**
```typescript
export async function sendToRelayer(
  request: ForwardRequest,
  signature: string
): Promise<string> {
  const response = await fetch("/api/relay", {
    method: "POST",
    body: JSON.stringify({ request, signature }),
  });
  // ...
}
```

---

### 3. **Uso en Votación**

**Archivo:** `web/components/ProposalList.tsx`

**Estado:** ✅ **IMPLEMENTADO**

**Código:**
```typescript
// Firma la transacción
const signature = await signMetaTransaction(provider, request);

// Envía al relayer (relayer paga gas)
const txHash = await sendToRelayer(request, signature);
```

---

### 4. **Uso en Crear Propuesta**

**Archivo:** `web/components/CreateProposal.tsx`

**Estado:** ✅ **IMPLEMENTADO**

**Código:**
```typescript
// Firma la transacción
const signature = await signMetaTransaction(provider, request);

// Envía al relayer (relayer paga gas)
const txHash = await sendToRelayer(request, signature);
```

---

### 5. **Daemon para Ejecutar Propuestas**

**Archivo:** `web/scripts/daemon.ts`

**Estado:** ✅ **IMPLEMENTADO**

**Función:**
- ✅ Usa el relayer para ejecutar propuestas automáticamente
- ✅ Ejecuta propuestas aprobadas después del período de seguridad
- ✅ También paga el gas

**Código:**
```typescript
const relayerWallet = new ethers.Wallet(relayerPrivateKey, provider);
const daoContract = new ethers.Contract(daoAddress, DAO_ABI, relayerWallet);
await daoContract.executeProposal(proposalId);
```

---

### 6. **API para Ejecutar Propuestas**

**Archivo:** `web/app/api/execute-proposals/route.ts`

**Estado:** ✅ **IMPLEMENTADO**

**Función:**
- ✅ Endpoint para ejecutar propuestas
- ✅ Usa el relayer para pagar el gas

---

## 🔐 Configuración del Relayer

### Variables de Entorno:

**Archivo:** `web/.env.local`

```env
RELAYER_PRIVATE_KEY=0x...  # Clave privada del relayer (tiene fondos)
RELAYER_ADDRESS=0x...     # Dirección del relayer
RPC_URL=http://127.0.0.1:8545
```

**Importante:**
- ✅ El relayer necesita tener **fondos en ETH** para pagar el gas
- ✅ La clave privada debe estar segura (nunca en el frontend)
- ✅ Solo el backend tiene acceso a la clave privada

---

## 💰 ¿Quién Paga el Gas?

### Sin Relayer:
```
Usuario → Paga $3 USD de gas → Transacción ejecutada
```

### Con Relayer:
```
Usuario → Firma (GRATIS) → Relayer paga $3 USD → Transacción ejecutada
```

**Resultado:** Usuario **NO paga nada**, relayer paga el gas.

---

## 🔄 Flujo Completo con Relayer

### Paso a Paso:

1. **Usuario firma:**
   ```
   Usuario → MetaMask → Firma EIP-712 (GRATIS)
   ```

2. **Frontend envía al relayer:**
   ```
   Frontend → POST /api/relay → { request, signature }
   ```

3. **Relayer verifica:**
   ```
   Relayer → MinimalForwarder.verify() → Firma válida ✅
   ```

4. **Relayer ejecuta (paga gas):**
   ```
   Relayer → MinimalForwarder.execute() → Paga gas → Ejecuta en DAO
   ```

5. **Transacción completada:**
   ```
   DAO → Función ejecutada → Usuario no pagó nada ✅
   ```

---

## 🎯 Ventajas del Relayer

### Para los Usuarios:

- ✅ **No pagan gas** - Transacciones gratuitas
- ✅ **Mejor experiencia** - Solo firman, no pagan
- ✅ **Más accesible** - No necesitan ETH para usar el DAO

### Para el DAO:

- ✅ **Más participación** - Más usuarios pueden votar
- ✅ **Mejor gobernanza** - Decisiones más representativas
- ✅ **Mayor legitimidad** - Más personas participan

---

## 🔒 Seguridad del Relayer

### ¿Es Seguro?

**Sí, es seguro** porque:

1. ✅ **El relayer NO puede cambiar tu transacción**
   - Solo puede ejecutarla tal como la firmaste
   - Tu firma es específica para esa transacción

2. ✅ **El relayer NO puede robar tus fondos**
   - Solo ejecuta lo que autorizaste
   - No tiene acceso a tu wallet

3. ✅ **La firma es verificada**
   - MinimalForwarder verifica la firma antes de ejecutar
   - Solo tu firma puede autorizar tu transacción

4. ✅ **Nonces previenen replay**
   - Cada firma solo se puede usar una vez
   - No se puede reutilizar una firma antigua

---

## 📊 Resumen de Implementación

| Componente | Estado | Archivo |
|------------|--------|---------|
| API Route `/api/relay` | ✅ Implementado | `web/app/api/relay/route.ts` |
| Función `sendToRelayer()` | ✅ Implementado | `web/lib/metaTransaction.ts` |
| Uso en votación | ✅ Implementado | `web/components/ProposalList.tsx` |
| Uso en crear propuesta | ✅ Implementado | `web/components/CreateProposal.tsx` |
| Daemon para ejecutar | ✅ Implementado | `web/scripts/daemon.ts` |
| API execute-proposals | ✅ Implementado | `web/app/api/execute-proposals/route.ts` |
| Configuración | ✅ Implementado | `web/.env.local` |

**TOTAL: 7/7 componentes implementados (100%)** ✅

---

## 🎓 Conceptos Clave

### Relayer:

Servidor backend que:
- Recibe firmas de usuarios
- Paga el gas de las transacciones
- Ejecuta transacciones en la blockchain

### Meta-Transaction:

Transacción que:
- Usuario firma (sin pagar gas)
- Relayer envía a blockchain (paga gas)
- Se ejecuta en el contrato destino

### Gasless:

Sistema donde:
- Usuario no paga gas
- Relayer paga el gas
- Usuario solo firma

---

## ✅ Conclusión

**SÍ, el Relayer está COMPLETAMENTE IMPLEMENTADO** en este proyecto:

1. ✅ API Route del relayer (`/api/relay`)
2. ✅ Función para enviar al relayer
3. ✅ Usado en votación
4. ✅ Usado en crear propuestas
5. ✅ Daemon para ejecutar propuestas
6. ✅ Configuración completa

**El relayer permite que todos los usuarios usen el DAO sin pagar gas.** 🚀

---

## 📂 Archivos Clave

- **Relayer API:** `web/app/api/relay/route.ts`
- **Enviar al relayer:** `web/lib/metaTransaction.ts`
- **Daemon:** `web/scripts/daemon.ts`
- **Configuración:** `web/.env.local`

**¡El relayer está completamente integrado y funcionando!** ✅


