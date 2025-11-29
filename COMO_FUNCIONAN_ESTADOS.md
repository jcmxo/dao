# 📊 ¿Cómo Funcionan los Estados de las Propuestas?

## ℹ️ Importante

El botón **"Active"** que ves NO es un botón clickeable. Es solo un **indicador visual** que muestra el estado actual de la propuesta. No puedes cambiarlo haciendo clic.

---

## 🔄 Estados de una Propuesta

Una propuesta puede tener 4 estados diferentes:

### 1. **ACTIVE** (Naranja/Amarillo) 🟡

**Significa:**
- La propuesta está **abierta para votar**
- El **deadline (fecha límite) NO ha pasado**
- Aún **NO ha sido ejecutada**
- Los usuarios pueden votar

**Aparece cuando:**
- `deadline > ahora` Y `executed = false`

### 2. **APPROVED** (Azul) 🔵

**Significa:**
- El deadline **ya pasó**
- Tiene **más votos "For" que "Against"**
- Puede ser **ejecutada**
- Ya no se pueden agregar más votos

**Aparece cuando:**
- `deadline <= ahora` Y `votesFor > votesAgainst` Y `executed = false`

### 3. **REJECTED** (Rojo) 🔴

**Significa:**
- El deadline **ya pasó**
- Tiene **más votos "Against" que "For"**
- **NO puede ser ejecutada**
- Ya no se pueden agregar más votos

**Aparece cuando:**
- `deadline <= ahora` Y `votesAgainst >= votesFor` Y `executed = false`

### 4. **EXECUTED** (Verde) 🟢

**Significa:**
- Ya fue **ejecutada**
- Los **fondos fueron enviados** al destinatario
- Propuesta **finalizada**

**Aparece cuando:**
- `executed = true`

---

## ⏰ ¿Cuándo Cambia el Estado?

El estado cambia **AUTOMÁTICAMENTE** basado en:

### 1. **Cuando Pasa el Deadline**

```
Deadline = 31/10/2025, 09:20:24
Ahora = 01/11/2025, 10:00:00

→ Estado cambia de "Active" a "Approved" o "Rejected"
```

### 2. **Cuando la Propuesta es Ejecutada**

```
Usuario → Ejecuta propuesta → Estado cambia a "Executed"
```

---

## 🚫 ¿Por Qué No Puedo Hacer Clic en "Active"?

El botón "Active" es **solo visual** porque:

1. **Es un indicador**, no un control
2. **El estado se determina automáticamente** por el contrato
3. **No hay forma de cambiar manualmente** el estado
4. **Está basado en el deadline** y en si fue ejecutada

---

## 🔧 ¿Cómo Cambiar el Estado?

### Para Cambiar de "Active" a "Approved/Rejected":

1. **Espera a que pase el deadline:**
   - El deadline está en cada propuesta
   - Ejemplo: "Voting ends: 31/10/2025, 09:20:24"
   - Cuando pase esa fecha/hora, el estado cambiará automáticamente

2. **O cambia el tiempo del sistema (solo para pruebas):**
   - En desarrollo, puedes avanzar el tiempo de Anvil
   - Esto es solo para testing

### Para Cambiar a "Executed":

1. **Espera a que pase el deadline**
2. **Asegúrate de que tenga más votos "For"**
3. **Espera 24 horas más** (período de seguridad)
4. **Haz clic en "Execute Proposal"**
   - Este SÍ es un botón clickeable
   - Solo aparece cuando la propuesta puede ser ejecutada

---

## 📋 Flujo Completo

```
Crear Propuesta
    ↓
[ACTIVE] → Votación abierta
    ↓
Deadline pasa
    ↓
¿Más "For" que "Against"?
    ├─ Sí → [APPROVED] → Esperar 24h → [EXECUTED]
    └─ No → [REJECTED] → Finalizada
```

---

## 🎯 Resumen

| Estado | Es Clickable? | Cómo Cambiar |
|--------|---------------|--------------|
| **Active** | ❌ No | Esperar deadline |
| **Approved** | ❌ No | Ya cambió automáticamente |
| **Rejected** | ❌ No | Ya cambió automáticamente |
| **Execute Proposal** | ✅ Sí | Botón para ejecutar |

---

## 💡 Ejemplo Práctico

### Situación Actual:
- Propuesta #4 está "Active"
- Deadline: 31/10/2025, 09:20:24
- Tú quieres que deje de estar activa

### Soluciones:

1. **Esperar al deadline:**
   - Cuando llegue el 31/10/2025 a las 09:20:24
   - El estado cambiará automáticamente a "Approved" o "Rejected"

2. **Acelerar el tiempo (solo desarrollo):**
   - En Anvil puedes avanzar el tiempo
   - Pero esto es solo para testing

3. **No hay otra forma:**
   - El sistema está diseñado para que el deadline determine cuándo termina la votación
   - Esto es parte de la seguridad del sistema

---

## 🔒 ¿Por Qué es Así?

El sistema está diseñado así por **seguridad**:

1. **No se puede manipular el deadline** - Está en la blockchain
2. **Garantiza tiempo justo** - Todos tienen el mismo tiempo para votar
3. **Previene cambios arbitrarios** - Nadie puede cerrar la votación antes de tiempo
4. **Transparencia** - El deadline está visible para todos

---

**En resumen:** El botón "Active" es solo un indicador visual. El estado cambiará automáticamente cuando pase el deadline. No hay forma de cambiarlo manualmente haciendo clic. 🎯

