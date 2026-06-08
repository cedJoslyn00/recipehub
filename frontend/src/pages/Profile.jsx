import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'

function Profile() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const [recetas, setRecetas] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const fetchRecetas = async () => {
      try {
        const res = await API.get('/api/recetas')
        const misRecetas = res.data.recetas.filter(
          (r) => r.autorId._id === usuario.id
        )
        setRecetas(misRecetas)
      } catch {
        console.error('Error cargando recetas')
      } finally {
        setCargando(false)
      }
    }

    fetchRecetas()
  }, [usuario])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que querés eliminar esta receta?')) return
    try {
      await API.delete(`/api/recetas/${id}`)
      setRecetas(recetas.filter((r) => r._id !== id))
    } catch {
      alert('Error al eliminar la receta')
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>

      {/* Datos del usuario */}
      <div style={{ backgroundColor: '#fff8f0', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {usuario?.avatarUrl ? (
            <img src={usuario.avatarUrl} alt={usuario.nombre}
              style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#e65c00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'white' }}>
              {usuario?.nombre?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h2 style={{ margin: 0, color: '#333' }}>{usuario?.nombre}</h2>
            <p style={{ margin: '0.2rem 0', color: '#666' }}>{usuario?.email}</p>
            {usuario?.bio && <p style={{ margin: '0.2rem 0', color: '#888', fontSize: '0.9rem' }}>{usuario.bio}</p>}
          </div>
        </div>
        <button onClick={handleLogout} style={{
          backgroundColor: '#cc0000', color: 'white', border: 'none',
          padding: '0.5rem 1.2rem', borderRadius: '4px', cursor: 'pointer'
        }}>
          Cerrar sesión
        </button>
      </div>

      {/* Recetas del usuario */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ color: '#e65c00', margin: 0 }}>Mis Recetas ({recetas.length})</h2>
        <Link to="/nueva" style={{
          backgroundColor: '#e65c00', color: 'white', padding: '0.5rem 1rem',
          borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold'
        }}>
          + Nueva Receta
        </Link>
      </div>

      {cargando ? (
        <p>Cargando recetas...</p>
      ) : recetas.length === 0 ? (
        <p style={{ color: '#888' }}>Todavía no publicaste ninguna receta.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {recetas.map((receta) => (
            <div key={receta._id} style={{
              border: '1px solid #ddd', borderRadius: '8px', padding: '1rem',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              backgroundColor: 'white', flexWrap: 'wrap', gap: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {receta.imagenUrl ? (
                  <img src={receta.imagenUrl} alt={receta.titulo}
                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                ) : (
                  <div style={{ width: '60px', height: '60px', backgroundColor: '#f5e6d3', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    🍽️
                  </div>
                )}
                <div>
                  <h3 style={{ margin: 0, color: '#333' }}>{receta.titulo}</h3>
                  <p style={{ margin: '0.2rem 0', color: '#888', fontSize: '0.85rem' }}>
                    {receta.categoria} · {receta.dificultad} · {receta.tiempoMin} min
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to={`/recetas/${receta._id}`} style={{
                  backgroundColor: '#f5e6d3', color: '#e65c00', padding: '0.4rem 0.8rem',
                  borderRadius: '4px', textDecoration: 'none', fontSize: '0.9rem'
                }}>
                  Ver
                </Link>
                <Link to={`/editar/${receta._id}`} style={{
                  backgroundColor: '#f0a500', color: 'white', padding: '0.4rem 0.8rem',
                  borderRadius: '4px', textDecoration: 'none', fontSize: '0.9rem'
                }}>
                  Editar
                </Link>
                <button onClick={() => handleEliminar(receta._id)} style={{
                  backgroundColor: '#cc0000', color: 'white', border: 'none',
                  padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem'
                }}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Profile