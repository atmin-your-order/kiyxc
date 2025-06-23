import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  // === State ===
  const [authView, setAuthView] = useState('login'); // 'login' or 'signup'
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
  const [adminVerified, setAdminVerified] = useState(false);
  const [adminInputPassword, setAdminInputPassword] = useState('');

  // === Ref ===
  const emailRef = useRef(null);

  // === Admin Check ===
  const isEmailAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  // lanjut ke useEffect() dan logika lainnya...
  
  // Refs untuk auto-focus
  const deployUsernameRef = useRef(null);

  // Check for existing session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auto-focus saat login berhasil
  useEffect(() => {
    if (session) {
      deployUsernameRef.current?.focus();
    } else {
      emailRef.current?.focus();
    }
  }, [session]);

  // Reset form on successful auth
  useEffect(() => {
    if (session) {
      setInputLogin({ email: '', password: '' });
      setInputSignup({ email: '', password: '' });
    }
  }, [session]);

  // Animasi Progress Bar (Auth)
  useEffect(() => {
    if (authProgress > 0 && authProgress < 100) {
      const timer = setTimeout(() => {
        setAuthProgress(prev => Math.min(prev + Math.random() * 15 + 5, 100));
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [authProgress]);

  // Animasi Progress Bar (Deploy)
  useEffect(() => {
    if (isLoading && progress < 100) {
      const timer = setTimeout(() => {
        setProgress(prev => Math.min(prev + Math.random() * 10 + 1, 100));
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading, progress]);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthProgress(10);
    setError('');
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: inputLogin.email,
        password: inputLogin.password
      });

      const interval = setInterval(() => {
        setAuthProgress(prev => {
          const newProgress = prev + Math.random() * 15 + 5;
          if (newProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              if (error) {
                setError(error.message);
              }
              setAuthProgress(0);
            }, 500);
            return 100;
          }
          return newProgress;
        });
      }, 200);
    } catch (err) {
      setError(err.message);
      setAuthProgress(0);
    }
  };

  // Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setAuthProgress(10);
    setError('');
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: inputSignup.email,
        password: inputSignup.password
      });
      if (data?.user) {
  await fetch('/api/request-access', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: inputSignup.email,
      name: inputSignup.email.split('@')[0]
    })
  });
}

      const interval = setInterval(() => {
        setAuthProgress(prev => {
          const newProgress = prev + Math.random() * 15 + 5;
          if (newProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              if (error) {
                setError(error.message);
              } else {
                setError('Wait for the admin to approve your registration!');
                setAuthView('login');
              }
              setAuthProgress(0);
            }, 500);
            return 100;
          }
          return newProgress;
        });
      }, 200);
    } catch (err) {
      setError(err.message);
      setAuthProgress(0);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setResult(null);
    setTypedResult('');
  };
  //Handle Approve
  const approve = async (email) => {
  const res = await fetch('/api/approve-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (data.success) alert('✅ Berhasil disetujui!');
  else alert('❌ Gagal approve: ' + data.error);
};

  // Handle Deploy
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

  // Typing Effect
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

  // Copy to Clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(typedResult);
    alert('✅ Berhasil disalin!');
  };

  // Komponen Progress Bar
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
      {/* Global Styles */}
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

      {/* Main Container */}
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
   {/* ADMIN LOGIN */}
    {isEmailAdmin && !adminVerified && (
      <div style={{ marginTop: '2rem', background: '#222', padding: '1rem', borderRadius: '10px' }}>
        <h3 style={{ color: '#fff' }}>🔐 Masukkan Password Admin</h3>
        <input
          type="password"
          placeholder="Password Admin"
          value={adminInputPassword}
          onChange={(e) => setAdminInputPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: 'none',
            marginBottom: '10px',
            background: '#444',
            color: 'white'
          }}
        />
        <button
          onClick={() => {
            if (adminInputPassword === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
              setAdminVerified(true);
            } else {
              alert('❌ Password salah!');
            }
          }}
          style={{
            background: '#28a745',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Verifikasi
        </button>
      </div>
    )}

    {/* ADMIN PANEL */}
    {isEmailAdmin && adminVerified && (
      <div style={{ marginTop: '2rem', padding: '1rem', background: '#111', borderRadius: '10px' }}>
        <h3 style={{ color: '#fff' }}>👑 Panel Admin</h3>
        <ApproveUsers />
      </div>
    )}

        {!session ? (
          // Auth Forms (Login/Signup)
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
              // Login Form
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
              // Signup Form
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
          // Deployment Form
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
                }}>GB</span>
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  placeholder="CPU (0 = Unlimited)"
                  value={form.cpu}
                  onChange={(e) => setForm({...form, cpu: e.target.value})}
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

        {/* Hasil Output */}
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
