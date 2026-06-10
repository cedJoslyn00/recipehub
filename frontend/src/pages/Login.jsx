import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      setCargando(true)
      const res = await API.post('/api/auth/login', form)
      login(res.data.token, res.data.usuario)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ color: '#e65c00', textAlign: 'center', marginBottom: '1.5rem' }}>Iniciar Sesión</h2>

      {error && (
        <div style={{ backgroundColor: '#ffe0e0', color: '#cc0000', padding: '0.8rem', borderRadius: '4px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.8rem' }}>
          Email *
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', marginTop: '0.3rem' }}
          />
        </label>

        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '1.5rem' }}>
          Contraseña *
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', marginTop: '0.3rem' }}
          />
        </label>

        <button type="submit" disabled={cargando} style={{
          width: '100%', backgroundColor: '#e65c00', color: 'white', border: 'none',
          padding: '0.7rem', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold'
        }}>
          {cargando ? 'Entrando...' : 'Iniciar Sesión'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1rem', color: '#666' }}>
        ¿No tenés cuenta?{' '}
        <Link to="/register" style={{ color: '#e65c00' }}>Registrate</Link>
      </p>
    </div>
  )
}

export default Login