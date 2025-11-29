# DAO Voting - Gasless Governance

Aplicación de DAO (Decentralized Autonomous Organization) con votación gasless mediante meta-transacciones.

## 🚀 Características

- ✅ **Votación Gasless:** Los usuarios no pagan gas, el relayer lo cubre
- ✅ **Panel DAO Treasury:** Gestión completa de fondos con información detallada
- ✅ **Creación de Propuestas:** Con descripción y duración de votación en días
- ✅ **Visualización Mejorada:** Porcentajes, barras visuales y Blockchain Time
- ✅ **Meta-transacciones:** Implementadas mediante EIP-712 y MinimalForwarder

## 🏗️ Estructura del Proyecto

```
dao/
├── sc/                    # Smart Contracts (Foundry)
│   ├── src/
│   │   ├── DAOVoting.sol
│   │   └── MinimalForwarder.sol
│   └── test/
├── web/                   # Frontend (Next.js)
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── hooks/
└── README.md
```

## 🛠️ Tecnologías

- **Smart Contracts:** Solidity, Foundry, OpenZeppelin
- **Frontend:** Next.js, React, TypeScript, ethers.js
- **Blockchain:** Anvil (desarrollo local)
- **Meta-transacciones:** EIP-712, MinimalForwarder

## 📋 Requisitos Previos

- Node.js 18+
- Foundry
- MetaMask
- Git

## 🚀 Instalación y Uso

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/tu-repo.git
cd dao
```

### 2. Instalar Dependencias

```bash
# Frontend
cd web
npm install

# Smart Contracts
cd ../sc
forge install
```

### 3. Configurar Variables de Entorno

Crea `web/.env.local`:

```env
NEXT_PUBLIC_DAO_ADDRESS=0x...
NEXT_PUBLIC_FORWARDER_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=31337
RELAYER_PRIVATE_KEY=0x...
RELAYER_ADDRESS=0x...
RPC_URL=http://127.0.0.1:8545
```

### 4. Iniciar Anvil (Blockchain Local)

```bash
anvil
```

### 5. Desplegar Contratos

```bash
cd sc
forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast --private-key 0x...
```

### 6. Iniciar Frontend

```bash
cd web
npm run dev
```

### 7. Iniciar Relayer (API)

```bash
cd web
npm run relay
```

## 📖 Uso

1. **Conectar MetaMask:**
   - Añade la red local Anvil (Chain ID: 31337)
   - Conecta tu wallet

2. **Fondear el DAO:**
   - Usa el panel "DAO Treasury"
   - Deposita ETH al DAO

3. **Crear Propuestas:**
   - Completa el formulario en "Create Proposal"
   - Agrega una descripción
   - Selecciona duración de votación en días
   - Crea la propuesta (gasless)

4. **Votar:**
   - Ve a la sección "Proposals"
   - Haz clic en "For", "Against" o "Abstain"
   - La votación es gasless

## 🎨 Mejoras Implementadas

- ✅ Panel "DAO Treasury" mejorado
- ✅ Campo Description en propuestas
- ✅ Voting Duration en días
- ✅ Porcentajes y barras visuales
- ✅ Blockchain Time
- ✅ Total Votes contador
- ✅ Mejor manejo de errores

## 📝 Documentación

Ver los archivos `.md` en el directorio raíz para documentación detallada:
- `MEJORAS_APLICADAS.md` - Detalles de las mejoras
- `COMO_CREAR_PROPUESTA.md` - Guía de uso
- `GUIA_USO.md` - Guía completa

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:
1. Fork el repositorio
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👥 Autores

- Tu Nombre

## 🙏 Agradecimientos

- OpenZeppelin por los contratos base
- Foundry por las herramientas de desarrollo
- Next.js por el framework frontend
