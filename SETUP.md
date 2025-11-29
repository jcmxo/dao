# Guía de Configuración Rápida

## Paso 1: Instalar Dependencias

### Smart Contracts
```bash
cd sc
forge install OpenZeppelin/openzeppelin-contracts
```

### Frontend
```bash
cd ../web
npm install
```

## Paso 2: Iniciar Anvil (Nodo Local)

```bash
anvil
```

Esto mostrará 10 cuentas con sus claves privadas. **Guarda la primera clave privada** para usarla como relayer.

## Paso 3: Desplegar Contratos

En una nueva terminal:

```bash
cd sc
forge script script/DeployLocal.s.sol:DeployLocal --rpc-url http://127.0.0.1:8545 --broadcast
```

**Copia las direcciones** de MinimalForwarder y DAOVoting que se muestren en la salida.

## Paso 4: Configurar Variables de Entorno

Crea `web/.env.local`:

```env
NEXT_PUBLIC_DAO_ADDRESS=<dirección del contrato DAO>
NEXT_PUBLIC_FORWARDER_ADDRESS=<dirección del MinimalForwarder>
NEXT_PUBLIC_CHAIN_ID=31337
RELAYER_PRIVATE_KEY=<primera clave privada de Anvil>
RELAYER_ADDRESS=<dirección de la primera cuenta de Anvil>
RPC_URL=http://127.0.0.1:8545
DAEMON_INTERVAL_SECONDS=60
```

## Paso 5: Iniciar Frontend

```bash
cd web
npm run dev
```

Abre http://localhost:3000

## Paso 6: Probar la Aplicación

1. **Conectar Wallet**: Haz clic en "Connect Wallet" y acepta en MetaMask
2. **Fondear DAO**: Deposita ETH en el DAO (necesitas al menos 10% para crear propuestas)
3. **Crear Propuesta**: Si tienes suficiente balance, crea una propuesta
4. **Votar**: Vota en propuestas (sin pagar gas gracias a meta-transacciones)
5. **Ejecutar**: Después del deadline + 24 horas, ejecuta propuestas aprobadas

## Configurar MetaMask para Localhost

1. Abre MetaMask
2. Agrega red personalizada:
   - Network Name: Localhost 8545
   - New RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - Currency Symbol: ETH
3. Importa una cuenta usando una de las claves privadas de Anvil

## Solución de Problemas

### Error: "Relayer not configured"
- Verifica que `.env.local` existe y tiene `RELAYER_PRIVATE_KEY`

### Error: "Contract not found"
- Verifica que las direcciones en `.env.local` son correctas
- Asegúrate de que Anvil está corriendo

### Error al votar
- Verifica que tienes balance suficiente en el DAO (mínimo 0.01 ETH)
- Verifica que el relayer tiene ETH para pagar gas

## Ejecutar Tests

```bash
cd sc
forge test -vv
```

## Ejecutar Daemon

El daemon ejecuta propuestas aprobadas automáticamente:

```bash
cd web
npx tsx scripts/daemon.ts
```

O usa un cron job para llamar a `/api/execute-proposals` periódicamente.

