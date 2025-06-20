// pages/index.js
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
  const [error, setError] = useState('')
  const [typedResult, setTypedResult] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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

💾 RAM: ${result.ram == 0 ? 'Unlimited' : `${result.ram} MB`}
⚙️ CPU: ${result.cpu == 0 ? 'Unlimited' : `${result.cpu}%`}
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
      padding: '2rem',
      animation: 'slideIn 0.6s ease'
    }}>
      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        input, select {
          padding: 1rem;
          font-size: 1.1rem;
          border-radius: 10px;
          border: 1px solid #ccc;
        }
        button {
          padding: 1rem;
          font-size: 1.1rem;
          background-color: #4b0082;
          color: white;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          transition: 0.2s;
        }
        button:hover {
          background-color: #370061;
        }
        button:disabled {
          background-color: #999;
          cursor: not-allowed;
        }
      `}</style>

      <h1 style={{ color: '#4b0082', marginBottom: '2rem', fontSize: '2rem' }}>🚀 Deploy Panel Bot</h1>

      {!login ? (
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '450px' }}>
          <input placeholder="Username" required onChange={e => setInputLogin({ ...inputLogin, username: e.target.value })} />
          <input placeholder="Password" type="password" required onChange={e => setInputLogin({ ...inputLogin, password: e.target.value })} />
          <button>Login</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      ) : (
        <form onSubmit={handleDeploy} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '450px' }}>
          <input placeholder="Username" required onChange={e => setForm({ ...form, username: e.target.value })} />
          <input placeholder="RAM (0 = Unlimited)" type="number" required onChange={e => setForm({ ...form, ram: e.target.value })} />
          <input placeholder="CPU (0 = Unlimited)" type="number" required onChange={e => setForm({ ...form, cpu: e.target.value })} />
          <button disabled={isLoading}>
            {isLoading ? 'Akun Anda sedang dibuat...' : 'Deploy'}
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
          lineHeight: '1.6',
          animation: 'slideIn 0.5s ease'
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
