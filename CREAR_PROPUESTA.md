# 📝 Guía: Crear tu Primera Propuesta

## ✅ Estado Actual

- ✅ **Your Balance:** 10.001 ETH
- ✅ **Total DAO Balance:** 10.001 ETH
- ✅ **Panel "Create Proposal" habilitado**
- ✅ **Listo para crear propuestas**

---

## 🎯 Pasos para Crear una Propuesta

### 1. Abre el Panel "Create Proposal"

El panel está en el lado derecho de la aplicación, debajo del título "Create Proposal".

### 2. Completa los Campos

#### **Recipient Address** (Dirección Destinataria)
```
0x70997970C51812dc3A010C7d01b50e0d17dc79C8
```

**Nota:** Esta es la cuenta #1 de Anvil, perfecta para pruebas. Puedes usar cualquier dirección válida.

#### **Amount (ETH)** (Cantidad)
```
5
```

**Nota:** 
- Puedes usar cualquier cantidad menor a tu balance (10.001 ETH)
- Ejemplos: 1, 3, 5, 7.5 ETH
- Esta será la cantidad que se enviará si la propuesta se ejecuta

#### **Deadline** (Fecha Límite)
- Haz clic en el campo de fecha
- Selecciona una fecha futura
- Ejemplos:
  - Mañana
  - En una semana
  - En un mes

**Nota:** El deadline es la fecha límite para votar. Después del deadline + 24 horas (período de seguridad), se puede ejecutar si tiene más votos a favor.

### 3. Crea la Propuesta

1. Haz clic en el botón **"Create Proposal"** (verde)
2. MetaMask mostrará una solicitud de transacción
3. Revisa los detalles:
   - Función: `createProposal`
   - Parámetros: recipient, amount, deadline
4. Haz clic en **"Confirmar"** en MetaMask
5. Espera a que se procese (instantáneo en red local)

---

## ✅ Después de Crear la Propuesta

### Lo que Verás:

1. **La propuesta aparecerá** en la sección inferior de la aplicación
2. **Información mostrada:**
   - ID de la propuesta
   - Dirección destinataria
   - Cantidad a enviar
   - Deadline
   - Estado de votación (FOR, AGAINST, ABSTAIN)
   - Botones para votar

### Próximos Pasos:

1. **Votar en la propuesta:**
   - Haz clic en **"FOR"** (A favor)
   - Haz clic en **"AGAINST"** (En contra)
   - Haz clic en **"ABSTAIN"** (Abstenerse)
   - La votación es **GASLESS** (sin gas para ti)

2. **Esperar el deadline:**
   - La propuesta debe pasar su fecha límite
   - Debe tener más votos FOR que AGAINST

3. **Esperar el período de seguridad:**
   - 24 horas después del deadline

4. **Ejecutar la propuesta:**
   - Si cumple las condiciones, aparecerá el botón **"Execute"**
   - Haz clic en "Execute"
   - Confirma en MetaMask
   - Los fondos se enviarán al destinatario

---

## 💡 Ejemplo Completo

### Propuesta de Ejemplo:

```
Recipient Address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Amount: 5 ETH
Deadline: 30/11/2025, 23:59
```

### Flujo:

1. **Crear propuesta** → Confirma en MetaMask
2. **Votar FOR** → Votación gasless
3. **Esperar hasta:** 01/12/2025, 23:59 (deadline + 24 horas)
4. **Ejecutar propuesta** → 5 ETH se envían al destinatario

---

## ⚠️ Notas Importantes

### Requisitos para Crear Propuestas:
- ✅ Tienes ≥10% del balance total (10.001 ETH de 10.001 ETH = 100% ✅)

### Requisitos para Ejecutar Propuestas:
- ✅ Deadline ha pasado
- ✅ Han pasado 24 horas después del deadline
- ✅ Más votos FOR que AGAINST
- ✅ Propuesta no ejecutada previamente

### Sobre la Votación Gasless:
- 🎉 **No pagas gas** - El relayer paga por ti
- ⚡ **Rápida** - Se procesa casi instantáneamente
- 🔒 **Segura** - Usa meta-transacciones (EIP-2771)

---

## 🔧 Solución de Problemas

### Problema: No puedo crear la propuesta
- Verifica que tienes ≥10% del balance total
- Verifica que la dirección del destinatario es válida
- Verifica que el deadline es una fecha futura

### Problema: La transacción falla
- Verifica que Anvil está corriendo
- Verifica que tienes suficiente ETH para el gas
- Revisa la consola del navegador (F12) por errores

### Problema: La propuesta no aparece
- Espera unos segundos (se actualiza cada 10 segundos)
- Recarga la página si es necesario
- Verifica que la transacción se confirmó en MetaMask

---

**¡Crea tu primera propuesta y comienza a gobernar tu DAO! 🚀**

