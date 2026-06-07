# 🍳 RecipeHub - Sistema de Compartición de Recetas

## 📋 Descripción General

**RecipeHub** es una plataforma web full-stack que permite a los usuarios compartir, descubrir y comentar recetas de cocina. El proyecto está desarrollado con **React** (frontend), **Express + MongoDB** (backend) y desplegado en un **VPS real con Ubuntu 24.04, Docker, Nginx y HTTPS**.

Es un proyecto educativo para el examen de **Programación 4**, que demuestra competencias en:
- ✅ Desarrollo full-stack
- ✅ Despliegue en infraestructura real
- ✅ Configuración de seguridad (SSL/HTTPS)
- ✅ Automatización (CI/CD)
- ✅ Testing automatizado
- ✅ Gestión de bases de datos

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────┐
│                    CLIENTE (Browser)                │
│              React App en app.recetashub-cr.xyz     │
└────────────────────┬────────────────────────────────┘
                     │ HTTPS (Puerto 443)
┌────────────────────▼────────────────────────────────┐
│              NGINX (Reverse Proxy)                  │
│         Balancea tráfico a contenedores             │
├─────────────────────────────────────────────────────┤
│  Certificado SSL: Let's Encrypt (Renovación Auto)   │
│  Dominio: recetashub-cr.xyz + api.recetashub-cr.xyz │
└────────────────────┬────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
    ┌─────────┐           ┌──────────┐
    │ Backend │           │ Frontend │
    │ Express │           │  React   │
    │ :3000   │           │  :5173   │
    └────┬────┘           └──────────┘
         │
         ▼
    ┌─────────────────┐
    │  MongoDB Atlas  │
    │    (Cloud)      │
    └─────────────────┘
```

---

## 🛠️ Tecnologías Utilizadas

### **Backend**
- **Node.js** v20
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT (jsonwebtoken)** - Autenticación
- **bcryptjs** - Hash de contraseñas
- **CORS** - Acceso entre dominios
- **Jest** - Testing

### **Frontend**
- **React** 18+
- **React Router** - Navegación
- **Axios** - Peticiones HTTP
- **TailwindCSS** - Estilos
- **Vite** - Build tool

### **Infraestructura**
- **AWS EC2** - Servidor virtual (Free Tier)
- **Ubuntu 24.04** - Sistema operativo
- **Docker** - Containerización
- **Docker Compose** - Orquestación
- **Nginx** - Servidor web/Reverse Proxy
- **Let's Encrypt** - Certificados SSL
- **GitHub Actions** - CI/CD

---

## 📁 Estructura de Archivos

```
recipehub/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Recipe.js
│   │   │   └── Comment.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── recipes.js
│   │   │   └── comments.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── db/
│   │   │   └── connection.js
│   │   └── server.js
│   ├── tests/
│   │   ├── health.test.js
│   │   ├── auth.test.js
│   │   └── recetas.test.js
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── RecipeCard.jsx
│   │   │   └── CommentSection.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── RecipeDetail.jsx
│   │   │   ├── CreateRecipe.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Profile.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── nginx/
│   ├── nginx.conf
│   └── Dockerfile
├── .github/workflows/
│   └── deploy.yml
├── README.md
└── .gitignore
```

---

## 🚀 Instalación y Configuración

### **1. Requisitos Previos**

```bash
# Backend
- Node.js v20+
- npm o yarn

# Infraestructura
- VPS con Ubuntu 24.04
- Acceso SSH
- Docker + Docker Compose
```

### **2. Clonar el Repositorio**

```bash
git clone https://github.com/cedJoslyn00/recipehub.git
cd recipehub
```

### **3. Configuración del Backend**

```bash
cd backend

# Instalar dependencias
npm install

# Crear archivo .env
cat > .env << EOF
MONGO_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/recetashub
JWT_SECRET=tu_secreto_super_seguro_aqui
NODE_ENV=production
PORT=3000
EOF

# Ejecutar tests
npm test

# Iniciar servidor (desarrollo)
npm run dev
```

### **4. Configuración del Frontend**

```bash
cd frontend

# Instalar dependencias
npm install

# Crear archivo .env
cat > .env << EOF
VITE_API_URL=https://api.recetashub-cr.xyz
EOF

# Build
npm run build

# Desarrollo local
npm run dev
```

### **5. Despliegue en VPS**

```bash
# En el VPS (Ubuntu 24.04)

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Clonar repositorio
git clone https://github.com/cedJoslyn00/recipehub.git
cd recipehub

