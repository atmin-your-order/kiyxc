// pages/index.js
import { useState } from 'react'
import crypto from 'crypto'

const users = [
  ['admin123', 'kiyy'],
  ['testpass', 'tester']
]

export default function Home() {
  const [login, setLogin] = useState(false)
  const [inputLogin, setInputLogin] = useState({ username: '', password: '' })
  const [form, setForm] = useState({ username: '', ram: '', cpu: '' })
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    const found = users.find(([pass, user]) => user === inputLogin.username && pass === inputLogin.password)
    if (found) {
      setLogin(true)
      setError('')
    } else {
      setError('Username atau password salah!')
    }
  }

  const handleDeploy = async (e) => {
    e.preventDefault()

    const res = await fetch('/api/deploy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })

    const data = await res.json()
    setResult(data)
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #e0c3fc, #8ec5fc)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Segoe UI, sans-serif',
      padding: '2rem'
    }}>
      <h1 style={{ color: '#4b0082', marginBottom: '2rem' }}>Deploy Panel Bot</h1>

      {!login ? (
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '400px' }}>
          <input placeholder="Username" required onChange={e => setInputLogin({ ...inputLogin, username: e.target.value })} />
          <input placeholder="Password" type="password" required onChange={e => setInputLogin({ ...inputLogin, password: e.target.value })} />
          <button style={{ padding: '0.8rem', backgroundColor: '#4b0082', color: 'white', borderRadius: '8px' }}>Login</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      ) : (
        <form onSubmit={handleDeploy} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '400px' }}>
          <input placeholder="Username" required onChange={e => setForm({ ...form, username: e.target.value })} />
          <input placeholder="RAM (MB)" type="number" required onChange={e => setForm({ ...form, ram: e.target.value })} />
          <input placeholder="CPU (%)" type="number" required onChange={e => setForm({ ...form, cpu: e.target.value })} />
          <button style={{ padding: '0.8rem', backgroundColor: '#4b0082', color: 'white', borderRadius: '8px' }}>Deploy</button>
        </form>
      )}

      {result && (
        <pre style={{
          marginTop: '2rem',
          padding: '1rem',
          background: 'white',
          borderRadius: '8px',
          maxWidth: '600px',
          width: '100%',
          overflowX: 'auto'
        }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  )
}