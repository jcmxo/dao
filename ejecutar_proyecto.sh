#!/bin/bash

echo "🚀 Iniciando proyecto DAO..."
echo ""

# Verificar que Anvil está corriendo
echo "1️⃣ Verificando Anvil..."
if curl -s http://127.0.0.1:8545 > /dev/null 2>&1; then
    echo "   ✅ Anvil está corriendo"
else
    echo "   ❌ Anvil NO está corriendo"
    echo "   Por favor, abre una terminal y ejecuta: anvil"
    exit 1
fi

# Verificar OpenZeppelin
echo ""
echo "2️⃣ Verificando OpenZeppelin..."
if [ -d "sc/lib/openzeppelin-contracts" ]; then
    echo "   ✅ OpenZeppelin instalado"
else
    echo "   ⚠️  Instalando OpenZeppelin..."
    cd sc/lib
    git clone --depth 1 --branch v5.0.0 https://github.com/OpenZeppelin/openzeppelin-contracts.git openzeppelin-contracts
    cd ../..
    echo "   ✅ OpenZeppelin instalado"
fi

# Desplegar contratos
echo ""
echo "3️⃣ Desplegando contratos..."
cd sc
DEPLOY_OUTPUT=$(forge script script/DeployLocal.s.sol:DeployLocal --rpc-url http://127.0.0.1:8545 --broadcast 2>&1)
cd ..

# Extraer direcciones
FORWARDER_ADDR=$(echo "$DEPLOY_OUTPUT" | grep -oP "MinimalForwarder deployed at: \K0x[a-fA-F0-9]{40}" | head -1)
DAO_ADDR=$(echo "$DEPLOY_OUTPUT" | grep -oP "DAOVoting deployed at: \K0x[a-fA-F0-9]{40}" | head -1)

if [ -z "$FORWARDER_ADDR" ] || [ -z "$DAO_ADDR" ]; then
    echo "   ❌ Error al desplegar contratos"
    echo "$DEPLOY_OUTPUT" | tail -20
    exit 1
fi

echo "   ✅ MinimalForwarder: $FORWARDER_ADDR"
echo "   ✅ DAOVoting: $DAO_ADDR"

# Obtener primera cuenta de Anvil (hardcoded para localhost)
RELAYER_ADDR="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
RELAYER_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"

# Crear .env.local
echo ""
echo "4️⃣ Creando archivo .env.local..."
cat > web/.env.local << EOF
NEXT_PUBLIC_DAO_ADDRESS=$DAO_ADDR
NEXT_PUBLIC_FORWARDER_ADDRESS=$FORWARDER_ADDR
NEXT_PUBLIC_CHAIN_ID=31337
RELAYER_PRIVATE_KEY=$RELAYER_KEY
RELAYER_ADDRESS=$RELAYER_ADDR
RPC_URL=http://127.0.0.1:8545
DAEMON_INTERVAL_SECONDS=60
EOF
echo "   ✅ Archivo .env.local creado"

# Instalar dependencias si es necesario
echo ""
echo "5️⃣ Verificando dependencias del frontend..."
if [ ! -d "web/node_modules" ]; then
    echo "   ⚠️  Instalando dependencias (esto puede tardar)..."
    cd web
    npm install
    cd ..
    echo "   ✅ Dependencias instaladas"
else
    echo "   ✅ Dependencias ya instaladas"
fi

echo ""
echo "=========================================="
echo "✅ Todo está listo!"
echo "=========================================="
echo ""
echo "📝 Contratos desplegados:"
echo "   Forwarder: $FORWARDER_ADDR"
echo "   DAO:       $DAO_ADDR"
echo ""
echo "🚀 Para iniciar el frontend, ejecuta:"
echo "   cd web"
echo "   npm run dev"
echo ""
echo "🌐 Luego abre: http://localhost:3000"
echo ""

