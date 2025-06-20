import { useState, useEffect } from 'react'
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
  const [copyText, setCopyText] = useState('Salin Detail 📋')
  const [typedResult, setTypedResult] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    const found = users.find(([pass, user]) => user === inputLogin.username && pass === inputLogin.password)
    if (found) {
      setLogin(true)
      setError('')
    } else {
      setError('❌ Username atau password salah!')
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
    setTypedResult('')
  }

  useEffect(() => {
    if (result) {
      let i = 0
      const text = `🎉 AKUN BERHASIL DIBUAT! 🎉\n\n${JSON.stringify(result, null, 2)}`
      const interval = setInterval(() => {
        setTypedResult(text.slice(0, i))
        i++
        if (i > text.length) clearInterval(interval)
      }, 15)
      return () => clearInterval(interval)
    }
  }, [result])

  const handleCopy = () => {
    navigator.clipboard.writeText(typedResult)
    setCopyText('✅ Berhasil Disalin!')
    setTimeout(() => setCopyText('Salin Detail 📋'), 2000)
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
      padding: '2rem',
      transition: 'all 0.4s ease-in-out'
    }}>
      <h1 style={{ color: '#4b0082', fontSize: '2.5rem', marginBottom: '2rem' }}>🚀 Deploy Panel Bot WhatsApp</h1>

      {!login ? (
        <form onSubmit={handleLogin} style={styles.card}>
          <input placeholder="Username" required onChange={e => setInputLogin({ ...inputLogin, username: e.target.value })} style={styles.input} />
          <input placeholder="Password" type="password" required onChange={e => setInputLogin({ ...inputLogin, password: e.target.value })} style={styles.input} />
          <button style={styles.button}>🔐 Login</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      ) : (
        <form onSubmit={handleDeploy} style={styles.card}>
          <input placeholder="Username" required onChange={e => setForm({ ...form, username: e.target.value })} style={styles.input} />
          <input placeholder="RAM (MB)" type="number" required onChange={e => setForm({ ...form, ram: e.target.value })} style={styles.input} />
          <input placeholder="CPU (%)" type="number" required onChange={e => setForm({ ...form, cpu: e.target.value })} style={styles.input} />
          <button style={styles.button}>⚙️ Deploy</button>
        </form>
      )}

      {typedResult && (
        <div style={styles.resultCard}>
          <pre style={styles.resultText}>{typedResult}</pre>
          <button onClick={handleCopy} style={styles.copyBtn}>{copyText}</button>
        </div>
      )}
    </div>
  )
}

const styles = {
  card: {
    backdropFilter: 'blur(10px)',
    background: 'rgba(255, 255, 255, 0.6)',
    borderRadius: '20px',
    padding: '2rem',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    animation: 'slideIn 0.5s ease'
  },
  input: {
    padding: '1rem',
    borderRadius: '12px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    outline: 'none'
  },
  button: {
    padding: '1rem',
    backgroundColor: '#4b0082',
    color: 'white',
    fontWeight: 'bold',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background 0.3s'
  },
  resultCard: {
    marginTop: '2rem',
    background: '#fff',
    borderRadius: '15px',
    padding: '1.5rem',
    maxWidth: '600px',
    width: '100%',
    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
    position: 'relative',
    animation: 'fadeIn 1s ease-in-out'
  },
  resultText: {
    whiteSpace: 'pre-wrap',
    fontSize: '1rem',
    marginBottom: '1rem',
    fontFamily: 'Courier New, monospace'
  },
  copyBtn: {
    padding: '0.8rem 1rem',
    backgroundColor: '#4b0082',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '0.95rem'
  }
        }
