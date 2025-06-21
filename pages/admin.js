import { useState } from 'react'

const admins = [
  ['fullpower', 'ikyyz']
]

export default function AdminPage() {
  const [login, setLogin] = useState(false)
  const [inputLogin, setInputLogin] = useState({ username: '', password: '' })
  const [form, setForm] = useState({
    domain: '',
    apikey: '',
    nodeName: '',
    nestName: '',
    eggName: ''
  })
  const [message, setMessage] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    const found = admins.find(([pass, user]) =>
      user === inputLogin.username && pass === inputLogin.password
    )
    if (found) {
      setLogin(true)
      setMessage('')
    } else {
      setMessage('Login gagal. Username/password salah.')
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/config-update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const result = await res.json()
    if (result.success) {
      setMessage('✅ Config berhasil diupdate!')
    } else {
      setMessage('❌ Gagal update config: ' + result.error)
    }
  }

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '600px',
      margin: 'auto',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <h2>🔐 Admin Panel - Edit Config</h2>

      {!login ? (
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
          <input
            placeholder="Username"
            required
            onChange={e => setInputLogin({ ...inputLogin, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            required
            onChange={e => setInputLogin({ ...inputLogin, password: e.target.value })}
          />
          <button>Login</button>
          {message && <p>{message}</p>}
        </form>
      ) : (
        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
          <input placeholder="Domain Panel" required onChange={e => setForm({ ...form, domain: e.target.value })} />
          <input placeholder="API Key" required onChange={e => setForm({ ...form, apikey: e.target.value })} />
          <input placeholder="Nama Node" required onChange={e => setForm({ ...form, nodeName: e.target.value })} />
          <input placeholder="Nama Nest" required onChange={e => setForm({ ...form, nestName: e.target.value })} />
          <input placeholder="Nama Egg" required onChange={e => setForm({ ...form, eggName: e.target.value })} />
          <button>📝 Simpan</button>
          {message && <p>{message}</p>}
        </form>
      )}
    </div>
  )
}
