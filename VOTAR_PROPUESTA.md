# 🗳️ Guía: Votar en Propuestas

## ✅ Estado Actual

- ✅ **Propuesta #1 creada y activa**
- ✅ **Recipient:** 0x7099...79C8
- ✅ **Amount:** 5.0 ETH
- ✅ **Deadline:** 30/11/2025, 12:00:00 p. m.
- ✅ **Votos actuales:** 0 For, 0 Against, 0 Abstain

---

## 🎯 Cómo Votar

### Paso 1: Encuentra los Botones de Votación

En la propuesta #1, verás tres botones:
- ✅ **"FOR"** (A favor) - Botón verde
- ❌ **"AGAINST"** (En contra) - Botón rojo
- ⚪ **"ABSTAIN"** (Abstenerse) - Botón gris

### Paso 2: Elige tu Voto

**Recomendación:** Haz clic en **"FOR"** para aprobar la propuesta.

**Opciones:**
- **FOR:** Votas a favor de enviar 5 ETH al destinatario
- **AGAINST:** Votas en contra de la propuesta
- **ABSTAIN:** Te abstienes (no cuentas ni a favor ni en contra)

### Paso 3: Confirma en MetaMask

1. **MetaMask mostrará una solicitud de firma:**
   - No es una transacción normal
   - Es una **meta-transacción** (gasless)
   - Solo necesitas firmar, no pagar gas

2. **Revisa los detalles:**
   - Tipo: "Sign Message" o "Sign Typed Data"
   - Propósito: Votar en la propuesta #1

3. **Haz clic en "Firmar" o "Sign"**
   - El relayer pagará el gas por ti
   - La votación se procesará casi instantáneamente

---

## ✅ Después de Votar

### Lo que Verás:

1. **Los votos se actualizarán:**
   - Si votaste FOR: "1 For" aparecerá
   - Si votaste AGAINST: "1 Against" aparecerá
   - Si votaste ABSTAIN: "1 Abstain" aparecerá

2. **Tu voto quedará registrado:**
   - No podrás cambiar tu voto
   - Solo puedes votar una vez por propuesta

3. **La propuesta seguirá activa:**
   - Hasta el deadline: 30/11/2025, 12:00:00 p. m.
   - Después del deadline, no se podrán agregar más votos

---

## ⏰ Ejecutar la Propuesta

### Requisitos para Ejecutar:

1. ✅ **Deadline ha pasado:** 30/11/2025, 12:00:00 p. m.
2. ✅ **Período de seguridad:** 24 horas después del deadline
3. ✅ **Más votos FOR que AGAINST**
4. ✅ **Propuesta no ejecutada previamente**

### Cuándo se Puede Ejecutar:

- **Deadline:** 30/11/2025, 12:00:00 p. m.
- **Período de seguridad:** 24 horas
- **Fecha de ejecución:** 01/12/2025, 12:00:00 p. m. (o después)

### Cómo Ejecutar:

1. Después del deadline + 24 horas
2. Si tiene más votos FOR que AGAINST
3. Aparecerá el botón **"Execute"** en la propuesta
4. Haz clic en "Execute"
5. Confirma en MetaMask
6. Los 5 ETH se enviarán al destinatario

---

## 💡 Características de la Votación Gasless

### ✅ Ventajas:

- 🎉 **Sin gas para ti** - El relayer paga el gas
- ⚡ **Rápida** - Se procesa casi instantáneamente
- 🔒 **Segura** - Usa meta-transacciones (EIP-2771)
- 📊 **Transparente** - Todos los votos son públicos

### 🔍 Cómo Funciona:

1. **Firmas la meta-transacción** (sin gas)
2. **El relayer recibe tu firma**
3. **El relayer ejecuta la transacción** (paga el gas)
4. **Tu voto se registra en el contrato**

---

## 📊 Ejemplo de Flujo Completo

### Escenario: Votar FOR

1. **Haces clic en "FOR"** → MetaMask pide firma
2. **Firmas** → El relayer procesa la transacción
3. **Votos actualizados:** "1 For, 0 Against, 0 Abstain"
4. **Esperas hasta:** 01/12/2025, 12:00:00 p. m.
5. **Ejecutas la propuesta** → 5 ETH se envían al destinatario

---

## ⚠️ Notas Importantes

### Sobre los Votos:

- ✅ Solo puedes votar **una vez** por propuesta
- ✅ No puedes cambiar tu voto después
- ✅ Tu voto es **permanente** en la blockchain

### Sobre la Ejecución:

- ⏰ Debe pasar el **deadline**
- ⏰ Debe pasar el **período de seguridad** (24 horas)
- ✅ Debe tener más votos **FOR** que **AGAINST**
- ❌ Si tiene más votos AGAINST, no se puede ejecutar

### Sobre el Gas:

- 🎉 **No pagas gas** al votar
- 💰 El relayer paga el gas por ti
- ⚡ Es casi instantáneo en la red local

---

## 🔧 Solución de Problemas

### Problema: No puedo votar
- Verifica que estás conectado con tu wallet
- Verifica que no has votado ya en esta propuesta
- Revisa la consola del navegador (F12) por errores

### Problema: MetaMask no muestra la solicitud de firma
- Verifica que MetaMask está desbloqueado
- Verifica que estás en la red correcta (Anvil Local)
- Intenta recargar la página

### Problema: El voto no se registra
- Espera unos segundos (puede tardar un momento)
- Verifica que firmaste correctamente en MetaMask
- Revisa que el relayer está funcionando

---

**¡Vota en tu propuesta y experimenta la votación gasless! 🗳️**

