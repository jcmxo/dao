# 📺 Comandos para Ejecutar en Diferentes Terminales

## Terminal 1: Anvil (Ya está corriendo ✅)
**Esta terminal NO se cierra**
```bash
anvil
```
Ya está funcionando en segundo plano.

---

## Terminal 2: Deployment y Frontend

### Paso 1: Desplegar contratos
```bash
cd /mnt/c/Users/jcmxo/dao/sc
forge script script/DeployLocal.s.sol:DeployLocal --rpc-url http://127.0.0.1:8545 --broadcast
```

**IMPORTANTE:** Copia las dos direcciones que aparezcan:
- `MinimalForwarder deployed at: 0x...`
- `DAOVoting deployed at: 0x...`

### Paso 2: Crear archivo .env.local
```bash
cd /mnt/c/Users/jcmxo/dao/web
nano .env.local
```

Pega esto (reemplaza las direcciones con las que copiaste):
```env
NEXT_PUBLIC_DAO_ADDRESS=0x...
NEXT_PUBLIC_FORWARDER_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=31337
RELAYER_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
RELAYER_ADDRESS=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
RPC_URL=http://127.0.0.1:8545
DAEMON_INTERVAL_SECONDS=60
```

Guarda (Ctrl+X, luego Y, luego Enter)

### Paso 3: Instalar dependencias (solo primera vez)
```bash
npm install
```

### Paso 4: Iniciar frontend
```bash
npm run dev
```

Verás:
```
✓ Ready
○ Local: http://localhost:3000
```

---

## Terminal 3: Daemon (Opcional)
Para ejecución automática de propuestas:
```bash
cd /mnt/c/Users/jcmxo/dao/web
npm run daemon
```

---

## 🌐 Navegador
Abre: **http://localhost:3000**

---

## 📋 Checklist
- [ ] Terminal 1: Anvil corriendo
- [ ] Terminal 2: Contratos desplegados
- [ ] Terminal 2: .env.local creado con direcciones correctas
- [ ] Terminal 2: npm install ejecutado
- [ ] Terminal 2: npm run dev ejecutando
- [ ] Navegador: http://localhost:3000 abierto
- [ ] MetaMask: Configurado con red localhost (Chain ID: 31337)

