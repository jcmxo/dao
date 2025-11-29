# 🎯 Guía de Uso - DAO Voting

## 📊 Estado Actual

✅ **Aplicación funcionando** en `http://localhost:3000`  
✅ **Wallet conectado:** `0xf39F...2266`  
✅ **Balance actual:** 0.001 ETH  
✅ **Interfaz completa y operativa**

---

## 🚀 Próximos Pasos

### 1️⃣ Fondear el DAO

Para crear propuestas, necesitas tener al menos **10% del balance total** del DAO.

**Pasos:**
1. En el panel **"Fund DAO"** (lado izquierdo)
2. Ingresa una cantidad, por ejemplo: **10 ETH**
3. Haz clic en el botón **"Fund DAO"** (azul)
4. Confirma la transacción en MetaMask
5. Espera a que se actualicen los balances

**Nota:** Con 0.001 ETH actual, necesitas fondear al menos 10 ETH más para poder crear propuestas.

---

### 2️⃣ Crear una Propuesta

Una vez que tengas suficiente balance (≥10% del total), el formulario de crear propuesta estará habilitado.

**Pasos:**
1. Completa el panel **"Create Proposal"** (lado derecho):
   - **Recipient Address:** Dirección que recibirá los fondos
     - Ejemplo: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` (Cuenta 1 de Anvil)
   - **Amount:** Cantidad de ETH a enviar
     - Ejemplo: `5 ETH`
   - **Deadline:** Fecha límite para votar
     - Selecciona una fecha futura (ej: mañana o en una semana)
2. Haz clic en el botón **"Create Proposal"** (verde)
3. Confirma la transacción en MetaMask
4. ¡Tu propuesta será creada!

---

### 3️⃣ Votar en Propuestas

Después de crear una propuesta, podrás votar usando meta-transacciones (gasless).

**Opciones de voto:**
- ✅ **FOR** (A favor)
- ❌ **AGAINST** (En contra)
- ⚪ **ABSTAIN** (Abstenerse)

**Características:**
- 🎉 **Gasless:** No pagas gas, el relayer lo paga por ti
- 🔄 Se actualiza en tiempo real
- 📊 Puedes ver los resultados de votación

---

### 4️⃣ Ejecutar Propuestas

Una vez que una propuesta:
- ✅ Tiene más votos **FOR** que **AGAINST**
- ✅ Ha pasado el **deadline**
- ✅ Han pasado **24 horas** después del deadline (período de seguridad)

**Entonces podrás ejecutarla:**
1. La propuesta mostrará un botón **"Execute"**
2. Haz clic en ejecutar
3. Confirma en MetaMask
4. Los fondos se enviarán al destinatario

---

## 💡 Información Útil

### 📝 Cuentas de Anvil para Pruebas

Anvil viene con 10 cuentas preconfiguradas, cada una con 10,000 ETH:

```
Cuenta 0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (tu wallet actual)
Cuenta 1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Cuenta 2: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
Cuenta 3: 0x90F79bf6EB2c4f870365E785982E1f101E93b906
...
```

**Uso sugerido:**
- Usa la **Cuenta 0** como tu wallet principal
- Usa la **Cuenta 1** como destinatario para propuestas

### 🔧 Probar el Botón Disconnect

Si quieres probar la corrección del botón "Disconnect":

1. **Reinicia el frontend:**
   ```bash
   cd /mnt/c/Users/jcmxo/dao/web
   npm run dev
   ```

2. **Recarga la página:**
   - Presiona `Ctrl + Shift + R` (Hard Refresh)

3. **Prueba el botón:**
   - Haz clic en "Disconnect"
   - Debería desconectar sin reconectar automáticamente

---

## 🎮 Flujo Completo de Ejemplo

### Ejemplo: Crear y Ejecutar una Propuesta

1. **Fondear el DAO:**
   - Ingresa: `10 ETH`
   - Confirma en MetaMask
   - Balance total: 10.001 ETH

2. **Crear Propuesta:**
   - Recipient: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
   - Amount: `5 ETH`
   - Deadline: `30/11/2025, 23:59`
   - Confirma en MetaMask

3. **Votar:**
   - Haz clic en **"FOR"** en tu propuesta
   - Confirma (gasless - no pagas gas)

4. **Esperar:**
   - Espera a que pase el deadline
   - Espera 24 horas adicionales (período de seguridad)

5. **Ejecutar:**
   - Haz clic en **"Execute"**
   - Confirma en MetaMask
   - ¡Los 5 ETH se enviarán al destinatario!

---

## ❓ Solución de Problemas

### Problema: No puedo crear propuesta

**Solución:** Asegúrate de tener al menos 10% del balance total. Si el balance total es 10 ETH, necesitas tener al menos 1 ETH en tu balance personal.

### Problema: El botón Disconnect no funciona

**Solución:** Reinicia el frontend y haz un Hard Refresh (`Ctrl + Shift + R`).

### Problema: Los balances no se actualizan

**Solución:** 
- Verifica que Anvil está corriendo
- Verifica que los contratos están desplegados
- Recarga la página

### Problema: MetaMask muestra errores de RPC

**Solución:**
- Verifica que Anvil está corriendo en `http://127.0.0.1:8545`
- Verifica que MetaMask está configurado para usar la red Localhost 8545
- Chain ID debe ser: `31337`

---

## 📚 Recursos

- **Anvil:** Nodo blockchain local
- **Contratos desplegados en:**
  - DAO: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
  - Forwarder: `0x5FbDB2315678afecb367f032d93F642f64180aa3`

---

**¡Disfruta usando tu DAO! 🎉**