# Crear archivo .env en raíz
cp .env.example .env
# Editar con tus valores

# Iniciar servicios
docker-compose up -d

# Configurar Nginx
sudo certbot certonly --standalone -d recetashub-cr.xyz -d api.recetashub-cr.xyz -d app.recetashub-cr.xyz
```

---

## 📡 API REST - Endpoints Completos

### **🔐 Autenticación**

#### Registrar Usuario
```http
POST /api/auth/register
Content-Type: application/json

{
  "nombre": "Juan García",
  "email": "juan@example.com",
  "contraseña": "MiContraseña123!"
}
```

**Respuesta (201 Created):**
```json
{
  "message": "Usuario registrado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "_id": "6a250b3a1dd5c4eb031b6603",
    "nombre": "Juan García",
    "email": "juan@example.com"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "contraseña": "MiContraseña123!"
}
```

**Respuesta (200 OK):**
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "_id": "6a250b3a1dd5c4eb031b6603",
    "nombre": "Juan García",
    "email": "juan@example.com"
  }
}
```

**Error (401 Unauthorized):**
```json
{
  "message": "Credenciales inválidas"
}
```

---

### **🍽️ Recetas**

#### Listar todas las Recetas
```http
GET /api/recetas
```

**Respuesta (200 OK):**
```json
{
  "recetas": [
    {
      "_id": "6a250b891dd5c4eb031b6607",
      "titulo": "Gallo Pinto",
      "descripcion": "Platillo típico costarricense",
      "categoria": "Desayuno",
      "tiempoMin": 30,
      "porciones": 4,
      "dificultad": "Fácil",
      "autorId": {
        "_id": "6a250b3a1dd5c4eb031b6603",
        "nombre": "Juan García"
      },
      "ingredientes": [
        {
          "nombre": "Arroz",
          "cantidad": 2,
          "unidad": "tazas"
        },
        {
          "nombre": "Frijoles",
          "cantidad": 1,
          "unidad": "taza"
        }
      ],
      "pasos": [
        "Cocinar el arroz",
        "Calentar los frijoles",
        "Mezclar todo"
      ],
      "tags": ["típico", "costarricense"],
      "imagenUrl": "https://ejemplo.com/gallo-pinto.jpg",
      "createdAt": "2026-06-07T10:30:00.000Z"
    }
  ],
  "total": 1
}
```

#### Obtener Receta por ID
```http
GET /api/recetas/:id
```

**Respuesta (200 OK):**
```json
{
  "receta": {
    "_id": "6a250b891dd5c4eb031b6607",
    "titulo": "Gallo Pinto",
    ... (todos los campos)
  }
}
```

**Error (404 Not Found):**
```json
{
  "message": "Receta no encontrada"
}
```

#### Crear Receta (Requiere Auth)
```http
POST /api/recetas
Authorization: Bearer TU_TOKEN_AQUI
Content-Type: application/json

{
  "titulo": "Gallo Pinto",
  "descripcion": "Platillo típico costarricense",
  "categoria": "Desayuno",
  "tiempoMin": 30,
  "porciones": 4,
  "dificultad": "Fácil",
  "ingredientes": [
    {
      "nombre": "Arroz",
      "cantidad": 2,
      "unidad": "tazas"
    },
    {
      "nombre": "Frijoles",
      "cantidad": 1,
      "unidad": "taza"
    }
  ],
  "pasos": [
    "Cocinar el arroz",
    "Calentar los frijoles",
    "Mezclar todo"
  ],
  "tags": ["típico", "costarricense"],
  "imagenUrl": "https://ejemplo.com/gallo-pinto.jpg"
}
```

**Respuesta (201 Created):**
```json
{
  "message": "Receta creada exitosamente",
  "receta": {
    "_id": "6a250b891dd5c4eb031b6607",
    "titulo": "Gallo Pinto",
    ...
  }
}
```

#### Actualizar Receta (Requiere Auth + Ser Autor)
```http
PUT /api/recetas/:id
Authorization: Bearer TU_TOKEN_AQUI
Content-Type: application/json

{
  "titulo": "Gallo Pinto Típico",
  "tiempoMin": 45
}
```

**Respuesta (200 OK):**
```json
{
  "message": "Receta actualizada exitosamente",
  "receta": { ... }
}
```

**Error (403 Forbidden):** Si no eres el autor:
```json
{
  "message": "No autorizado para editar esta receta"
}
```

#### Eliminar Receta (Requiere Auth + Ser Autor)
```http
DELETE /api/recetas/:id
Authorization: Bearer TU_TOKEN_AQUI
```

