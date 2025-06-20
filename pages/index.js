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
  const [typedResult, setTypedResult] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [copyText, setCopyText] = useState('')

  const plans = {
    PEMULA: { ram: 1024, cpu: 50 },
    HEBAT: { ram: 2048, cpu: 100 },
    ELITE: { ram: 4096, cpu: 200 },
    SULTAN: { ram: 8192, cpu: 300 },
    K: { ram: 0, cpu: 0 }, // unlimited
  }

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('id-ID').format(date)
  }

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
    setTypedResult('') // Reset sebelum ketik ulang
    setCopyText('') // Reset copy text

    if (data) {
      const now = new Date()
      const expire = new Date(now)
      expire.setDate(now.getDate() + 30)

      const ram = data.ram == 0 ? 'Unlimited' : `${data.ram} MB`
      const cpu = data.cpu == 0 ? 'Unlimited' : `${data.cpu}%`

      const output = `
🔥 AKUN BERHASIL DIBUAT 🔥

👤 Username: ${data.username}
🔐 Password: ${data.password}
🖥️ Server ID: ${data.serverId}
🌐 Host: ${data.host}

💾 RAM: ${ram}
⚙️ CPU: ${cpu}
📊 Status: Aktif ✅
📅 Dibuat: ${formatDate(now)}
⏳ Aktif 30 Hari
📆 Expired: ${formatDate(expire)}

🚫 Jangan gunakan untuk aktivitas ilegal:
• DDoS / Flood / Serangan ke Server
• Penipuan, Carding, atau Abuse
• Phishing / Malware

📌 Jika melanggar, server akan dihapus tanpa pemberitahuan!

👑 Author: IKYY
`.trim()

      setCopyText(output)

      // animasi ketik
      let i = 0
      const interval = setInterval(() => {
        if (i <= output.length) {
          setTypedResult(output.slice(0, i))
          i++
        } else {
          clearInterval(interval)
        }
      }, 10)
    }
  }

  const handlePlan = (e) => {
    const selected = e.target.value
    const plan = plans[selected]
    setForm({
      ...form,
      ram: plan.ram,
      cpu: plan.cpu
    })
  }

  useEffect(() => {
    document.body.style.margin = 0
  }, [])

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
      animation: 'slideIn 1s ease'
    }}>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <h1 style={{ color: '#4b0082', marginBottom: '2rem', fontSize: '2rem', fontWeight: 'bold' }}>Deploy Panel Bot - By IKYY</h1>

      {!login ? (
        <form onSubmit={handleLogin} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          width: '100%',
          maxWidth: '400px',
          background: '#fff',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 0 15px rgba(0,0,0,0.1)'
        }}>
          <input placeholder="Username" required onChange={e => setInputLogin({ ...inputLogin, username: e.target.value })} />
          <input placeholder="Password" type="password" required onChange={e => setInputLogin({ ...inputLogin, password: e.target.value })} />
          <button style={{ padding: '0.8rem', backgroundColor: '#4b0082', color: 'white', borderRadius: '8px' }}>Login</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      ) : (
        <form onSubmit={handleDeploy} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          width: '100%',
          maxWidth: '400px',
          background: '#fff',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 0 15px rgba(0,0,0,0.1)'
        }}>
          <input placeholder="Username" required onChange={e => setForm({ ...form, username: e.target.value })} />

          <select onChange={handlePlan} defaultValue="" required>
            <option value="" disabled>Pilih Plan</option>
            {Object.keys(plans).map(key => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>

          <input placeholder="RAM (MB)" type="number" required value={form.ram} disabled />
          <input placeholder="CPU (%)" type="number" required value={form.cpu} disabled />

          <p style={{ fontSize: '0.9rem', color: '#555' }}>💡 0 MB / 0% = Unlimited</p>
          <button style={{ padding: '0.8rem', backgroundColor: '#4b0082', color: 'white', borderRadius: '8px' }}>Deploy</button>
        </form>
      )}

      {typedResult && (
        <>
          <pre style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: 'white',
            borderRadius: '12px',
            maxWidth: '600px',
            width: '100%',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            fontFamily: 'monospace',
            fontSize: '0.95rem'
          }}>
            {typedResult}
          </pre>

          <button
            onClick={() => {
              navigator.clipboard.writeText(copyText)
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            }}
            style={{
              marginTop: '1rem',
              backgroundColor: '#4b0082',
              color: 'white',
              border: 'none',
              padding: '0.6rem 1.2rem',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            📋 Salin Detail Deploy
          </button>

          {copied && <p style={{ color: 'green', fontWeight: 'bold', marginTop: '0.5rem' }}>✅ Berhasil Disalin!</p>}
        </>
      )}
    </div>
  )
                                                                           }
