import { useState } from 'react'

const adminUser = {
  username: 'ikyyz',
  password: 'powerfull'
}

export default function AdminPage() {
  const [login, setLogin] = useState(false)
  const [input, setInput] = useState({ username: '', password: '' })
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
    if (input.username === adminUser.username && input.password === adminUser.password) {
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
      <h2>🔧 Admin Panel - Ubah Config.js</h2>

      {!login ? (
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
          <input placeholder="Username" onChange={e => setInput({ ...input, username: e.target.value })} required />
          <input type="password" placeholder="Password" onChange={e => setInput({ ...input, password: e.target.value })} required />
          <button>Login</button>
          {message && <p>{message}</p>}
        </form>
      ) : (
        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
          <input placeholder="Domain Panel" onChange={e => setForm({ ...form, domain: e.target.value })} required />
          <input placeholder="API Key" onChange={e => setForm({ ...form, apikey: e.target.value })} required />
          <input placeholder="Nama Node" onChange={e => setForm({ ...form, nodeName: e.target.value })} required />
          <input placeholder="Nama Nest" onChange={e => setForm({ ...form, nestName: e.target.value })} required />
          <input placeholder="Nama Egg" onChange={e => setForm({ ...form, eggName: e.target.value })} required />
          <button>Simpan</button>
          {message && <p>{message}</p>}
        </form>
      )}
    </div>
  )
}
