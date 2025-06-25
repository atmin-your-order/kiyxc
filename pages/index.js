import { useState, useEffect, useRef } from 'react';

// Initialize Supabase clients
import supabase from '../lib/supabase-client'

// Add validation

export default function Home() {
  // === State ===
  const [authView, setAuthView] = useState('login');
  const [session, setSession] = useState(null);
  const [inputLogin, setInputLogin] = useState({ email: '', password: '' });
  const [inputSignup, setInputSignup] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: '', ram: '', cpu: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [typedResult, setTypedResult] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [authProgress, setAuthProgress] = useState(0);
  const [username, setUsername] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState('');
  const [approved, setApproved] = useState(null)
  
  // Refs
  const emailRef = useRef(null);
  const deployUsernameRef = useRef(null);

  //server-side
  const handleSubmit = async () => {
    const res = await fetch('/api/access-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, reason }),
    });

    const json = await res.json();
    if (res.ok) {
      setStatus('✅ Berhasil dikirim!');
    } else {
      setStatus(`❌ Gagal: ${json.error}`);
    }
  };

  // Check session and approval status
useEffect(() => {
    const checkApproval = async () => {
      try {
        const res = await fetch('/api/auth/check-approval', {
          method: 'POST',
          body: JSON.stringify({ user_id: 'user-id-di-sini' }),
          headers: { 'Content-Type': 'application/json' },
        })
        const { approved } = await res.json()
        setApproved(approved)

        if (!approved) {
          alert('Akun belum disetujui')
        }
      } catch (err) {
        console.error('Error cek approval:', err)
      }
    }

    checkApproval()
  }, [])
  // Auto-focus
  useEffect(() => {
    if (session) {
      deployUsernameRef.current?.focus();
    } else {
      emailRef.current?.focus();
    }
  }, [session]);

  // Reset form on auth
  useEffect(() => {
    if (session) {
      setInputLogin({ email: '', password: '' });
      setInputSignup({ email: '', password: '' });
    }
  }, [session]);

  // Progress bars
  useEffect(() => {
    if (authProgress > 0 && authProgress < 100) {
      const timer = setTimeout(() => {
        setAuthProgress(prev => Math.min(prev + Math.random() * 15 + 5, 100));
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [authProgress]);

  useEffect(() => {
    if (isLoading && progress < 100) {
      const timer = setTimeout(() => {
        setProgress(prev => Math.min(prev + Math.random() * 10 + 1, 100));
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading, progress]);

  // Auth handlers
  const handleLogin = async (e) => {
  e.preventDefault();
  
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: inputLogin.email,
        password: inputLogin.password
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Login failed');
    }

    // Set session di client
    const { data, error } = await supabase.auth.setSession(result.session);
    
    if (error) throw error;

    // Redirect atau update UI
    router.push('/dashboard');
    
  } catch (error) {
    setError(error.message);
  }
};
//habdle signup
const handleSignup = async (e) => {
  e.preventDefault();
  setAuthProgress(10);
  setError('');

  try {
    // Kirim request ke API route yang aman
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: inputSignup.email,
        password: inputSignup.password
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Signup failed');
    }

    // Tampilkan sukses
    setAuthProgress(100);
    setTimeout(() => {
      setError('🎉 Pendaftaran berhasil! Tunggu approval admin.');
      setAuthView('login');
      setAuthProgress(0);
    }, 1000);
    
  } catch (err) {
    setError(err.message);
    setAuthProgress(0);
    console.error('Signup error:', err);
  }
};
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setResult(null);
    setTypedResult('');
  };

  // Deployment handler
  const handleDeploy = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setProgress(0);
    setResult(null);
    setTypedResult('');
    setIsTyping(false);

    setTimeout(async () => {
      const res = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      setResult(data);
      setProgress(100);
      setIsTyping(true);
      setIsLoading(false);
    }, 2500);
  };

  // Typing effect
  useEffect(() => {
    if (result && isTyping) {
      const createdAt = new Date();
      const expireAt = new Date(createdAt);
      expireAt.setDate(expireAt.getDate() + 30);

      const formatDate = (d) => d.toLocaleDateString('id-ID');

      const output = `🔥 AKUN BERHASIL DIBUAT 🔥

👤 Username: ${result.username}
🔐 Password: ${result.password}
🌐 Host: ${result.panel || 'Tidak tersedia'}

💾 RAM: ${result.ram === 0 ? 'Unlimited' : `${result.ram} GB`}
⚙️ CPU: ${result.cpu === 0 ? 'Unlimited' : `${result.cpu} %`}
📊 Status: Aktif ✅
📅 Dibuat: ${formatDate(createdAt)}
⏳ Aktif 30 Hari
📆 Expired: ${formatDate(expireAt)}

🚫 Jangan gunakan untuk aktivitas ilegal:
• DDoS / Flood / Serangan ke Server
• Penipuan, Carding, atau Abuse
• Phishing / Malware
• No Rusuh

📌 Jika melanggar, server akan dihapus tanpa pemberitahuan!

• Ikuti Saluran Admin
> https://whatsapp.com/channel/0029VbARjA7GU3BGDOI4sk2P

👑 Author: IKYY
`;

      let i = 0;
      const typing = setInterval(() => {
        setTypedResult(output.slice(0, i));
        i++;
        if (i > output.length) {
          clearInterval(typing);
          setIsTyping(false);
        }
      }, 10);
    }
  }, [result, isTyping]);

  // Copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(typedResult);
    alert('✅ Berhasil disalin!');
  };

  // Progress bar component
  const ProgressBar = ({ percentage, color }) => (
    <div style={{
      width: '100%',
      height: '8px',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '10px',
      overflow: 'hidden',
      margin: '10px 0'
    }}>
      <div style={{
        width: `${percentage}%`,
        height: '100%',
        background: color || 'linear-gradient(90deg, #8A2BE2, #4B0082)',
        borderRadius: '10px',
        transition: 'width 0.3s ease'
      }} />
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: "'Segoe UI', sans-serif",
      padding: '20px'
    }}>
      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          overflow-x: hidden;
        }
        input, select, button {
          font-family: inherit;
          font-size: 1rem;
        }
        button {
          cursor: pointer;
          transition: all 0.3s;
        }
        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>

      <div style={{
        width: '100%',
        maxWidth: '500px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: 'white'
      }}>
     <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input placeholder="Alasan" onChange={(e) => setReason(e.target.value)} />
      <button onClick={handleSubmit}>Kirim</button>
      <p>{status}</p>
        <h1 style={{
          textAlign: 'center',
          marginBottom: '2rem',
          fontSize: '1.8rem',
          fontWeight: '600',
          background: 'linear-gradient(90deg, #fff, #ccc)',
          WebkitBackgroundClip: 'text',
          color: 'transparent'
        }}>
          🚀 Panel Deployment
        </h1>

        {!session ? (
          <>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              gap: '1rem'
            }}>
              <button
                onClick={() => setAuthView('login')}
                style={{
                  padding: '10px 20px',
                  background: authView === 'login' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontWeight: '600'
                }}
              >
                Login
              </button>
              <button
                onClick={() => setAuthView('signup')}
                style={{
                  padding: '10px 20px',
                  background: authView === 'signup' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontWeight: '600'
                }}
              >
                Sign Up
              </button>
            </div>

            {authView === 'login' ? (
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <input
                    ref={emailRef}
                    type="email"
                    placeholder="Email"
                    value={inputLogin.email}
                    onChange={(e) => setInputLogin({...inputLogin, email: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      marginBottom: '5px'
                    }}
                    required
                  />
                </div>

                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={inputLogin.password}
                    onChange={(e) => setInputLogin({...inputLogin, password: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      paddingRight: '40px'
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      fontSize: '0.8rem'
                    }}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>

                <button
                  type="submit"
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(90deg, #8A2BE2, #4B0082)',
                    color: 'white',
                    fontWeight: '600',
                    marginTop: '10px'
                  }}
                >
                  {authProgress > 0 ? `Memverifikasi... ${Math.min(authProgress, 100)}%` : 'Login'}
                </button>

                {authProgress > 0 && <ProgressBar percentage={authProgress} color="linear-gradient(90deg, #FF8A00, #FF0058)" />}
                {error && <p style={{ color: '#FF6B6B', textAlign: 'center', marginTop: '10px' }}>{error}</p>}
              </form>
            ) : (
              <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={inputSignup.email}
                    onChange={(e) => setInputSignup({...inputSignup, email: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      marginBottom: '5px'
                    }}
                    required
                  />
                </div>

                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={inputSignup.password}
                    onChange={(e) => setInputSignup({...inputSignup, password: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      paddingRight: '40px'
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      fontSize: '0.8rem'
                    }}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>

                <button
                  type="submit"
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(90deg, #8A2BE2, #4B0082)',
                    color: 'white',
                    fontWeight: '600',
                    marginTop: '10px'
                  }}
                >
                  {authProgress > 0 ? `Mendaftar... ${Math.min(authProgress, 100)}%` : 'Sign Up'}
                </button>

                {authProgress > 0 && <ProgressBar percentage={authProgress} color="linear-gradient(90deg, #FF8A00, #FF0058)" />}
                {error && <p style={{ color: '#FF6B6B', textAlign: 'center', marginTop: '10px' }}>{error}</p>}
              </form>
            )}
          </>
        ) : (
          <>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Logged in as: {session.user.email}
              </p>
              <button
                onClick={handleLogout}
                style={{
                  padding: '8px 12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '0.8rem'
                }}
              >
                Logout
              </button>
            </div>

            <form onSubmit={handleDeploy} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                ref={deployUsernameRef}
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({...form, username: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white'
                }}
                required
                disabled={isLoading}
              />

              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  placeholder="RAM (0 = Unlimited)"
                  value={form.ram}
                  onChange={(e) => setForm({...form, ram: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    paddingRight: '50px'
                  }}
                  required
                  disabled={isLoading}
                />
                <span style={{
                  position: 'absolute',
                  right: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(255, 255, 255, 0.7)'
                }}>%</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isLoading 
                    ? 'linear-gradient(90deg, #4B0082, #8A2BE2)'
                    : 'linear-gradient(90deg, #8A2BE2, #4B0082)',
                  color: 'white',
                  fontWeight: '600',
                  marginTop: '10px'
                }}
              >
                {isLoading ? `Membuat Panel... ${progress}%` : 'Deploy Sekarang'}
              </button>

              {isLoading && (
                <>
                  <ProgressBar percentage={progress} />
                  <p style={{ 
                    textAlign: 'center', 
                    fontSize: '0.9rem',
                    color: 'rgba(255, 255, 255, 0.8)'
                  }}>
                    {progress < 30 && 'Menginisialisasi server...'}
                    {progress >= 30 && progress < 70 && 'Mengalokasikan resource...'}
                    {progress >= 70 && progress < 100 && 'Menyelesaikan konfigurasi...'}
                    {progress === 100 && 'Selesai!'}
                  </p>
                </>
              )}
            </form>
          </>
        )}

        {typedResult && (
          <div style={{
            marginTop: '2rem',
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '15px',
            padding: '1.5rem',
            whiteSpace: 'pre-wrap',
            fontSize: '0.9rem',
            lineHeight: '1.6',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #8A2BE2, #4B0082)'
            }} />
            {typedResult}
            <button
              onClick={copyToClipboard}
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                marginTop: '15px',
                width: '100%',
                fontWeight: '600',
                backdropFilter: 'blur(5px)'
              }}
            >
              📋 Salin Hasil
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
          
