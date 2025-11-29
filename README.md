# DAO Voting - Gasless Governance

Aplicación de DAO (Decentralized Autonomous Organization) con votación gasless mediante meta-transacciones.

## 🚀 Características

- ✅ **Votación Gasless:** Los usuarios no pagan gas, el relayer lo cubre
- ✅ **Creación Gasless de Propuestas:** Opción para crear propuestas sin pagar gas
- ✅ **Indicador Visual de Gasless:** Badge que muestra si una propuesta fue creada con gasless o pagando gas
- ✅ **Panel DAO Treasury:** Gestión completa de fondos con información detallada
- ✅ **Creación de Propuestas:** Con descripción y duración de votación en días
- ✅ **Visualización Mejorada:** Porcentajes, barras visuales y Blockchain Time
- ✅ **Meta-transacciones:** Implementadas mediante EIP-712 y MinimalForwarder
- ✅ **UI Profesional:** Diseño moderno con glassmorphism, gradientes y animaciones

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
   - Elige si usar gasless (gratis) o pagar gas
   - Crea la propuesta

4. **Votar:**
   - Ve a la sección "Proposals"
   - Haz clic en "For", "Against" o "Abstain"
   - La votación es siempre gasless (sin costo)

5. **Identificar Propuestas Gasless:**
   - Busca el badge verde "✓ Gasless" al lado del número de propuesta
   - Indica que fue creada sin pagar gas
   - Badge azul "💰 Paid Gas" indica que se pagó gas al crear

## 🏷️ Indicador Visual de Gasless

Cada propuesta muestra un badge visual que indica cómo fue creada:

- 🟢 **Badge Verde "✓ Gasless"** = Propuesta creada sin pagar gas (gratis)
- 🔵 **Badge Azul "💰 Paid Gas"** = Propuesta creada pagando gas
- ⚪ **Sin badge** = Propuesta antigua (antes de implementar esta funcionalidad)

**Ubicación:** El badge aparece junto al número de propuesta en la tarjeta.

**Nota importante:** Las **votaciones siempre son gasless**, independientemente de cómo se creó la propuesta.

Para más detalles, ver: `COMO_SABER_SI_PROPUESTA_ES_GASLESS.md`

## 📊 Estados de las Propuestas

Las propuestas tienen diferentes estados que cambian automáticamente:

### 🟡 Active (Activa)
- La propuesta está **abierta para votar**
- El **deadline (fecha límite) no ha pasado**
- Los usuarios pueden votar
- **Nota:** El botón "Active" es solo un indicador visual, no es clickeable

### 🔵 Approved (Aprobada)
- El **deadline ya pasó**
- Tiene **más votos "For" que "Against"**
- Puede ser **ejecutada** después de 24 horas de seguridad
- Ya no se pueden agregar más votos

### 🔴 Rejected (Rechazada)
- El **deadline ya pasó**
- Tiene **más votos "Against" que "For"**
- **NO puede ser ejecutada**
- Ya no se pueden agregar más votos

### 🟢 Executed (Ejecutada)
- Ya fue **ejecutada**
- Los **fondos fueron enviados** al destinatario
- Propuesta **finalizada**

### ⏰ Cambio de Estado

Los estados cambian **automáticamente** cuando:
- El **deadline pasa** → Cambia a "Approved" o "Rejected"
- La propuesta es **ejecutada** → Cambia a "Executed"
- **No puedes cambiar manualmente** el estado haciendo clic

Para más detalles, ver: `COMO_FUNCIONAN_ESTADOS.md`

## 🎨 Mejoras Implementadas

- ✅ **Panel "DAO Treasury"** mejorado con información detallada
- ✅ **Campo Description** en propuestas (guardado en localStorage)
- ✅ **Voting Duration en días** (más intuitivo que seleccionar fecha)
- ✅ **Indicador Visual de Gasless** - Badge que muestra si la propuesta fue creada con gasless
- ✅ **Porcentajes y barras visuales** para votos (For, Against, Abstain)
- ✅ **Blockchain Time** actualizado en tiempo real
- ✅ **Total Votes** contador visible
- ✅ **Creación de propuestas gasless** - Opción para crear sin pagar gas
- ✅ **UI Profesional** - Diseño moderno con glassmorphism, gradientes y animaciones
- ✅ **Mejor manejo de errores** con mensajes descriptivos
- ✅ **Estados de carga** para prevenir múltiples clics
- ✅ **Checkbox interactivo** para elegir entre gasless y transacción normal

## 📝 Documentación

Ver los archivos `.md` en el directorio raíz para documentación detallada:

### Guías de Uso
- `GUIA_USO.md` - Guía completa de uso
- `COMO_CREAR_PROPUESTA.md` - Guía paso a paso para crear propuestas
- `VOTAR_PROPUESTA.md` - Guía para votar en propuestas
- `COMO_FUNCIONAN_ESTADOS.md` - Explicación de los estados de propuestas

### Conceptos Técnicos
- `EXPLICACION_GASLESS_VOTING.md` - Qué es y cómo funciona el gasless voting
- `IMPLEMENTACION_EIP712.md` - Detalles de la implementación EIP-712
- `EXPLICACION_CHECKBOX_GASLESS.md` - Cómo funciona el checkbox de gasless
- `COMO_SABER_SI_PROPUESTA_ES_GASLESS.md` - Cómo identificar propuestas gasless

### Detalles de Implementación
- `MEJORAS_APLICADAS.md` - Detalles de todas las mejoras implementadas
- `ESTADO_FINAL_FUNCIONANDO.md` - Estado final de la aplicación

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
