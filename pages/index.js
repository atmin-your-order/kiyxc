import { useState, useEffect } from 'react'
import users from '../database.js'

export default function Home() {
  const [login, setLogin] = useState(false)
  const [inputLogin, setInputLogin] = useState({ username: '', password: '' })
  const [form, setForm] = useState({ username: '', ram: '', cpu: '' })
  const [adminForm, setAdminForm] = useState({ domain: '', apikey: '', nodeName: '', nestName: '', eggName: '' })
  const [userData, setUserData] = useState(null)
  const [result, setResult] = useState(null)
  const [typedResult, setTypedResult] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    const found = users.find(u =>
      u.username === inputLogin.username && u.password === inputLogin.password
    )
    if (found) {
      setLogin(true)
      setUserData(found)
      setForm({ ...form, username: found.username })
      setMessage('')
    } else {
      setMessage('Login gagal. Username/password salah.')
    }
  }

  const handleDeploy = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)
    setTypedResult('')
    setIsTyping(false)

    const res = await fetch('/api/deploy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    setResult(data)
    setTypedResult('')
    setIsTyping(true)
  }

  const handleAdminSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/config-update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminForm)
    })
    const data = await res.json()
    setMessage(data.success ? '✅ Config berhasil diupdate!' : '❌ Gagal update config: ' + data.error)
  }

  useEffect(() => {
    if (result && isTyping) {
      const createdAt = new Date()
      const expireAt = new Date(createdAt)
      expireAt.setDate(expireAt.getDate() + 30)
      const formatDate = (d) => d.toLocaleDateString('id-ID')

      const output = `🔥 AKUN BERHASIL DIBUAT 🔥

👤 Username: ${result.username}
🔐 Password: ${result.password}
🌐 Host: ${result.panel || 'Tidak tersedia'}

💾 RAM: ${result.ram}
⚙️ CPU: ${result.cpu}
📊 Status: Aktif ✅
📅 Dibuat: ${formatDate(createdAt)}
⏳ Aktif 30 Hari
📆 Expired: ${formatDate(expireAt)}

🚫 Jangan gunakan untuk aktivitas ilegal:
• DDoS / Flood / Serangan ke Server
• Penipuan, Carding, atau Abuse
• Phishing / Malware

📌 Jika melanggar, server akan dihapus tanpa pemberitahuan!

👑 Author: IKYY
`
      let i = 0
      const typing = setInterval(() => {
        setTypedResult(output.slice(0, i))
        i++
        if (i > output.length) {
          clearInterval(typing)
          setIsTyping(false)
          setIsLoading(false)
        }
      }, 10)
    }
  }, [result, isTyping])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(typedResult)
    alert('Berhasil Disalin ✅')
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
      <h1 style={{ color: '#4b0082' }}>🚀 Panel Bot</h1>

      {!login ? (
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '400px' }}>
          <input placeholder="Username" required onChange={e => setInputLogin({ ...inputLogin, username: e.target.value })} />
          <input placeholder="Password" type="password" required onChange={e => setInputLogin({ ...inputLogin, password: e.target.value })} />
          <button>Login</button>
          {message && <p style={{ color: 'red' }}>{message}</p>}
        </form>
      ) : userData.role === 'admin' ? (
        <form onSubmit={handleAdminSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '500px' }}>
          <h2 style={{ color: '#4b0082' }}>🔧 Admin Config Panel</h2>
          <input placeholder="Domain Panel" required onChange={e => setAdminForm({ ...adminForm, domain: e.target.value })} />
          <input placeholder="API Key" required onChange={e => setAdminForm({ ...adminForm, apikey: e.target.value })} />
          <input placeholder="Nama Node" required onChange={e => setAdminForm({ ...adminForm, nodeName: e.target.value })} />
          <input placeholder="Nama Nest" required onChange={e => setAdminForm({ ...adminForm, nestName: e.target.value })} />
          <input placeholder="Nama Egg" required onChange={e => setAdminForm({ ...adminForm, eggName: e.target.value })} />
          <button>Simpan</button>
          {message && <p>{message}</p>}
        </form>
      ) : (
        <form onSubmit={handleDeploy} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '400px' }}>
          <input placeholder="Username" value={form.username} readOnly />
          <input placeholder="RAM (0 = Unlimited)" type="number" required onChange={e => setForm({ ...form, ram: e.target.value })} />
          <input placeholder="CPU (%)" type="number" required onChange={e => setForm({ ...form, cpu: e.target.value })} />
          <button disabled={isLoading}>
            {isLoading ? 'Membuat akun...' : 'Deploy'}
          </button>
        </form>
      )}

      {typedResult && (
        <div style={{
          marginTop: '2rem',
          background: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          maxWidth: '600px',
          width: '100%',
          position: 'relative',
          whiteSpace: 'pre-wrap',
          fontSize: '1rem',
          lineHeight: '1.6'
        }}>
          <button
            onClick={copyToClipboard}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              padding: '0.5rem 0.8rem',
              fontSize: '0.9rem',
              backgroundColor: '#4b0082',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
            📋 Salin
          </button>
          {typedResult}
        </div>
      )}
    </div>
  )
        }
