import { useState, useEffect, useRef } from 'react';

// Users sekarang diambil dari environment variable
const users = JSON.parse(process.env.NEXT_PUBLIC_USERS || '[]');

export default function Home() {
  // === State ===
  const [login, setLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false); // State untuk toggle signup form
  const [inputLogin, setInputLogin] = useState({ username: '', password: '' });
  const [signupData, setSignupData] = useState({ username: '', password: '' }); // State untuk signup form
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: '', ram: '', cpu: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [typedResult, setTypedResult] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loginProgress, setLoginProgress] = useState(0);
  const [signupSuccess, setSignupSuccess] = useState(false);
  
  // Refs untuk auto-focus
  const usernameRef = useRef(null);
  const deployUsernameRef = useRef(null);
  const signupUsernameRef = useRef(null);

  // Auto-focus saat login berhasil atau form berubah
  useEffect(() => {
    if (login) {
      deployUsernameRef.current?.focus();
    } else if (showSignup) {
      signupUsernameRef.current?.focus();
    } else {
      usernameRef.current?.focus();
    }
  }, [login, showSignup]);

  // Reset form on successful login
  useEffect(() => {
    if (login) {
      setInputLogin({ username: '', password: '' });
    }
  }, [login]);

  // Animasi Progress Bar (Login)
  useEffect(() => {
    if (loginProgress > 0 && loginProgress < 100) {
      const timer = setTimeout(() => {
        setLoginProgress(prev => Math.min(prev + Math.random() * 15 + 5, 100));
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [loginProgress]);

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
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginProgress(10); // Start progress
    
    const found = users.find(([pass, user]) => 
      user === inputLogin.username && pass === inputLogin.password
    );

    const interval = setInterval(() => {
      setLoginProgress(prev => {
        const newProgress = prev + Math.random() * 15 + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (found) {
              setLogin(true);
              setError('');
            } else {
              setError('Username atau password salah!');
            }
            setLoginProgress(0);
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };

  // Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Kirim data signup ke API untuk notifikasi WhatsApp
      const res = await fetch('/api/signup-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: signupData.username,
          password: signupData.password,
          timestamp: new Date().toISOString()
        })
      });
      
      if (res.ok) {
        setSignupSuccess(true);
        setShowSignup(false);
        // Reset form
        setSignupData({ username: '', password: '' });
        
        // Simpan data sementara (ini hanya contoh, di production seharusnya disimpan di database)
        users.push([signupData.password, signupData.username]);
      } else {
        setError('Gagal mengirim permintaan signup');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat signup');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Deploy (TIDAK DIUBAH UNTUK JAGA API)
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

  // Typing Effect (TIDAK DIUBAH)
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
        .toggle-form {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: underline;
          margin-top: 10px;
          font-size: 0.9rem;
          cursor: pointer;
        }
        .toggle-form:hover {
          color: white;
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

        {!login ? (
          // Tampilkan login atau signup form
          showSignup ? (
            // Signup Form
            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>🔐 Buat Akun Baru</h2>
              
              <div>
                <input
                  ref={signupUsernameRef}
                  type="text"
                  placeholder="Username"
                  value={signupData.username}
                  onChange={(e) => setSignupData({...signupData, username: e.target.value})}
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
                  value={signupData.password}
                  onChange={(e) => setSignupData({...signupData, password: e.target.value})}
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
                disabled={isLoading}
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
                {isLoading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
              </button>

              <button 
                type="button" 
                className="toggle-form" 
                onClick={() => setShowSignup(false)}
              >
                Sudah punya akun? Login disini
              </button>

              {error && <p style={{ color: '#FF6B6B', textAlign: 'center', marginTop: '10px' }}>{error}</p>}
              {signupSuccess && (
                <p style={{ color: '#4BB543', textAlign: 'center', marginTop: '10px' }}>
                  Permintaan signup berhasil dikirim! Admin akan menghubungi Anda.
                </p>
              )}
            </form>
          ) : (
            // Login Form
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <input
                  ref={usernameRef}
                  type="text"
                  placeholder="Username"
                  value={inputLogin.username}
                  onChange={(e) => setInputLogin({...inputLogin, username: e.target.value})}
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
                {loginProgress > 0 ? `Memverifikasi... ${Math.min(loginProgress, 100)}%` : 'Login'}
              </button>

              <button 
                type="button" 
                className="toggle-form" 
                onClick={() => {
                  setShowSignup(true);
                  setError('');
                  setSignupSuccess(false);
                }}
              >
                Belum punya akun? Daftar disini
              </button>

              {loginProgress > 0 && <ProgressBar percentage={loginProgress} color="linear-gradient(90deg, #FF8A00, #FF0058)" />}
              {error && <p style={{ color: '#FF6B6B', textAlign: 'center', marginTop: '10px' }}>{error}</p>}
            </form>
          )
        ) : (
          // Deployment Form
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
                marginTop: '15px,
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
