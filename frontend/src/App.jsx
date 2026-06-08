import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import RecipeDetail from './pages/RecipeDetail'
import CreateRecipe from './pages/CreateRecipe'
import EditRecipe from './pages/EditRecipe'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'

// Ruta protegida — si no está logueado redirige al login
function RutaProtegida({ children }) {
  const { usuario, cargando } = useAuth()
  if (cargando) return <div>Cargando...</div>
  return usuario ? children : <Navigate to="/login" />
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recetas/:id" element={<RecipeDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/nueva" element={
          <RutaProtegida><CreateRecipe /></RutaProtegida>
        } />
        <Route path="/editar/:id" element={
          <RutaProtegida><EditRecipe /></RutaProtegida>
        } />
        <Route path="/perfil" element={
          <RutaProtegida><Profile /></RutaProtegida>
        } />
      </Routes>
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App