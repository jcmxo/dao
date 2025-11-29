# 🚀 Cómo Ejecutar el Proyecto DAO

Guía paso a paso para ejecutar la aplicación DAO con votación gasless.

## 📋 Prerrequisitos

Asegúrate de tener instalado:
- ✅ Foundry (forge, anvil) - Ya instalado
- ✅ Node.js 18+ y npm
- ✅ MetaMask en tu navegador

---

## 🔧 Paso 1: Instalar Dependencias

### 1.1. Instalar OpenZeppelin Contracts (Smart Contracts)

```bash
cd sc
forge install OpenZeppelin/openzeppelin-contracts
```

### 1.2. Instalar Dependencias del Frontend

```bash
cd ../web
npm install
```

---

## 🌐 Paso 2: Iniciar Anvil (Nodo Blockchain Local)

Abre una **nueva terminal** y ejecuta:

```bash
anvil
```

**⚠️ IMPORTANTE:** Anvil mostrará algo como esto:
```
Available Accounts
==================
(0) 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

(1) 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
...
```

**Guarda la primera cuenta:**
- Dirección: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- Clave privada: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

**Deja Anvil corriendo** en esta terminal.

---

## 📝 Paso 3: Desplegar los Contratos

Abre **otra terminal nueva** y ejecuta:

```bash
cd /mnt/c/Users/jcmxo/dao/sc
forge script script/DeployLocal.s.sol:DeployLocal --rpc-url http://127.0.0.1:8545 --broadcast
```

**⚠️ IMPORTANTE:** Copia las direcciones de los contratos que aparezcan:
```
MinimalForwarder deployed at: 0x5FbDB2315678afecb367f032d93F642f64180aa3
DAOVoting deployed at: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

---

## ⚙️ Paso 4: Configurar Variables de Entorno

Crea el archivo `web/.env.local` con el siguiente contenido:

```env
NEXT_PUBLIC_DAO_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
NEXT_PUBLIC_FORWARDER_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_CHAIN_ID=31337
RELAYER_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
RELAYER_ADDRESS=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
RPC_URL=http://127.0.0.1:8545
DAEMON_INTERVAL_SECONDS=60
```

**Reemplaza las direcciones** con las que obtuviste en el Paso 3.

---

## 🦊 Paso 5: Configurar MetaMask

1. Abre MetaMask en tu navegador
2. Haz clic en la red actual (arriba a la izquierda)
3. Haz clic en "Add Network" → "Add a network manually"
4. Completa los siguientes datos:
   - **Network Name:** Localhost 8545
   - **New RPC URL:** http://127.0.0.1:8545
   - **Chain ID:** 31337
   - **Currency Symbol:** ETH
   - **Block Explorer URL:** (deja vacío)
5. Haz clic en "Save"

6. **Importar cuenta de Anvil:**
   - Haz clic en el icono de cuenta (arriba derecha)
   - Selecciona "Import Account"
   - Pega una de las claves privadas de Anvil (puedes usar la cuenta 1 o 2, no la 0)
   - La cuenta tendrá 10,000 ETH de prueba

---

## 🎨 Paso 6: Iniciar el Frontend

En una **nueva terminal**, ejecuta:

```bash
cd /mnt/c/Users/jcmxo/dao/web
npm run dev
```

Espera a que aparezca:
```
✓ Ready in X seconds
○ Local:        http://localhost:3000
```

Abre tu navegador en: **http://localhost:3000**

---

## 🧪 Paso 7: Probar la Aplicación

### 7.1. Conectar Wallet
1. En la página web, haz clic en **"Connect Wallet"**
2. Acepta la conexión en MetaMask
3. Deberías ver tu dirección de wallet en la parte superior

### 7.2. Fondear el DAO
1. En el panel "Fund DAO", ingresa una cantidad (ej: `10 ETH`)
2. Haz clic en **"Fund DAO"**
3. Confirma la transacción en MetaMask
4. Verás tu balance actualizado

### 7.3. Crear una Propuesta
1. Si tienes al menos 10% del balance total, verás el formulario "Create Proposal"
2. Completa:
   - **Recipient Address:** Usa otra dirección de Anvil (ej: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`)
   - **Amount:** Ej: `5 ETH`
   - **Deadline:** Selecciona una fecha futura (ej: mañana)
3. Haz clic en **"Create Proposal"**
4. Confirma en MetaMask

### 7.4. Votar (Gasless!)
1. Abre otra cuenta de MetaMask (importa otra clave privada de Anvil)
2. Conecta esa cuenta a la web
3. Fondea el DAO con esa cuenta (ej: `5 ETH`)
4. En la propuesta creada, haz clic en **"For"**, **"Against"** o **"Abstain"**
5. ✨ **¡No pagarás gas!** Solo firmarás la transacción

### 7.5. Ejecutar Propuesta (Opcional)
- Espera a que pase el deadline + 24 horas
- O ejecuta manualmente desde la web si el botón está habilitado

---

## 🤖 Paso 8: Iniciar el Daemon (Opcional)

El daemon ejecuta propuestas aprobadas automáticamente. En una **nueva terminal**:

```bash
cd /mnt/c/Users/jcmxo/dao/web
npm run daemon
```

---

## 📊 Resumen de Terminales Necesarias

Necesitas **4 terminales** abiertas:

1. **Terminal 1:** Anvil (nodo blockchain)
   ```bash
   anvil
   ```

2. **Terminal 2:** Frontend
   ```bash
   cd web && npm run dev
   ```

3. **Terminal 3:** Daemon (opcional)
   ```bash
   cd web && npm run daemon
   ```

4. **Terminal 4:** Para comandos adicionales (deployment, tests, etc.)

---

## 🐛 Solución de Problemas

### ❌ Error: "Cannot find module"
```bash
cd web
npm install
```

### ❌ Error: "Relayer not configured"
- Verifica que `web/.env.local` existe
- Verifica que `RELAYER_PRIVATE_KEY` está configurado

### ❌ Error: "Contract not found"
- Verifica que las direcciones en `.env.local` son correctas
- Asegúrate de que Anvil está corriendo
- Redespliega los contratos si es necesario

### ❌ MetaMask no se conecta
- Verifica que agregaste la red Localhost 8545
- Verifica que Chain ID es 31337
- Recarga la página

### ❌ Error al votar
- Verifica que tienes balance en el DAO (mínimo 0.01 ETH)
- Verifica que el relayer tiene ETH (la cuenta 0 de Anvil)
- Verifica que `.env.local` tiene la clave privada correcta del relayer

---

## 🧪 Ejecutar Tests

```bash
cd sc
forge test -vv
```

---

## 📝 Notas Importantes

- ⚠️ **Anvil debe estar corriendo** todo el tiempo
- ⚠️ **El relayer necesita ETH** - usa la cuenta 0 de Anvil (tiene 10,000 ETH)
- ⚠️ **Los usuarios necesitan fondear** el DAO antes de votar
- ⚠️ **Solo usuarios con ≥10% del balance** pueden crear propuestas

---

¡Listo! 🎉 Tu DAO está funcionando.

