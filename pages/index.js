import { useState, useEffect } from 'react'

const users = [
  ['admin123', 'kiyy'],
  ['testpass', 'tester']
]

export default function Home() {
  const [login, setLogin] = useState(false)
  const [inputLogin, setInputLogin] = useState({ username: '', password: '' })
  const [form, setForm] = useState({ username: '', ram: '', cpu: '' })
  const [result, setResult] = useState(null)
  const [displayedText, setDisplayedText] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (result) {
      const text = getDeployText(result)
      let index = 0
      const typing = setInterval(() => {
        setDisplayedText((prev) => prev + text[index])
        index++
        if (index >= text.length) clearInterval(typing)
      }, 10)
      return () => clearInterval(typing)
    }
  }, [result])

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
    const createdAt = new Date()
    const expiredAt = new Date()
    expiredAt.setDate(createdAt.getDate() + 30)

    const finalData = {
      ...form,
      createdAt: createdAt.toLocaleDateString(),
      expiredAt: expiredAt.toLocaleDateString(),
      status: 'Aktif ✅'
    }

    const res = await fetch('/api/deploy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalData)
    })

    const data = await res.json()
    setResult({ ...data, ...finalData })
    setDisplayedText('')
  }

  const getDeployText = (data) => `
🔥 AKUN BERHASIL DIBUAT 🔥

👤 Username: ${data.username}
🔐 Password: ${data.password}
🖥️ Server ID: ${data.serverId}
🌐 Host: ${data.host}

💾 RAM: ${data.ram === '0' ? 'Unlimited' : data.ram + ' MB'}
⚙️ CPU: ${data.cpu === '0' ? 'Unlimited' : data.cpu + '%'}
📊 Status: ${data.status}
📅 Dibuat: ${data.createdAt}
⏳ Aktif 30 Hari
📆 Expired: ${data.expiredAt}

🚫 Jangan gunakan untuk aktivitas ilegal:
• DDoS / Flood / Serangan ke Server
• Penipuan, Carding, atau Abuse
• Phishing / Malware

📌 Jika melanggar, server akan dihapus tanpa pemberitahuan!
`

  const handleCopy = () => {
    navigator.clipboard.writeText(getDeployText(result))
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #e0c3fc, #8ec5fc)',
      minHeight: '100vh',
      padding: '2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'translateX(0)' : 'translateX(-30px)',
      transition: 'all 0.6s ease'
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '20px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '500px'
      }}>
        <h2 style={{ textAlign: 'center', color: '#4b0082', marginBottom: '1.5rem' }}>🚀 Deploy Bot WhatsApp</h2>

        {!login ? (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="text" placeholder="Username" required value={inputLogin.username}
              onChange={e => setInputLogin({ ...inputLogin, username: e.target.value })}
              style={inputStyle}
            />
            <input type="password" placeholder="Password" required value={inputLogin.password}
              onChange={e => setInputLogin({ ...inputLogin, password: e.target.value })}
              style={inputStyle}
            />
            <button style={btnStyle}>Login</button>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          </form>
        ) : !result ? (
          <form onSubmit={handleDeploy} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="text" placeholder="Username Panel" required value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              style={inputStyle}
            />
            <input type="number" placeholder="RAM (MB) - 0 = Unlimited" required value={form.ram}
              onChange={e => setForm({ ...form, ram: e.target.value })}
              style={inputStyle}
            />
            <input type="number" placeholder="CPU (%) - 0 = Unlimited" required value={form.cpu}
              onChange={e => setForm({ ...form, cpu: e.target.value })}
              style={inputStyle}
            />
            <button style={btnStyle}>Deploy Sekarang</button>
          </form>
        ) : (
          <>
            <div style={{
              background: '#f7f7f7',
              padding: '1rem',
              borderRadius: '12px',
              marginTop: '1rem',
              fontSize: '0.95rem',
              whiteSpace: 'pre-wrap',
              minHeight: '250px'
            }}>
              {displayedText || '⌛ Menampilkan hasil deploy...'}
            </div>
            <button onClick={handleCopy} style={{ ...btnStyle, marginTop: '1rem' }}>
              📋 Salin Detail
            </button>
            {copied && <p style={{ color: 'green', marginTop: '0.5rem', textAlign: 'center' }}>✅ Berhasil Disalin</p>}
          </>
        )}

        <p style={{ marginTop: '2rem', fontSize: '0.85rem', textAlign: 'center', color: '#888' }}>
          👑 Author: <b>IKYY</b>
        </p>
      </div>
    </div>
  )
}

const inputStyle = {
  padding: '0.9rem',
  borderRadius: '10px',
  border: '1px solid #ccc',
  fontSize: '1rem'
}

const btnStyle = {
  padding: '0.9rem',
  backgroundColor: '#4b0082',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  fontSize: '1rem',
  cursor: 'pointer'
          }
