# Implementación EIP-712 en el DAO Voting

## ✅ Confirmación: Sí, usamos EIP-712

Este proyecto implementa **EIP-712** (Typed Structured Data) para las meta-transacciones gasless.

---

## 🔐 ¿Qué es EIP-712?

**EIP-712** es un estándar de Ethereum para firmar mensajes estructurados y legibles. Permite:

- ✅ **Firmas más seguras** - Los usuarios ven exactamente qué están firmando
- ✅ **Mejor UX** - MetaMask muestra los datos de forma legible
- ✅ **Prevención de phishing** - El dominio verifica la autenticidad
- ✅ **Estándar de la industria** - Ampliamente adoptado

---

## 📋 Flujo Completo (EIP-712)

```
┌─────────┐                    ┌──────────┐
│   dapp  │─── EIP-712 msg ───>│ MetaMask │
│         │<── Firma EIP-712 ──│          │
└─────────┘                    └──────────┘
     │
     │ Envía firma + request
     ↓
┌──────────┐                    ┌──────────────────┐
│ relayer  │─── execute() ─────>│ MinimalForwarder │
│ (paga gas)│                    │ (verifica EIP-712)│
└──────────┘                    └──────────────────┘
                                        │
                                        │ ejecuta función
                                        ↓
                                ┌──────────────┐
                                │ DAOVoting    │
                                │ (vota/crea)  │
                                └──────────────┘
```

---

## 🔧 Implementación en Frontend

**Archivo:** `web/lib/metaTransaction.ts`

### 1. Dominio EIP-712

```typescript
const EIP712_DOMAIN = {
  name: "MinimalForwarder",
  version: "0.0.1",
  chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID || 31337),
  verifyingContract: process.env.NEXT_PUBLIC_FORWARDER_ADDRESS || "",
};
```

**Propósito:** Identifica el contrato que puede verificar esta firma.

### 2. Tipos de Datos Estructurados

```typescript
const FORWARD_REQUEST_TYPE = {
  ForwardRequest: [
    { name: "from", type: "address" },
    { name: "to", type: "address" },
    { name: "value", type: "uint256" },
    { name: "gas", type: "uint256" },
    { name: "nonce", type: "uint256" },
    { name: "data", type: "bytes" },
  ],
};
```

**Propósito:** Define la estructura del mensaje que se firmará.

### 3. Firma con signTypedData()

```typescript
const signature = await signer.signTypedData(
  domain,              // Dominio EIP-712
  FORWARD_REQUEST_TYPE, // Tipos estructurados
  message              // Datos del mensaje
);
```

**Propósito:** MetaMask firma los datos estructurados usando EIP-712.

---

## 🔧 Implementación en Smart Contract

**Archivo:** `sc/src/MinimalForwarder.sol`

### 1. Herencia de EIP712

```solidity
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

contract MinimalForwarder is EIP712 {
    constructor() EIP712("MinimalForwarder", "0.0.1") {}
}
```

**Propósito:** Usa la implementación estándar de OpenZeppelin.

### 2. Verificación de Firma

```solidity
function verify(ForwardRequest calldata req, bytes calldata signature)
    public view returns (bool)
{
    address signer = _hashTypedDataV4(
        keccak256(abi.encode(...))
    ).recover(signature);
    
    return _nonces[req.from] == req.nonce && signer == req.from;
}
```

**Propósito:** Verifica que la firma sea válida usando el hash EIP-712.

---

## 🔄 Flujo Paso a Paso

### Paso 1: Usuario inicia acción
```
Usuario hace clic en "Votar" o "Crear Propuesta"
```

### Paso 2: dapp prepara mensaje EIP-712
```typescript
const request = {
  from: account,
  to: daoAddress,
  value: 0n,
  gas: 100000n,
  nonce: nonce,
  data: encodedFunctionData,
};
```

### Paso 3: MetaMask muestra mensaje estructurado
```
MetaMask muestra al usuario:
- Dominio: MinimalForwarder
- Tipo: ForwardRequest
- Datos:
  - From: 0x...
  - To: 0x...
  - Value: 0 ETH
  - Gas: 100000
  - Nonce: 5
```

### Paso 4: Usuario firma con MetaMask
```
Usuario ve los datos claramente y aprueba
→ MetaMask genera firma EIP-712
→ Devuelve firma al dapp
```

### Paso 5: dapp envía al relayer
```typescript
await fetch("/api/relay", {
  method: "POST",
  body: JSON.stringify({ request, signature }),
});
```

### Paso 6: Relayer ejecuta en blockchain
```solidity
forwarder.execute(request, signature)
  → Verifica firma EIP-712
  → Valida nonce
  → Ejecuta función en DAO
```

---

## ✅ Ventajas de EIP-712

### Seguridad
- ✅ **Prevención de replay attacks** - Nonce único por usuario
- ✅ **Verificación de dominio** - Solo el contrato correcto puede validar
- ✅ **Firmas criptográficamente seguras** - ECDSA con keccak256

### Experiencia de Usuario
- ✅ **Transparencia** - Usuario ve exactamente qué está firmando
- ✅ **Legibilidad** - MetaMask muestra los datos en formato legible
- ✅ **Confianza** - Usuario puede verificar el dominio y el contrato

### Estándar
- ✅ **EIP-712** - Estándar oficial de Ethereum
- ✅ **OpenZeppelin** - Implementación auditada y segura
- ✅ **Compatible** - Funciona con MetaMask, WalletConnect, etc.

---

## 📚 Referencias

- [EIP-712: Typed Structured Data Hashing and Signing](https://eips.ethereum.org/EIPS/eip-712)
- [OpenZeppelin EIP712](https://docs.openzeppelin.com/contracts/4.x/api/utils#EIP712)
- [MetaMask EIP-712 Support](https://docs.metamask.io/wallet/how-to/sign-data/#use-eth_signtypeddata-v4)

---

## 🎯 Resumen

**Sí, usamos EIP-712 completamente:**

1. ✅ **Frontend** prepara mensajes estructurados EIP-712
2. ✅ **MetaMask** firma usando `signTypedData()` (EIP-712)
3. ✅ **Smart Contract** verifica usando `_hashTypedDataV4()` (EIP-712)
4. ✅ **Flujo completo** alineado con el estándar EIP-712

**El diagrama que compartiste es exactamente lo que implementamos** ✅

