import { useState, useEffect } from 'react'

const users = [
  ['iky123', 'iky'],
  ['amane01', 'amane']
]

const plans = {
  'PEMULA': { ram: 1024, disk: 1024, cpu: 50 },
  'DASAR': { ram: 2048, disk: 2048, cpu: 100 },
  'KUAT': { ram: 3072, disk: 3072, cpu: 150 },
  'PRO': { ram: 4096, disk: 4096, cpu: 200 },
  'MASTER': { ram: 5120, disk: 5120, cpu: 250 },
  'ELITE': { ram: 6144, disk: 6144, cpu: 300 },
  'DEWA': { ram: 7168, disk: 7168, cpu: 350 },
  'SULTAN': { ram: 8192, disk: 8192, cpu: 400 },
  'LEGEND': { ram: 9216, disk: 9216, cpu: 450 },
  'SUPREME': { ram: 10240, disk: 10240, cpu: 500 },
  'TAK TERBATAS': { ram: 0, disk: 0, cpu: 0 }
}

const musicURL = 'https://files.catbox.moe/a5hmbt.mp3' // ganti ke link kamu

export default function Home() {
  const [login, setLogin] = useState(false)
  const [inputLogin, setInputLogin] = useState({ username: '', password: '' })
  const [form, setForm] = useState({ username: '', ram: '', disk: '', cpu: '' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const audio = new Audio(musicURL)
    audio.loop = true
    audio.volume = 0.3
    audio.play().catch(() => {})
  }, [])

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
    setLoading(true)
    setResult(null)

    const res = await fetch('/api/deploy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })

    const data = await res.json()
    setLoading(false)
    setResult(data)
  }

  const handlePlanChange = (e) => {
    const selected = plans[e.target.value]
    if (selected) {
      setForm({ ...form, ram: selected.ram, disk: selected.disk, cpu: selected.cpu })
    }
  }

  return (
    <div style={{
      background: 'url("https://wallpapercave.com/wp/wp6351891.jpg") center/cover no-repeat fixed',
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', fontFamily: 'Segoe UI, sans-serif', padding: '2rem', color: 'white'
    }}>
      <h1 style={{ color: '#ffffff', marginBottom: '2rem', textShadow: '0 0 10px black' }}>
        🌌 Deploy Bot WhatsApp - Panel Gachor
      </h1>

      {!login ? (
        <form onSubmit={handleLogin} style={{
          display: 'flex', flexDirection: 'column', gap: '1rem',
          width: '100%', maxWidth: '400px', background: 'rgba(0,0,0,0.5)',
          padding: '1.5rem', borderRadius: '12px'
        }}>
          <input placeholder="Username" required onChange={e => setInputLogin({ ...inputLogin, username: e.target.value })}
            style={{ padding: '0.8rem', borderRadius: '8px', border: 'none' }} />
          <input placeholder="Password" type="password" required onChange={e => setInputLogin({ ...inputLogin, password: e.target.value })}
            style={{ padding: '0.8rem', borderRadius: '8px', border: 'none' }} />
          <button style={{ padding: '0.8rem', backgroundColor: '#9c27b0', color: 'white', borderRadius: '8px', fontWeight: 'bold' }}>
            Login
          </button>
          {error && <p style={{ color: 'salmon' }}>{error}</p>}
        </form>
      ) : (
        <form onSubmit={handleDeploy} style={{
          display: 'flex', flexDirection: 'column', gap: '1rem',
          width: '100%', maxWidth: '400px', background: 'rgba(0,0,0,0.5)',
          padding: '1.5rem', borderRadius: '12px'
        }}>
          <input placeholder="Username Bot" required onChange={e => setForm({ ...form, username: e.target.value })}
            style={{ padding: '0.8rem', borderRadius: '8px', border: 'none' }} />
          <select onChange={handlePlanChange} style={{ padding: '0.8rem', borderRadius: '8px' }}>
            <option>Pilih Plan</option>
            {Object.keys(plans).map(plan => (
              <option key={plan} value={plan}>{plan}</option>
            ))}
          </select>
          <button style={{ padding: '0.8rem', backgroundColor: '#9c27b0', color: 'white', borderRadius: '8px', fontWeight: 'bold' }}>
            {loading ? '⏳ Mendeploy...' : '🚀 Deploy Sekarang'}
          </button>
        </form>
      )}

      {result && (
        <div style={{
          marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.95)',
          borderRadius: '8px', maxWidth: '600px', width: '100%',
          boxShadow: '0 0 10px black', color: '#000'
        }}>
          {result.success ? (
            <>
              <h3 style={{ color: 'green' }}>✅ Berhasil Dideploy!</h3>
              <p>📌 Server ID: {result.serverId || '-'}</p>
              <p>👤 Username: {result.username}</p>
              <p>🔐 Password: {result.password}</p>
              <p>💾 RAM: {result.ram}</p>
              <p>⚙️ CPU: {result.cpu}</p>
              <p>🗃 Disk: {result.disk}</p>
              <p>🌐 Host: {result.panel}</p>
            </>
          ) : (
            <p style={{ color: 'red' }}>❌ {result.error || 'Terjadi error.'}</p>
          )}
        </div>
      )}

      <footer style={{ marginTop: '3rem', fontSize: '0.9rem', opacity: 0.8 }}>
        Made with 💜 by IKYY
      </footer>
    </div>
  )
}
