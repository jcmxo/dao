# 💡 ¿Cómo Sé Si Una Propuesta Es Gasless?

## ✅ Respuesta Rápida

**Busca el badge visual en la tarjeta de propuesta:**

- 🟢 **Badge Verde "✓ Gasless"** = Fue creada **sin gas** (gasless)
- 🔵 **Badge Azul "💰 Paid Gas"** = Pagaste **gas** al crearla
- ⚪ **Sin badge** = Propuesta antigua (antes de este cambio)

---

## 📍 Dónde Ver el Indicador

El badge aparece **al lado del número de propuesta**, en la parte superior de la tarjeta:

```
┌─────────────────────────────────────────┐
│ Proposal #5  [✓ Gasless]    [ACTIVE]   │
│                                         │
│ Descripción: SOAT                       │
│ ...                                     │
└─────────────────────────────────────────┘
```

---

## 🔍 Explicación Detallada

### 1. Badge Verde "✓ Gasless"

Aparece cuando:
- ✅ Creaste la propuesta con el checkbox **"Use gasless transaction"** marcado
- ✅ **NO pagaste gas** al crear la propuesta
- ✅ El relayer pagó el gas por ti

**Significado:**
- Propuesta creada de forma gratuita (sin costo para ti)
- Usó meta-transacciones (EIP-712)

---

### 2. Badge Azul "💰 Paid Gas"

Aparece cuando:
- ❌ Creaste la propuesta con el checkbox **"Use gasless transaction"** desmarcado
- ❌ **Pagaste gas** de tu propia cuenta
- ❌ Usaste una transacción normal (no meta-transacción)

**Significado:**
- Propuesta creada pagando gas de tu wallet
- Costó ETH crear esta propuesta

---

### 3. Sin Badge

Aparece cuando:
- ⚪ La propuesta fue creada antes de implementar este indicador
- ⚪ No hay información guardada sobre si fue gasless o no

**Significado:**
- Propuesta antigua
- No sabemos si fue creada con gasless o no

---

## 🎯 Información Adicional

### Sobre las Votaciones

**IMPORTANTE:** Las votaciones **SIEMPRE son gasless**, independientemente de cómo se creó la propuesta.

Verás en la parte superior de la lista de propuestas:
```
☑️ Gasless voting (siempre marcado y deshabilitado)
```

Esto significa:
- ✅ **Todas las votaciones** son gasless
- ✅ **No pagas gas** al votar
- ✅ Solo firmas la transacción

---

## 💾 Cómo Se Guarda Esta Información

La información se guarda en `localStorage` del navegador:

```javascript
{
  "proposalData": {
    "5": {
      "description": "SOAT",
      "isGasless": true  // o false
    }
  }
}
```

---

## 🔄 Migración de Datos Antiguos

Si tienes propuestas antiguas que solo tienen descripción (sin información de gasless), el sistema:

1. ✅ **Carga la descripción** de formato antiguo si existe
2. ✅ **Muestra sin badge** (no sabemos si fue gasless)
3. ✅ **Funciona normalmente** para votar y ejecutar

Las **nuevas propuestas** siempre guardarán esta información.

---

## 📊 Resumen Visual

| Indicador | Significado | Costo al Crear |
|-----------|-------------|----------------|
| 🟢 **✓ Gasless** | Creada sin gas | **$0 USD** (GRATIS) |
| 🔵 **💰 Paid Gas** | Pagaste gas | ~$2-5 USD |
| ⚪ **Sin badge** | Propuesta antigua | Desconocido |

---

## ✅ Ventajas del Indicador

### Para los Usuarios:

1. **Transparencia** - Sabes exactamente cómo fue creada la propuesta
2. **Claridad** - Visual inmediato sin necesidad de buscar
3. **Confianza** - Puedes ver si otras propuestas también usaron gasless

### Para el DAO:

1. **Trazabilidad** - Historial de cómo se crearon las propuestas
2. **Estadísticas** - Puedes ver cuántas propuestas fueron gasless
3. **Transparencia** - Información visible para todos

---

## 🎓 Conceptos Clave

### ¿Qué es una propuesta gasless?

Una propuesta creada usando **meta-transacciones**:
- Usuario firma la transacción (EIP-712)
- Relayer paga el gas
- Usuario no paga nada

### ¿Qué es una propuesta con gas pagado?

Una propuesta creada usando una **transacción normal**:
- Usuario paga el gas de su wallet
- Transacción directa a la blockchain
- Usuario paga ETH

---

## 📝 Notas Finales

1. **El badge solo indica cómo se CREÓ la propuesta**, no cómo se vota
2. **Todas las votaciones son gasless** (siempre)
3. **Las propuestas antiguas no tienen badge** (normal)
4. **Las nuevas propuestas siempre mostrarán el badge**

---

**En resumen:** Busca el badge al lado del número de propuesta para saber si fue creada con gasless o pagando gas. 🎯

