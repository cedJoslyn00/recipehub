import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'

function RecipeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { usuario } = useAuth()

  const [receta, setReceta] = useState(null)
  const [comentarios, setComentarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [texto, setTexto] = useState('')
  const [calificacion, setCalificacion] = useState(5)
  const [enviando, setEnviando] = useState(false)


const cargarComentarios = async () => {
  try {
    const res = await API.get(`/api/comentarios/recetas/${id}/comentarios`)
    setComentarios(res.data.comentarios)
  } catch (error) {
    console.error('Error cargando comentarios:', error)
  }
}

useEffect(() => {
  const fetchData = async () => {
    try {
      setCargando(true)
      const recetaRes = await API.get(`/api/recetas/${id}`)
      setReceta(recetaRes.data.receta)
    } catch {
      console.error('Error cargando receta')
    } finally {
      setCargando(false)
    }

    try {
      const comentariosRes = await API.get(`/api/comentarios/recetas/${id}/comentarios`)
      setComentarios(comentariosRes.data.comentarios)
    } catch {
      console.error('Error cargando comentarios')
    }
  }

  fetchData()
}, [id])

  const handleEliminar = async () => {
    if (!window.confirm('¿Seguro que querés eliminar esta receta?')) return
    try {
      await API.delete(`/api/recetas/${id}`)
      navigate('/')
    } catch {
      alert('Error al eliminar la receta')
    }
  }

  const handleComentario = async (e) => {
    e.preventDefault()
    if (!texto.trim()) return
    try {
      setEnviando(true)
      await API.post(`/api/comentarios/recetas/${id}/comentarios`, { texto, calificacion })
      setTexto('')
      setCalificacion(5)
      cargarComentarios()
    } catch {
      alert('Error al enviar comentario')
    } finally {
      setEnviando(false)
    }
  }

  const handleEliminarComentario = async (comentarioId) => {
    if (!window.confirm('¿Eliminar este comentario?')) return
    try {
      await API.delete(`/api/comentarios/${comentarioId}`)
      cargarComentarios()
    } catch {
      alert('Error al eliminar comentario')
    }
  }

  if (cargando) return <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando...</p>
  if (!receta) return <p style={{ textAlign: 'center', padding: '2rem' }}>Receta no encontrada.</p>

  const esAutor = usuario && receta.autorId._id === usuario.id

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>

      {/* Imagen */}
      {receta.imagenUrl ? (
        <img src={receta.imagenUrl} alt={receta.titulo}
          style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1.5rem' }} />
      ) : (
        <div style={{ width: '100%', height: '200px', backgroundColor: '#f5e6d3', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', marginBottom: '1.5rem' }}>
          🍽️
        </div>
      )}

      {/* Título y acciones */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <h1 style={{ color: '#e65c00', margin: 0 }}>{receta.titulo}</h1>
        {esAutor && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to={`/editar/${id}`} style={{
              backgroundColor: '#f0a500', color: 'white', padding: '0.4rem 1rem',
              borderRadius: '4px', textDecoration: 'none', fontSize: '0.9rem'
            }}>
              Editar
            </Link>
            <button onClick={handleEliminar} style={{
              backgroundColor: '#cc0000', color: 'white', border: 'none',
              padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem'
            }}>
              Eliminar
            </button>
          </div>
        )}
      </div>

      <p style={{ color: '#555', marginBottom: '1rem' }}>{receta.descripcion}</p>

      {/* Info general */}
      <div style={{ display: 'flex', gap: '1.5rem', backgroundColor: '#fff8f0', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <span>⏱ <strong>{receta.tiempoMin} min</strong></span>
        <span>🍽 <strong>{receta.porciones} porciones</strong></span>
        <span>📊 <strong>{receta.dificultad}</strong></span>
        <span>🏷 <strong>{receta.categoria}</strong></span>
        <span>👨‍🍳 <strong>{receta.autorId?.nombre}</strong></span>
      </div>

      {/* Tags */}
      {receta.tags && receta.tags.length > 0 && (
        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {receta.tags.map((tag, i) => (
            <span key={i} style={{ backgroundColor: '#ffe0cc', color: '#e65c00', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.85rem' }}>
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Ingredientes */}
      <h2 style={{ color: '#e65c00', borderBottom: '2px solid #f5e6d3', paddingBottom: '0.5rem' }}>Ingredientes</h2>
      <ul style={{ marginBottom: '1.5rem' }}>
        {receta.ingredientes.map((ing, i) => (
          <li key={i} style={{ padding: '0.3rem 0' }}>
            <strong>{ing.cantidad} {ing.unidad}</strong> de {ing.nombre}
          </li>
        ))}
      </ul>

      {/* Pasos */}
      <h2 style={{ color: '#e65c00', borderBottom: '2px solid #f5e6d3', paddingBottom: '0.5rem' }}>Preparación</h2>
      <ol style={{ marginBottom: '2rem' }}>
        {receta.pasos.map((paso, i) => (
          <li key={i} style={{ padding: '0.5rem 0', lineHeight: '1.6' }}>{paso}</li>
        ))}
      </ol>

      {/* Comentarios */}
      <h2 style={{ color: '#e65c00', borderBottom: '2px solid #f5e6d3', paddingBottom: '0.5rem' }}>
        Comentarios ({comentarios.length})
      </h2>

      {/* Formulario comentario */}
      {usuario ? (
        <form onSubmit={handleComentario} style={{ backgroundColor: '#fff8f0', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escribí tu comentario..."
            rows={3}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '0.5rem', boxSizing: 'border-box' }}
          ></textarea>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
            <label htmlFor="calificacion" style={{ fontWeight: '600' }}>Calificación:</label>
            <select
              id="calificacion"
              value={calificacion}
              onChange={(e) => setCalificacion(Number(e.target.value))}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              {[1, 2, 3, 4, 5].map((valor) => (
                <option key={valor} value={valor}>{valor}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={enviando}
            style={{ backgroundColor: '#e65c00', color: 'white', border: 'none', padding: '0.65rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
          >
            {enviando ? 'Enviando...' : 'Enviar comentario'}
          </button>
        </form>
      ) : (
        <p style={{ color: '#555', marginBottom: '1.5rem' }}>
          Debes iniciar sesión para dejar un comentario.
        </p>
      )}

      {comentarios.length > 0 ? (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {comentarios.map((comentario) => {
            const esAutorComentario = usuario && ((comentario.autorId && comentario.autorId._id === usuario.id) || comentario.autorId === usuario.id)
            return (
              <div key={comentario._id || comentario.id} style={{ backgroundColor: '#fff8f0', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div>
                    <strong>{comentario.autorId?.nombre || comentario.autor || 'Anónimo'}</strong>
                    <span style={{ marginLeft: '0.75rem', color: '#e65c00' }}>⭐ {comentario.calificacion || 'N/A'}</span>
                  </div>
                  {esAutorComentario && (
                    <button
                      onClick={() => handleEliminarComentario(comentario._id || comentario.id)}
                      style={{ backgroundColor: '#cc0000', color: 'white', border: 'none', padding: '0.35rem 0.65rem', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Eliminar
                    </button>
                  )}
                </div>
                <p style={{ margin: 0, color: '#555' }}>{comentario.texto}</p>
              </div>
            )
          })}
        </div>
      ) : (
        <p style={{ color: '#555' }}>No hay comentarios aún.</p>
      )}
    </div>
  )
}

export default RecipeDetail
