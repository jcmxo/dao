# 📤 Comandos para Subir a GitHub

## ✅ Estado Actual

- ✅ Git inicializado
- ✅ 70 archivos agregados
- ✅ Commit realizado
- ✅ README.md creado

## 📋 Pasos para Subir a GitHub

### 1. Crear Repositorio en GitHub

1. Ve a: https://github.com/new
2. **Nombre del repositorio:** `dao-voting` (o el nombre que prefieras)
3. **Descripción (opcional):** "DAO Voting - Gasless Governance Application"
4. **Visibilidad:** Público o Privado (tu elección)
5. **NO marques:**
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license
6. Haz clic en **"Create repository"**

### 2. Copiar la URL del Repositorio

Después de crear el repositorio, GitHub te mostrará una URL. Copia la URL HTTPS:

**Ejemplo:**
```
https://github.com/tu-usuario/dao-voting.git
```

### 3. Conectar el Repositorio Local con GitHub

```bash
cd /mnt/c/Users/jcmxo/dao
git remote add origin https://github.com/tu-usuario/dao-voting.git
```

**Reemplaza `tu-usuario/dao-voting`** con tu usuario y nombre de repositorio reales.

### 4. Verificar la Conexión

```bash
git remote -v
```

Deberías ver:
```
origin  https://github.com/tu-usuario/dao-voting.git (fetch)
origin  https://github.com/tu-usuario/dao-voting.git (push)
```

### 5. Subir los Archivos

```bash
git push -u origin main
```

**Nota:** La rama es `main`, no `master`.

### 6. Verificar en GitHub

Ve a tu repositorio en GitHub y verifica que todos los archivos estén allí.

---

## 🔄 Comandos Rápidos

```bash
# Ver estado
git status

# Ver remotos configurados
git remote -v

# Ver commits
git log --oneline

# Subir cambios (después del primer push)
git push
```

---

## 🆘 Solución de Problemas

### Si el repositorio ya tiene un README

Si accidentalmente creaste el repositorio con un README:

```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Si necesitas cambiar la URL del remoto

```bash
git remote set-url origin https://github.com/tu-usuario/nuevo-nombre.git
```

### Si necesitas autenticarte

GitHub puede pedirte autenticación. Opciones:

1. **Personal Access Token (recomendado):**
   - Ve a: https://github.com/settings/tokens
   - Crea un nuevo token con permisos `repo`
   - Úsalo como contraseña cuando te lo pida

2. **SSH (más seguro):**
   - Configura SSH keys en GitHub
   - Usa la URL SSH: `git@github.com:tu-usuario/dao-voting.git`

---

## 📝 Resumen de Comandos

```bash
# 1. Crear repositorio en GitHub (hacerlo en el navegador)

# 2. Conectar repositorio local
git remote add origin https://github.com/tu-usuario/dao-voting.git

# 3. Subir archivos
git push -u origin main
```

---

**¡Eso es todo! Tus archivos estarán en GitHub.** 🚀

