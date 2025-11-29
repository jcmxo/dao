# 📝 Guía: Cómo Crear una Propuesta

## 📍 Ubicación

El panel **"Create Proposal"** está en el **lado derecho** de la pantalla, debajo del título "Create Proposal".

---

## 📋 Pasos Detallados

### Paso 1: Recipient Address (Dirección Destinataria)

**¿Qué es?** La dirección Ethereum que recibirá los fondos si la propuesta es aprobada.

**Ejemplo:**
```
0x70997970C51812dc3A010C7d01b50e0d17dc79C8
```

**Nota:** Esta es la cuenta #1 de Anvil, perfecta para pruebas. Puedes usar cualquier dirección válida de Ethereum.

---

### Paso 2: Amount (ETH) (Cantidad)

**¿Qué es?** La cantidad de ETH que se enviará al destinatario si la propuesta es aprobada.

**Ejemplo:**
```
12
```

**Restricciones:**
- Debe ser mayor a 0
- No puede ser mayor al balance total del DAO
- Se enviará en ETH (no necesitas escribir "ETH", solo el número)

---

### Paso 3: Voting Duration (days) (Duración de Votación)

**¿Qué es?** Cuántos días durará el período de votación.

**Ejemplo:**
```
7
```

**Cómo funciona:**
- Ingresas el número de días (ej: 7 para una semana)
- El sistema calcula automáticamente: `deadline = ahora + 7 días`
- Después del deadline, no se podrán agregar más votos

**Opciones comunes:**
- `3` = 3 días (para propuestas urgentes)
- `7` = 1 semana (recomendado)
- `30` = 1 mes (para propuestas importantes)

---

### Paso 4: Description (Descripción)

**¿Qué es?** Una descripción clara de qué es la propuesta.

**Ejemplo:**
```
HACER MARKETING
```

**O ejemplos más descriptivos:**
```
MODIFICACION DE LA BASE DE DATOS
Actualizar sistema de almacenamiento
Contratar nuevo desarrollador
Comprar nuevo servidor
```

**Recomendaciones:**
- Sé claro y conciso
- Describe qué quieres lograr
- La descripción será visible en la propuesta

---

### Paso 5: Create Proposal (Gasless)

**Acción:**
1. Revisa que todos los campos estén completos
2. Verifica que el checkbox **"Use gasless transaction"** esté marcado (siempre está marcado)
3. Haz clic en el botón verde **"Create Proposal (Gasless)"**
4. MetaMask se abrirá para confirmar la transacción
5. Confirma en MetaMask
6. ¡Tu propuesta será creada!

---

## ✅ Ejemplo Completo

### Propuesta de Ejemplo:

**Recipient Address:**
```
0x70997970C51812dc3A010C7d01b50e0d17dc79C8
```

**Amount:**
```
12
```

**Voting Duration:**
```
7
```

**Description:**
```
HACER MARKETING
```

**Resultado:**
- Propuesta creada para enviar 12 ETH a la dirección especificada
- Votación abierta por 7 días
- Descripción visible en la propuesta

---

## 🔍 Después de Crear la Propuesta

Una vez creada, verás:

1. **La propuesta aparece** en la sección inferior
2. **Description visible** en la propuesta
3. **Blockchain Time** mostrando el tiempo actual
4. **Deadline** calculado automáticamente (ahora + 7 días)
5. **Botones para votar** (For, Against, Abstain)

---

## ⚠️ Requisitos

Para crear una propuesta necesitas:

- ✅ Tener al menos **10% del balance total** del DAO
- ✅ Estar **conectado con MetaMask**
- ✅ Completar **todos los campos**

**En tu caso:**
- ✅ Tienes 110.0010 ETH (100% del total) ✓
- ✅ Estás conectado ✓
- ✅ Solo necesitas completar los campos ✓

---

## 💡 Tips

1. **Usa direcciones de Anvil para pruebas:**
   - Cuenta 0: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
   - Cuenta 1: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
   - Cuenta 2: `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`

2. **Duración recomendada:**
   - Propuestas pequeñas: 3-7 días
   - Propuestas importantes: 7-14 días
   - Propuestas críticas: 14-30 días

3. **Descripción clara:**
   - Describe el propósito
   - Explica por qué es necesario
   - Sé específico sobre el destinatario

---

## 🎯 Resumen Rápido

```
1. Recipient Address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
2. Amount: 12
3. Voting Duration: 7
4. Description: HACER MARKETING
5. Click: "Create Proposal (Gasless)"
6. Confirmar en MetaMask
```

---

**¡Eso es todo! Ya puedes crear tus propuestas.** 🚀