**Respuesta (200 OK):**
```json
{
  "message": "Receta eliminada exitosamente"
}
```

---

### **💬 Comentarios**

#### Listar Comentarios de una Receta
```http
GET /api/recetas/:id/comentarios
```

**Respuesta (200 OK):**
```json
{
  "comentarios": [
    {
      "_id": "6a250c1234567890abcdef12",
      "recetaId": "6a250b891dd5c4eb031b6607",
      "usuarioId": {
        "_id": "6a250b3a1dd5c4eb031b6603",
        "nombre": "María González",
        "email": "maria@example.com"
      },
      "texto": "¡Excelente receta! Muy fácil de hacer.",
      "calificacion": 5,
      "createdAt": "2026-06-07T11:00:00.000Z"
    }
  ],
  "total": 1
}
```

#### Agregar Comentario (Requiere Auth)
```http
POST /api/recetas/:id/comentarios
Authorization: Bearer TU_TOKEN_AQUI
Content-Type: application/json

{
  "texto": "¡Excelente receta! Muy fácil de hacer.",
  "calificacion": 5
}
```

**Respuesta (201 Created):**
```json
{
  "message": "Comentario agregado exitosamente",
  "comentario": {
    "_id": "6a250c1234567890abcdef12",
    "recetaId": "6a250b891dd5c4eb031b6607",
    "usuarioId": { ... },
    "texto": "¡Excelente receta! Muy fácil de hacer.",
    "calificacion": 5,
    "createdAt": "2026-06-07T11:00:00.000Z"
  }
}
```

#### Eliminar Comentario (Requiere Auth + Ser Autor)
```http
DELETE /api/comentarios/:id
Authorization: Bearer TU_TOKEN_AQUI
```

**Respuesta (200 OK):**
```json
{
  "message": "Comentario eliminado exitosamente"
}
```

---

## 🧪 Tests Unitarios

### **Ejecutar Tests**

```bash
cd backend
npm test
```

### **Cobertura de Tests**

| Archivo | Tests | Descripción |
|---------|-------|-------------|
| `tests/health.test.js` | 1 | Health check del servidor |
| `tests/auth.test.js` | 3 | Registro, login, email duplicado |
| `tests/recetas.test.js` | 3 | Crear, listar, autorización |

**Total: 7 tests** ✅

### **Ejecutar Tests Localmente**

Los tests usan `mongodb-memory-server` para no necesitar MongoDB real:

```bash
npm test
```

---

## 🚀 Deploy Automático (CI/CD)

### **Pipeline de GitHub Actions**

Cada push a la rama `main` ejecuta automáticamente:

1. ✅ **Checkout** del código
2. ✅ **Setup** Node.js 20
3. ✅ **Install** dependencias
4. ✅ **Test** ejecución de tests unitarios
5. ✅ **Deploy** al VPS vía SSH
6. ✅ **Health Check** verificación final

### **Configuración del Pipeline**

Archivo: `.github/workflows/deploy.yml`

**Secrets requeridos en GitHub:**
- `VPS_HOST`: IP del VPS (ej: `18.223.94.150`)
- `VPS_USER`: Usuario SSH (ej: `ubuntu`)
- `VPS_SSH_KEY`: Llave privada SSH (.pem)

### **Flujo de Trabajo**

```bash
# Desarrollo local
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main

# GitHub Actions automáticamente:
# 1. Ejecuta tests
# 2. Si pasan → Deploy al VPS
# 3. API actualizada en producción
```
---

## 📊 Estado del Proyecto

### **Completado ✅**

- [x] Infraestructura en AWS EC2 (Free Tier)
- [x] Docker + Docker Compose
- [x] Nginx con SSL (Let's Encrypt)
- [x] Backend API completo (Express + MongoDB)
- [x] Autenticación JWT
- [x] CRUD de recetas
- [x] CRUD de comentarios
- [x] Tests unitarios (7 tests)
- [x] CI/CD con GitHub Actions
- [x] Deploy automático al VPS
- [x] MongoDB Atlas (Cloud)
- [x] Dominio personalizado con SSL

---

## 🔗 Enlaces Útiles

- **Repositorio:** https://github.com/cedJoslyn00/recipehub
- **API en Producción:** https://api.recetashub-cr.xyz
- **Frontend:** https://app.recetashub-cr.xyz
- **MongoDB Atlas:** https://cloud.mongodb.com/
- **AWS Console:** https://console.aws.amazon.com/