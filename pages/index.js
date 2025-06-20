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

const musicURL = 'https://files.catbox.moe/a5hmbt.mp3'

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
      backgroundColor: '#f9f9f9',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ marginBottom: '2rem', color: '#333' }}>Deploy Bot WhatsApp</h1>

      {!login ? (
        <form onSubmit={handleLogin} style={{
          backgroundColor: '#ffffff',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 0 15px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          width: '100%',
          maxWidth: '400px'
        }}>
          <input placeholder="Username" required onChange={e => setInputLogin({ ...inputLogin, username: e.target.value })} />
          <input placeholder="Password" type="password" required onChange={e => setInputLogin({ ...inputLogin, password: e.target.value })} />
          <button style={{ padding: '0.8rem', backgroundColor: '#6200ea', color: '#fff', border: 'none', borderRadius: '8px' }}>Login</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      ) : (
        <form onSubmit={handleDeploy} style={{
          backgroundColor: '#ffffff',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 0 15px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          width: '100%',
          maxWidth: '400px'
        }}>
          <input placeholder="Username Bot" required onChange={e => setForm({ ...form, username: e.target.value })} />
          <select onChange={handlePlanChange}>
            <option>Pilih Plan</option>
            {Object.keys(plans).map(plan => (
              <option key={plan} value={plan}>{plan}</option>
            ))}
          </select>
          <button style={{ padding: '0.8rem', backgroundColor: '#6200ea', color: '#fff', border: 'none', borderRadius: '8px' }}>
            {loading ? 'Mendeploy...' : 'Deploy Sekarang'}
          </button>
        </form>
      )}

      {result && (
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 0 15px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '600px',
          position: 'relative'
        }}>
          {result.success ? (
            <>
              <h2 style={{ color: '#4CAF50', marginBottom: '1rem' }}>🎉 AKUN BERHASIL DIBUAT!</h2>
              <pre id="resultText" style={{
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                fontSize: '14px',
                lineHeight: '1.6',
                background: '#f9f9f9',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #eee'
              }}>{`📌 Server ID: ${result.serverId || '-'}
👤 Username : ${result.username}
🔐 Password : ${result.password}

💾 RAM     : ${result.ram}
⚙️ CPU     : ${result.cpu}
🗃 Disk    : ${result.disk}
🌐 Panel   : ${result.panel}`}</pre>

              <button onClick={() => {
                const text = document.getElementById('resultText').innerText
                navigator.clipboard.writeText(text)
                const notif = document.getElementById('copyNotif')
                notif.style.display = 'block'
                setTimeout(() => notif.style.display = 'none', 2000)
              }} style={{
                marginTop: '1rem',
                backgroundColor: '#6200ea',
                color: 'white',
                padding: '0.6rem 1rem',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}>📋 Salin Detail</button>

              <p id="copyNotif" style={{
                marginTop: '0.5rem',
                color: 'green',
                fontSize: '0.9rem',
                display: 'none'
              }}>✅ Berhasil disalin!</p>
            </>
          ) : (
            <p style={{ color: 'red' }}>{result.error || 'Terjadi error.'}</p>
          )}
        </div>
      )}
    </div>
  )
        }
