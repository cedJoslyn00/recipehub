import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav style={{
      backgroundColor: '#e65c00',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
        🍳 RecipeHub
      </Link>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {usuario ? (
          <>
            <Link to="/nueva" style={{ color: 'white', textDecoration: 'none' }}>
              + Nueva Receta
            </Link>
            <Link to="/perfil" style={{ color: 'white', textDecoration: 'none' }}>
              {usuario.nombre}
            </Link>
            <button onClick={handleLogout} style={{
              backgroundColor: 'white',
              color: '#e65c00',
              border: 'none',
              padding: '0.4rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              Salir
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
              Iniciar sesión
            </Link>
            <Link to="/register" style={{ textDecoration: 'none',
              backgroundColor: 'white', color: '#e65c00', padding: '0.4rem 1rem',
              borderRadius: '4px', fontWeight: 'bold'
            }}>
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar