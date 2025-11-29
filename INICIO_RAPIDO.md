# 🚀 Inicio Rápido - Ejecutar el Proyecto DAO

## 📝 Pasos para Ejecutar (5 minutos)

### Paso 1: Instalar OpenZeppelin Contracts
Ejecuta esto UNA SOLA VEZ:
```bash
cd /mnt/c/Users/jcmxo/dao/sc/lib
git clone https://github.com/OpenZeppelin/openzeppelin-contracts.git
cd openzeppelin-contracts
git checkout v5.0.0
```

### Paso 2: Iniciar Anvil
Abre una **TERMINAL 1** y ejecuta:
```bash
anvil
```
**NO CIERRES ESTA TERMINAL** - Deja Anvil corriendo.

Verás algo como:
```
Available Accounts
==================
(0) 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

**GUARDA ESTA INFORMACIÓN** - la necesitarás.

### Paso 3: Desplegar Contratos
Abre una **TERMINAL 2** y ejecuta:
```bash
cd /mnt/c/Users/jcmxo/dao/sc
forge script script/DeployLocal.s.sol:DeployLocal --rpc-url http://127.0.0.1:8545 --broadcast
```

Copia las direcciones que aparezcan (algo como):
- MinimalForwarder: `0x5FbDB...`
- DAOVoting: `0xe7f17...`

### Paso 4: Crear archivo de configuración
Ejecuta:
```bash
cd /mnt/c/Users/jcmxo/dao/web
cat > .env.local << 'EOF'
NEXT_PUBLIC_DAO_ADDRESS=REEMPLAZA_CON_DIRECCION_DAO
NEXT_PUBLIC_FORWARDER_ADDRESS=REEMPLAZA_CON_DIRECCION_FORWARDER
NEXT_PUBLIC_CHAIN_ID=31337
RELAYER_PRIVATE_KEY=REEMPLAZA_CON_PRIMERA_CLAVE_PRIVADA_ANVIL
RELAYER_ADDRESS=REEMPLAZA_CON_PRIMERA_DIRECCION_ANVIL
RPC_URL=http://127.0.0.1:8545
DAEMON_INTERVAL_SECONDS=60
EOF
```

Luego edita el archivo y reemplaza los valores:
```bash
nano .env.local
```

### Paso 5: Instalar dependencias del frontend (solo primera vez)
```bash
cd /mnt/c/Users/jcmxo/dao/web
npm install
```

### Paso 6: Iniciar el Frontend
En la **TERMINAL 2** (o nueva terminal):
```bash
cd /mnt/c/Users/jcmxo/dao/web
npm run dev
```

Espera a ver:
```
✓ Ready
○ Local: http://localhost:3000
```

### Paso 7: Configurar MetaMask
1. Abre MetaMask
2. Agrega red personalizada:
   - Nombre: Localhost 8545
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - Símbolo: ETH
3. Importa una cuenta de Anvil (usa una clave privada de las que mostró Anvil)

### Paso 8: ¡Usar la aplicación!
Abre: http://localhost:3000

---

## ✅ Checklist Rápido

- [ ] OpenZeppelin instalado en `sc/lib/openzeppelin-contracts`
- [ ] Anvil corriendo en Terminal 1
- [ ] Contratos desplegados (viste las direcciones)
- [ ] Archivo `.env.local` creado con las direcciones correctas
- [ ] `npm install` ejecutado en la carpeta `web`
- [ ] Frontend corriendo (`npm run dev`)
- [ ] MetaMask configurado con red localhost
- [ ] Navegador abierto en http://localhost:3000

---

## 🎯 Orden de Ejecución (Resumen)

1. **Terminal 1:** `anvil` (dejar corriendo)
2. **Terminal 2:** Desplegar contratos
3. **Configurar:** `.env.local` con direcciones
4. **Terminal 2:** `npm run dev` (frontend)
5. **Navegador:** http://localhost:3000

---

## 🆘 Problemas Comunes

**"Cannot find module @openzeppelin"**
→ Ejecuta: `cd sc/lib && git clone https://github.com/OpenZeppelin/openzeppelin-contracts.git`

**"Relayer not configured"**
→ Verifica que `.env.local` existe y tiene `RELAYER_PRIVATE_KEY`

**"Connection refused"**
→ Anvil no está corriendo. Inicia Anvil primero.

**"Contract not found"**
→ Redespliega los contratos y actualiza `.env.local`

---

¡Eso es todo! 🎉

