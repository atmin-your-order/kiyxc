// pages/index.js
import { useState, useEffect } from 'react'
import fs from 'fs'
import path from 'path'

export async function getServerSideProps() {
  const filePath = path.join(process.cwd(), 'public', 'database.json')
  const fileData = fs.readFileSync(filePath, 'utf-8')
  const users = JSON.parse(fileData)
  return { props: { users } }
}

export default function Home({ users }) {
  const [loginData, setLoginData] = useState({ username: '', password: '' })
  const [form, setForm] = useState({ username: '', ram: '', cpu: '' })
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [user, setUser] = useState(null)
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user' })
  const [copyAlert, setCopyAlert] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    const found = users.find(u => u.username === loginData.username && u.password === loginData.password)
    if (found) {
      setUser(found)
      setError('')
    } else {
      setError('Username atau password salah!')
    }
  }

  const handleDeploy = async (e) => {
    e.preventDefault()
    setResult(null)
    const res = await fetch('/api/deploy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    setResult(data)
  }

  const handleAddUser = async () => {
    const res = await fetch('/api/adduser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    })
    const result = await res.json()
    alert(result.message)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2))
    setCopyAlert(true)
    setTimeout(() => setCopyAlert(false), 2000)
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

      {!user ? (
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '400px' }}>
          <input placeholder="Username" required onChange={e => setLoginData({ ...loginData, username: e.target.value })} />
          <input placeholder="Password" type="password" required onChange={e => setLoginData({ ...loginData, password: e.target.value })} />
          <button style={{ padding: '0.8rem', backgroundColor: '#4b0082', color: 'white', borderRadius: '8px' }}>Login</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      ) : (
        <>
          <form onSubmit={handleDeploy} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '400px' }}>
            <input placeholder="Username" required onChange={e => setForm({ ...form, username: e.target.value })} />
            <input placeholder="RAM (MB)" type="number" required onChange={e => setForm({ ...form, ram: e.target.value })} />
            <input placeholder="CPU (%)" type="number" required onChange={e => setForm({ ...form, cpu: e.target.value })} />
            <button style={{ padding: '0.8rem', backgroundColor: '#4b0082', color: 'white', borderRadius: '8px' }}>Deploy</button>
          </form>

          {user.role === 'admin' && (
            <div style={{ marginTop: '2rem', padding: '1rem', border: '1px dashed #4b0082', borderRadius: '8px' }}>
              <h3>Tambah User Baru</h3>
              <input placeholder="Username Baru" onChange={e => setNewUser({ ...newUser, username: e.target.value })} />
              <input placeholder="Password Baru" onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
              <select onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <button onClick={handleAddUser} style={{ marginTop: '0.5rem', padding: '0.5rem', backgroundColor: '#4b0082', color: 'white' }}>Tambah</button>
            </div>
          )}
        </>
      )}

      {result && (
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: 'white',
          borderRadius: '8px',
          maxWidth: '600px',
          width: '100%',
          position: 'relative',
          fontFamily: 'monospace'
        }}>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(result, null, 2)}</pre>
          <button onClick={copyToClipboard} style={{ position: 'absolute', top: '10px', right: '10px', background: '#4b0082', color: 'white', padding: '0.3rem 0.6rem', borderRadius: '4px' }}>Salin</button>
          {copyAlert && <span style={{ position: 'absolute', bottom: '-30px', right: '10px', background: 'green', color: 'white', padding: '0.3rem 0.6rem', borderRadius: '4px' }}>Disalin ✅</span>}
        </div>
      )}
    </div>
  )
        }
