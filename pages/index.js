import { useState, useEffect } from 'react'

const users = [
  ['admin123', 'kiyy'],
  ['testpass', 'tester']
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
  const [typed, setTyped] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const audio = new Audio(musicURL)
    audio.loop = true
    audio.volume = 0.3
    audio.play().catch(() => {})
    setTimeout(() => setShowForm(true), 200)
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
    setTyped('')

    const res = await fetch('/api/deploy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })

    const data = await res.json()
    setLoading(false)
    setResult(data)

    if (data.success) {
      const fullText = `📌 Server ID: ${data.serverId || '-'}\n👤 Username : ${data.username}\n🔐 Password : ${data.password}\n\n💾 RAM     : ${data.ram}\n⚙️ CPU     : ${data.cpu}\n🗃 Disk    : ${data.disk}\n🌐 Panel   : ${data.panel}`
      let index = 0
      const interval = setInterval(() => {
        setTyped(t => t + fullText[index])
        index++
        if (index >= fullText.length) clearInterval(interval)
      }, 15)
    }
  }

  const handlePlanChange = (e) => {
    const selected = plans[e.target.value]
    if (selected) {
      setForm(prev => ({ ...prev, ram: selected.ram, disk: selected.disk, cpu: selected.cpu }))
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
      fontFamily: 'sans-serif',
      transition: 'opacity 1s ease'
    }}>
      <h1 style={{ marginBottom: '2rem', color: '#333' }}>Deploy Bot WhatsApp</h1>

      {showForm && !login && (
        <form onSubmit={handleLogin} style={{
          backgroundColor: '#ffffff',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 0 15px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          width: '100%',
          maxWidth: '400px',
          transform: 'translateX(0)',
          animation: 'slideIn 0.5s ease forwards'
        }}>
          <input placeholder="Username" required onChange={e => setInputLogin({ ...inputLogin, username: e.target.value })} style={{ fontSize: '1rem', padding: '0.8rem' }} />
          <input placeholder="Password" type="password" required onChange={e => setInputLogin({ ...inputLogin, password: e.target.value })} style={{ fontSize: '1rem', padding: '0.8rem' }} />
          <button style={{ padding: '1rem', backgroundColor: '#6200ea', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Login</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      )}

      {login && (
        <form onSubmit={handleDeploy} style={{
          backgroundColor: '#ffffff',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 0 15px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          width: '100%',
          maxWidth: '400px',
          transform: 'translateX(0)',
          animation: 'slideIn 0.5s ease forwards'
        }}>
          <input placeholder="Username Bot" required onChange={e => setForm({ ...form, username: e.target.value })} style={{ fontSize: '1rem', padding: '0.8rem' }} />
          <select onChange={handlePlanChange} style={{ fontSize: '1rem', padding: '0.8rem' }}>
            <option>Pilih Plan</option>
            {Object.keys(plans).map(plan => (
              <option key={plan} value={plan}>{plan}</option>
            ))}
          </select>
          <button style={{ padding: '1rem', backgroundColor: '#6200ea', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
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
          position: 'relative',
          fontFamily: 'monospace',
          fontSize: '14px',
          whiteSpace: 'pre-wrap',
          lineHeight: '1.6'
        }}>
          {result.success ? (
            <>
              <h2 style={{ color: '#4CAF50', marginBottom: '1rem' }}>🎉 AKUN BERHASIL DIBUAT!</h2>
              <div id="resultText">{typed}</div>
              <button onClick={() => {
                navigator.clipboard.writeText(typed)
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
