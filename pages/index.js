import { useState, useEffect } from 'react'

const users = [
  ['admin123', 'kiyy'],
  ['testpass', 'tester']
]

const plans = {
  'PEMULA': { ram: 1024, cpu: 50 },
  'DASAR': { ram: 2048, cpu: 100 },
  'KUAT': { ram: 3072, cpu: 150 },
  'PRO': { ram: 4096, cpu: 200 },
  'MASTER': { ram: 5120, cpu: 250 },
  'ELITE': { ram: 6144, cpu: 300 },
  'DEWA': { ram: 7168, cpu: 350 },
  'SULTAN': { ram: 8192, cpu: 400 },
  'LEGEND': { ram: 9216, cpu: 450 },
  'SUPREME': { ram: 10240, cpu: 500 },
  'TAK TERBATAS': { ram: 0, cpu: 0 }
}

const musicURL = 'https://files.catbox.moe/a5hmbt.mp3'

export default function Home() {
  const [login, setLogin] = useState(false)
  const [inputLogin, setInputLogin] = useState({ username: '', password: '' })
  const [form, setForm] = useState({ username: '', ram: '', cpu: '', disk: '' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

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

  const handlePlanChange = (e) => {
    const selected = plans[e.target.value]
    if (selected) {
      setForm(f => ({
        ...f,
        ram: selected.ram,
        cpu: selected.cpu,
        disk: selected.ram
      }))
    }
  }

  const handleDeploy = async (e) => {
    e.preventDefault()

    if (!form.username || !form.ram || !form.cpu) {
      setError('Username dan Plan wajib diisi!')
      return
    }

    setLoading(true)
    setResult(null)
    setError('')

    const res = await fetch('/api/deploy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })

    const data = await res.json()
    setLoading(false)

    if (data.success) {
      setResult(data)
    } else {
      setError(data.error || 'Gagal deploy')
    }
  }

  const copyResult = () => {
    if (result) {
      const text = `📌 Server ID: ${result.serverId || '-'}\n👤 Username: ${result.username}\n🔐 Password: ${result.password}\n\n💾 RAM: ${result.ram}\n⚙️ CPU: ${result.cpu}\n🗃 Disk: ${result.disk}\n🌐 Panel: ${result.panel}`
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div style={{
      backgroundColor: '#f5f5f5',
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
          background: '#fff', padding: '1.5rem', borderRadius: '12px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)', maxWidth: '400px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem'
        }}>
          <input placeholder="Username" required onChange={e => setInputLogin({ ...inputLogin, username: e.target.value })} style={{ fontSize: '1rem', padding: '0.8rem' }} />
          <input placeholder="Password" type="password" required onChange={e => setInputLogin({ ...inputLogin, password: e.target.value })} style={{ fontSize: '1rem', padding: '0.8rem' }} />
          <button style={{ padding: '1rem', backgroundColor: '#6200ea', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Login</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      ) : (
        <form onSubmit={handleDeploy} style={{
          background: '#fff', padding: '1.5rem', borderRadius: '12px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)', maxWidth: '500px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem'
        }}>
          <input placeholder="Username Bot" required onChange={e => setForm({ ...form, username: e.target.value })} style={{ fontSize: '1rem', padding: '0.8rem' }} />
          <select onChange={handlePlanChange} style={{ fontSize: '1rem', padding: '0.8rem' }}>
            <option value="">Pilih Plan</option>
            {Object.keys(plans).map(plan => (
              <option key={plan} value={plan}>{plan}</option>
            ))}
          </select>
          <input placeholder="RAM (MB)" value={form.ram} disabled style={{ fontSize: '1rem', padding: '0.8rem', backgroundColor: '#eee' }} />
          <input placeholder="CPU (%)" value={form.cpu} disabled style={{ fontSize: '1rem', padding: '0.8rem', backgroundColor: '#eee' }} />
          <button style={{ padding: '1rem', backgroundColor: '#6200ea', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
            {loading ? 'Mendeploy...' : 'Deploy Sekarang'}
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      )}

      {result && (
        <div style={{
          marginTop: '2rem', background: '#fff', padding: '1.5rem', borderRadius: '12px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)', width: '100%', maxWidth: '600px'
        }}>
          <h2 style={{ color: '#4CAF50' }}>🎉 AKUN BERHASIL DIBUAT!</h2>
          <pre style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '8px', marginTop: '1rem', whiteSpace: 'pre-wrap' }}>{`📌 Server ID: ${result.serverId || '-'}
👤 Username: ${result.username}
🔐 Password: ${result.password}

💾 RAM: ${result.ram}
⚙️ CPU: ${result.cpu}
🗃 Disk: ${result.disk}
🌐 Panel: ${result.panel}`}</pre>
          <button onClick={copyResult} style={{ marginTop: '1rem', backgroundColor: '#6200ea', color: 'white', padding: '0.6rem 1rem', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>📋 Salin Detail</button>
          {copied && <p style={{ color: 'green', marginTop: '0.5rem' }}>✅ Berhasil disalin!</p>}
        </div>
      )}
    </div>
  )
  }
