import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios'

function Home() {
  const [recetas, setRecetas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('')
  const [dificultad, setDificultad] = useState('')

  const cargarRecetas = async () => {
    try {
      setCargando(true)
      const params = {}
      if (busqueda) params.busqueda = busqueda
      if (categoria) params.categoria = categoria
      if (dificultad) params.dificultad = dificultad

      const res = await API.get('/api/recetas', { params })
      setRecetas(res.data.recetas)
    } catch (error) {
      console.error('Error cargando recetas:', error)
    } finally {
      setCargando(false)
    }
  }

useEffect(() => {
  const fetchRecetas = async () => {
    try {
      setCargando(true)
      const params = {}
      if (busqueda) params.busqueda = busqueda
      if (categoria) params.categoria = categoria
      if (dificultad) params.dificultad = dificultad

      const res = await API.get('/api/recetas', { params })
      setRecetas(res.data.recetas)
    } catch (error) {
      console.error('Error cargando recetas:', error)
    } finally {
      setCargando(false)
    }
  }

  fetchRecetas()
}, [categoria, dificultad])

  const handleBusqueda = (e) => {
    e.preventDefault()
    cargarRecetas()
  }

/*
  const calcularPromedio = (comentarios) => {
    if (!comentarios || comentarios.length === 0) return null
    const suma = comentarios.reduce((acc, c) => acc + c.calificacion, 0)
    return (suma / comentarios.length).toFixed(1)
  }
*/

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', color: '#e65c00', marginBottom: '1.5rem' }}>
        Recetas de cocina
      </h1>

      {/* Buscador y filtros */}
      <form onSubmit={handleBusqueda} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Buscar por título o tag..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', minWidth: '200px' }}
        />
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}>
          <option value="">Todas las categorías</option>
          <option value="Desayuno">Desayuno</option>
          <option value="Almuerzo">Almuerzo</option>
          <option value="Cena">Cena</option>
          <option value="Postre">Postre</option>
          <option value="Snack">Snack</option>
          <option value="Bebida">Bebida</option>
          <option value="Otro">Otro</option>
        </select>
        <select value={dificultad} onChange={(e) => setDificultad(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}>
          <option value="">Todas las dificultades</option>
          <option value="Fácil">Fácil</option>
          <option value="Media">Media</option>
          <option value="Difícil">Difícil</option>
        </select>
        <button type="submit" style={{
          backgroundColor: '#e65c00', color: 'white', border: 'none',
          padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer'
        }}>
          Buscar
        </button>
      </form>

      {/* Lista de recetas */}
      {cargando ? (
        <p style={{ textAlign: 'center' }}>Cargando recetas...</p>
      ) : recetas.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No se encontraron recetas.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {recetas.map((receta) => (
            <Link to={`/recetas/${receta._id}`} key={receta._id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)', transition: 'transform 0.2s',
                backgroundColor: 'white'
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {receta.imagenUrl ? (
                  <img src={receta.imagenUrl} alt={receta.titulo}
                    style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '180px', backgroundColor: '#f5e6d3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                    🍽️
                  </div>
                )}
                <div style={{ padding: '1rem' }}>
                  <h3 style={{ margin: '0 0 0.5rem', color: '#333' }}>{receta.titulo}</h3>
                  <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 0.5rem' }}>{receta.descripcion}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#888' }}>
                    <span>⏱ {receta.tiempoMin} min</span>
                    <span>📊 {receta.dificultad}</span>
                    <span>🏷 {receta.categoria}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home