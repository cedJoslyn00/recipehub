# RecipeHub — Frontend

Frontend de RecipeHub, desarrollado con React + Vite. Consume la API REST del backend para gestionar recetas, usuarios y comentarios.

## Tecnologías

- React 18
- Vite
- React Router DOM
- Axios

## Requisitos

- Node.js 18 o superior
- npm

## Instalación y uso local

1. Clonar el repositorio:
   git clone 
   cd recipehub/frontend

2. Instalar dependencias:
   npm install

3. Crear el archivo de variables de entorno:
   .env ejem. VITE_API_URL=http://localhost:4000

4. Editar el .env con la URL de la API

5. Correr en modo desarrollo:
   npm run dev

6. Abrir en el navegador: http://localhost:5173

## Variables de entorno

| Variable        | Descripción                          | Ejemplo                              |
|-----------------|--------------------------------------|--------------------------------------|
| VITE_API_URL    | URL base de la API REST del backend  | http://localhost:4000                |

Para producción cambiar a:
VITE_API_URL=https://api.recetashub-cr.xyz

## Build para producción

npm run build

Genera la carpeta dist/ con los archivos estáticos listos para ser servidos por Nginx.

## Estructura del proyecto

src/
├── api/
│   └── axios.js          # Instancia de Axios con interceptor de token
├── components/
│   └── Navbar.jsx        # Barra de navegación principal
├── context/
│   └── AuthContext.jsx   # Contexto global de autenticación
├── pages/
│   ├── Home.jsx          # Listado de recetas con buscador y filtros
│   ├── RecipeDetail.jsx  # Detalle de receta con comentarios
│   ├── CreateRecipe.jsx  # Formulario para crear receta
│   ├── EditRecipe.jsx    # Formulario para editar receta
│   ├── Profile.jsx       # Perfil del usuario y sus recetas
│   ├── Login.jsx         # Formulario de inicio de sesión
│   └── Register.jsx      # Formulario de registro
└── App.jsx               # Rutas y configuración principal

## Vistas disponibles

| Ruta          | Vista              | Autenticación requerida |
|---------------|--------------------|-------------------------|
| /             | Inicio             | No                      |
| /recetas/:id  | Detalle de receta  | No                      |
| /nueva        | Crear receta       | Sí                      |
| /editar/:id   | Editar receta      | Sí                      |
| /perfil       | Mi perfil          | Sí                      |
| /login        | Iniciar sesión     | No                      |
| /register     | Registrarse        | No                      |