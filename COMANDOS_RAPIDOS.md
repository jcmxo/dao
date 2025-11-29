# ⚡ Comandos Rápidos para Ejecutar el Proyecto

## 🎯 Inicio Rápido (Resumen)

### 1️⃣ Terminal 1: Anvil (Bloquea esta terminal)
```bash
anvil
```
**Guarda:** Primera dirección y clave privada que aparezca

### 2️⃣ Terminal 2: Deployment de Contratos
```bash
cd /mnt/c/Users/jcmxo/dao/sc
forge script script/DeployLocal.s.sol:DeployLocal --rpc-url http://127.0.0.1:8545 --broadcast
```
**Copia:** Las direcciones de MinimalForwarder y DAOVoting

### 3️⃣ Crear archivo `.env.local`
```bash
cd /mnt/c/Users/jcmxo/dao/web
nano .env.local
```
Pega este contenido (reemplaza las direcciones):
```env
NEXT_PUBLIC_DAO_ADDRESS=0x...
NEXT_PUBLIC_FORWARDER_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=31337
RELAYER_PRIVATE_KEY=0x...
RELAYER_ADDRESS=0x...
RPC_URL=http://127.0.0.1:8545
DAEMON_INTERVAL_SECONDS=60
```

### 4️⃣ Terminal 3: Frontend
```bash
cd /mnt/c/Users/jcmxo/dao/web
npm install
npm run dev
```

### 5️⃣ Abre en navegador
```
http://localhost:3000
```

---

## 📋 Comandos Útiles

### Instalar dependencias (solo primera vez)
```bash
# OpenZeppelin (ya hecho)
cd /mnt/c/Users/jcmxo/dao/sc/lib
git clone --depth 1 --branch v5.0.0 https://github.com/OpenZeppelin/openzeppelin-contracts.git openzeppelin-contracts

# Frontend (ya hecho)
cd /mnt/c/Users/jcmxo/dao/web
npm install
```

### Compilar contratos
```bash
cd /mnt/c/Users/jcmxo/dao/sc
forge build
```

### Ejecutar tests
```bash
cd /mnt/c/Users/jcmxo/dao/sc
forge test -vv
```

### Iniciar daemon (ejecución automática de propuestas)
```bash
cd /mnt/c/Users/jcmxo/dao/web
npm run daemon
```

---

## 🔍 Verificar Estado

### ¿Anvil está corriendo?
```bash
curl http://127.0.0.1:8545
```

### ¿Los contratos están desplegados?
Revisa las direcciones en `web/.env.local`

### ¿Node modules instalados?
```bash
ls web/node_modules/ | head -5
```

---

## 🐛 Solución Rápida

### Reinstalar todo desde cero
```bash
# Limpiar
cd /mnt/c/Users/jcmxo/dao/web
rm -rf node_modules package-lock.json

# Reinstalar
npm install
```

### Redesplegar contratos
```bash
cd /mnt/c/Users/jcmxo/dao/sc
forge script script/DeployLocal.s.sol:DeployLocal --rpc-url http://127.0.0.1:8545 --broadcast
```

---

**💡 Tip:** Mantén 3 terminales abiertas:
1. Anvil (nunca la cierres)
2. Frontend (`npm run dev`)
3. Para comandos adicionales

