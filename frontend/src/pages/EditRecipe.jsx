import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import API from '../api/axios'

function EditRecipe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [enviando, setEnviando] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    categoria: 'Desayuno',
    tiempoMin: '',
    porciones: '',
    dificultad: 'Fácil',
    imagenUrl: '',
    tags: '',
  })

  const [ingredientes, setIngredientes] = useState([
    { nombre: '', cantidad: '', unidad: '' }
  ])

  const [pasos, setPasos] = useState([''])

   useEffect(() => {
  const fetchReceta = async () => {
    try {
      const res = await API.get(`/api/recetas/${id}`)
      const r = res.data.receta
      setForm({
        titulo: r.titulo,
        descripcion: r.descripcion,
        categoria: r.categoria,
        tiempoMin: r.tiempoMin,
        porciones: r.porciones,
        dificultad: r.dificultad,
        imagenUrl: r.imagenUrl || '',
        tags: r.tags ? r.tags.join(', ') : '',
      })
      setIngredientes(r.ingredientes)
      setPasos(r.pasos)
    } catch {
      setError('Error al cargar la receta')
    } finally {
      setCargando(false)
    }
  }

  fetchReceta()
}, [id])
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Ingredientes
  const handleIngrediente = (index, field, value) => {
    const nuevos = [...ingredientes]
    nuevos[index][field] = value
    setIngredientes(nuevos)
  }

  const agregarIngrediente = () => {
    setIngredientes([...ingredientes, { nombre: '', cantidad: '', unidad: '' }])
  }

  const quitarIngrediente = (index) => {
    if (ingredientes.length === 1) return
    setIngredientes(ingredientes.filter((_, i) => i !== index))
  }

  // Pasos
  const handlePaso = (index, value) => {
    const nuevos = [...pasos]
    nuevos[index] = value
    setPasos(nuevos)
  }

  const agregarPaso = () => {
    setPasos([...pasos, ''])
  }

  const quitarPaso = (index) => {
    if (pasos.length === 1) return
    setPasos(pasos.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const ingredientesLimpios = ingredientes.filter(i => i.nombre && i.cantidad && i.unidad)
    const pasosLimpios = pasos.filter(p => p.trim() !== '')

    if (ingredientesLimpios.length === 0) {
      setError('Agregá al menos un ingrediente completo')
      return
    }
    if (pasosLimpios.length === 0) {
      setError('Agregá al menos un paso')
      return
    }

    try {
      setEnviando(true)
      const data = {
        ...form,
        tiempoMin: Number(form.tiempoMin),
        porciones: Number(form.porciones),
        ingredientes: ingredientesLimpios,
        pasos: pasosLimpios,
        tags: form.tags ? form.tags.split(',').map(t => t.trim().toLowerCase()) : [],
      }
      await API.put(`/api/recetas/${id}`, data)
      navigate(`/recetas/${id}`)
    } catch (error) {
      setError(error.response?.data?.message || 'Error al actualizar la receta')
    } finally {
      setEnviando(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '0.5rem', borderRadius: '4px',
    border: '1px solid #ccc', boxSizing: 'border-box', marginTop: '0.3rem'
  }

  const labelStyle = { display: 'block', fontWeight: 'bold', marginBottom: '0.8rem' }

  if (cargando) return <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando...</p>

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ color: '#e65c00', marginBottom: '1.5rem' }}>Editar Receta</h1>

      {error && (
        <div style={{ backgroundColor: '#ffe0e0', color: '#cc0000', padding: '0.8rem', borderRadius: '4px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        <label style={labelStyle}>
          Título *
          <input name="titulo" value={form.titulo} onChange={handleChange} required style={inputStyle} />
        </label>

        <label style={labelStyle}>
          Descripción *
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} required rows={3} style={inputStyle} />
        </label>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.8rem' }}>
          <label style={{ flex: 1, fontWeight: 'bold' }}>
            Categoría *
            <select name="categoria" value={form.categoria} onChange={handleChange} style={inputStyle}>
              <option>Desayuno</option>
              <option>Almuerzo</option>
              <option>Cena</option>
              <option>Postre</option>
              <option>Snack</option>
              <option>Bebida</option>
              <option>Otro</option>
            </select>
          </label>
          <label style={{ flex: 1, fontWeight: 'bold' }}>
            Dificultad *
            <select name="dificultad" value={form.dificultad} onChange={handleChange} style={inputStyle}>
              <option>Fácil</option>
              <option>Media</option>
              <option>Difícil</option>
            </select>
          </label>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.8rem' }}>
          <label style={{ flex: 1, fontWeight: 'bold' }}>
            Tiempo (minutos) *
            <input name="tiempoMin" type="number" min="1" value={form.tiempoMin} onChange={handleChange} required style={inputStyle} />
          </label>
          <label style={{ flex: 1, fontWeight: 'bold' }}>
            Porciones *
            <input name="porciones" type="number" min="1" value={form.porciones} onChange={handleChange} required style={inputStyle} />
          </label>
        </div>

        <label style={labelStyle}>
          URL de imagen (opcional)
          <input name="imagenUrl" value={form.imagenUrl} onChange={handleChange} style={inputStyle} />
        </label>

        <label style={labelStyle}>
          Tags (separados por coma, opcional)
          <input name="tags" value={form.tags} onChange={handleChange} style={inputStyle} />
        </label>

        {/* Ingredientes */}
        <h3 style={{ color: '#e65c00', marginBottom: '0.5rem' }}>Ingredientes *</h3>
        {ingredientes.map((ing, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
            <input placeholder="Nombre" value={ing.nombre} onChange={(e) => handleIngrediente(i, 'nombre', e.target.value)}
              style={{ flex: 2, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
            <input placeholder="Cantidad" type="number" min="0" value={ing.cantidad} onChange={(e) => handleIngrediente(i, 'cantidad', e.target.value)}
              style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
            <input placeholder="Unidad" value={ing.unidad} onChange={(e) => handleIngrediente(i, 'unidad', e.target.value)}
              style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
            <button type="button" onClick={() => quitarIngrediente(i)} style={{
              backgroundColor: '#cc0000', color: 'white', border: 'none',
              borderRadius: '4px', padding: '0.5rem 0.8rem', cursor: 'pointer'
            }}>✕</button>
          </div>
        ))}
        <button type="button" onClick={agregarIngrediente} style={{
          backgroundColor: '#f5e6d3', color: '#e65c00', border: '1px solid #e65c00',
          padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer', marginBottom: '1.5rem'
        }}>
          + Agregar ingrediente
        </button>

        {/* Pasos */}
        <h3 style={{ color: '#e65c00', marginBottom: '0.5rem' }}>Pasos de preparación *</h3>
        {pasos.map((paso, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'flex-start' }}>
            <span style={{ marginTop: '0.6rem', fontWeight: 'bold', color: '#e65c00', minWidth: '20px' }}>{i + 1}.</span>
            <textarea placeholder={`Paso ${i + 1}`} value={paso} onChange={(e) => handlePaso(i, e.target.value)} rows={2}
              style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
            <button type="button" onClick={() => quitarPaso(i)} style={{
              backgroundColor: '#cc0000', color: 'white', border: 'none',
              borderRadius: '4px', padding: '0.5rem 0.8rem', cursor: 'pointer', marginTop: '0.2rem'
            }}>✕</button>
          </div>
        ))}
        <button type="button" onClick={agregarPaso} style={{
          backgroundColor: '#f5e6d3', color: '#e65c00', border: '1px solid #e65c00',
          padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer', marginBottom: '1.5rem'
        }}>
          + Agregar paso
        </button>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" disabled={enviando} style={{
            backgroundColor: '#e65c00', color: 'white', border: 'none',
            padding: '0.7rem 2rem', borderRadius: '4px', cursor: 'pointer',
            fontSize: '1rem', fontWeight: 'bold'
          }}>
            {enviando ? 'Guardando...' : 'Guardar cambios'}
          </button>
          <button type="button" onClick={() => navigate(`/recetas/${id}`)} style={{
            backgroundColor: '#eee', color: '#333', border: 'none',
            padding: '0.7rem 2rem', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem'
          }}>
            Cancelar
          </button>
        </div>

      </form>
    </div>
  )
}

export default EditRecipe