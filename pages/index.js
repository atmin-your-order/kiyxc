import { useState } from 'react'

const users = [
  ['kiy123', 'kiyy'],
  ['amane01', 'amane']
]

export default function Home() {
  const [login, setLogin] = useState(false)
  const [inputLogin, setInputLogin] = useState({ username: '', password: '' })
  const [form, setForm] = useState({ username: '', ram: '', cpu: '' })
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

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
  }

  const handleCopy = () => {
    const text = `
🔥 AKUN BERHASIL DIBUAT 🔥

👤 Username: ${result.username}
🔐 Password: ${result.password}
🖥️ Server ID: ${result.serverId}
🌐 Host: ${result.host}

💾 RAM: ${result.ram === '0' ? 'Unlimited' : result.ram + ' MB'}
⚙️ CPU: ${result.cpu === '0' ? 'Unlimited' : result.cpu + '%'}
📊 Status: ${result.status}
📅 Dibuat: ${result.createdAt}
⏳ Aktif 30 Hari
📆 Expired: ${result.expiredAt}

🚫 Jangan gunakan untuk aktivitas ilegal:
• DDoS / Flood / Serangan ke Server
• Penipuan, Carding, atau Abuse Layanan
• Phishing / Malware

📌 Jika melanggar, server akan otomatis dihapus tanpa pemberitahuan!
    `
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
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
        <div style={{
          marginTop: '2rem',
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 0 15px rgba(0,0,0,0.1)',
          maxWidth: '600px',
          width: '100%',
          position: 'relative'
        }}>
          <h2 style={{ marginBottom: '1rem', color: '#4b0082' }}>🎉 AKUN BERHASIL DIBUAT 🎉</h2>
          <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
{`👤 Username: ${result.username}
🔐 Password: ${result.password}
🖥️ Server ID: ${result.serverId}
🌐 Host: ${result.host}

💾 RAM: ${result.ram === '0' ? 'Unlimited' : result.ram + ' MB'}
⚙️ CPU: ${result.cpu === '0' ? 'Unlimited' : result.cpu + '%'}
📊 Status: ${result.status}
📅 Dibuat: ${result.createdAt}
⏳ Aktif 30 Hari
📆 Expired: ${result.expiredAt}

🚫 Jangan gunakan untuk aktivitas ilegal:
• DDoS / Flood / Serangan ke Server
• Penipuan, Carding, atau Abuse Layanan
• Phishing / Malware

📌 Jika melanggar, server akan otomatis dihapus tanpa pemberitahuan!`}
          </pre>
          <button onClick={handleCopy} style={{
            marginTop: '1rem',
            padding: '0.6rem 1rem',
            backgroundColor: '#4b0082',
            color: 'white',
            borderRadius: '8px',
            border: 'none'
          }}>📋 Salin Detail</button>
          {copied && <p style={{ color: 'green', marginTop: '0.5rem' }}>✅ Berhasil Disalin</p>}
        </div>
      )}
    </div>
  )
        }
