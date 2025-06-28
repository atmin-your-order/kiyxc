import { useState, useEffect } from 'react';

const users = JSON.parse(process.env.NEXT_PUBLIC_USERS || '[]');

export default function Home() {
  const [login, setLogin] = useState(false);
  const [inputLogin, setInputLogin] = useState({ username: '', password: '' });
  const [form, setForm] = useState({ username: '', ram: '', cpu: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [typedResult, setTypedResult] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loginProgress, setLoginProgress] = useState(0);

  // Reset form on successful login
  useEffect(() => {
    if (login) {
      setInputLogin({ username: '', password: '' });
    }
  }, [login]);

  // Login progress animation
  useEffect(() => {
    if (loginProgress > 0 && loginProgress < 100) {
      const timer = setTimeout(() => {
        const randomIncrement = Math.floor(Math.random() * 15) + 5;
        setLoginProgress(prev => Math.min(prev + randomIncrement, 100));
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [loginProgress]);

  // Deployment progress animation
  useEffect(() => {
    if (isLoading && progress < 100) {
      const timer = setTimeout(() => {
        const randomIncrement = Math.floor(Math.random() * 10) + 1;
        setProgress(prev => Math.min(prev + randomIncrement, 100));
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading, progress]);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginProgress(0);
    
    const found = users.find(([pass, user]) => user === inputLogin.username && pass === inputLogin.password);
    
    const loadingInterval = setInterval(() => {
      setLoginProgress(prev => {
        const newProgress = prev + Math.floor(Math.random() * 15) + 5;
        if (newProgress >= 100) {
          clearInterval(loadingInterval);
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

📌 Jika melanggar, server akan dihapus tanpa pemberitahuan!

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(typedResult);
    alert('Berhasil Disalin ✅');
  };

  const renderProgressBar = (percentage) => {
    return (
      div style={{ 
        display: 'flex', 
        width: '100%',
        margin: '10px 0',
        background: 'rgba(0,0,0,0.1)',
        borderRadius: '10px',
        overflow: 'hidden'
      }}>
        div style={{
          width: `${percentage}%`,
          height: '10px',
          background: 'linear-gradient(90deg, #4b0082, #8a2be2)',
          transition: 'width 0.3s ease',
          borderRadius: '10px'
        }} />
      /div>
    );
  };

  return (
    div style={{
      background: 'linear-gradient(135deg, #e0c3fc, #8ec5fc)',
      minHeight: '100vh',
      margin: 0,
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Segoe UI, sans-serif',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'auto'
    }}>
      style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        input, select {
          padding: 1rem;
          font-size: 1.1rem;
          border-radius: 10px;
          border: 1px solid #ccc;
          width: 100%;
          box-sizing: border-box;
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
          width: 100%;
        }
        
        button:hover {
          background-color: #370061;
        }
        
        button:disabled {
          background-color: #999;
          cursor: not-allowed;
        }
        
        .input-group {
          display: flex;
          align-items: center;
          width: 100%;
          position: relative;
        }
        
        .unit-label {
          position: absolute;
          right: 10px;
          color: #666;
        }
        
        .progress-text {
          text-align: center;
          margin-top: 5px;
          font-size: 0.9rem;
          color: #4b0082;
          font-weight: bold;
        }
        
        .copy-btn {
          margin-top: 15px;
          padding: 0.8rem;
          font-size: 1rem;
          background-color: #4b0082;
          color: white;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: 0.2s;
          width: 100%;
          max-width: 200px;
          align-self: center;
        }
        
        .copy-btn:hover {
          background-color: #370061;
        }
      `}/style>

      div style={{
        width: '100%',
        maxWidth: '600px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        h1 style={{ 
          color: '#4b0082', 
          marginBottom: '2rem', 
          fontSize: '2rem',
          textAlign: 'center'
        }}>
          🚀 Deploy Panel Bot
        /h1>

        {!login ? (
          form onSubmit={handleLogin} style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem', 
            width: '100%',
            maxWidth: '450px'
          }}>
            input 
              placeholder="Username" 
              required 
              value={inputLogin.username}
              onChange={e => setInputLogin({ ...inputLogin, username: e.target.value })} 
            />
            input 
              placeholder="Password" 
              type="password" 
              required 
              value={inputLogin.password}
              onChange={e => setInputLogin({ ...inputLogin, password: e.target.value })} 
            />
            button>
              {loginProgress > 0 ? `Loading ${loginProgress}%` : 'Login'}
            /button>
            {loginProgress > 0 && renderProgressBar(loginProgress)}
            {error && p style={{ color: 'red', textAlign: 'center' }}>{error}/p>}
          /form>
        ) : (
          form onSubmit={handleDeploy} style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem', 
            width: '100%',
            maxWidth: '450px'
          }}>
            input 
              placeholder="Username" 
              required 
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              disabled={isLoading}
            />
            
            div className="input-group">
              input 
                placeholder="RAM (0 = Unlimited)" 
                type="number" 
                required 
                value={form.ram}
                onChange={e => setForm({ ...form, ram: e.target.value })}
                disabled={isLoading}
              />
              span className="unit-label">GB/span>
            /div>
            
            div className="input-group">
              input 
                placeholder="CPU (0 = Unlimited)" 
                type="number" 
                required 
                value={form.cpu}
                onChange={e => setForm({ ...form, cpu: e.target.value })}
                disabled={isLoading}
              />
              span className="unit-label">%/span>
            /div>
            
            button disabled={isLoading}>
              {isLoading ? `Creating Panel... ${progress}%` : 'Deploy'}
            /button>
            
            {isLoading && (
              >
                {renderProgressBar(progress)}
                div className="progress-text">
                  {progress  30 && 'Menginisialisasi server...'}
                  {progress >= 30 && progress  70 && 'Mengalokasikan sumber daya...'}
                  {progress >= 70 && progress  100 && 'Menyelesaikan konfigurasi...'}
                  {progress === 100 && 'Selesai!'}
                /div>
              />
            )}
          /form>
        )}

        {typedResult && (
          div style={{
            marginTop: '2rem',
            background: 'white',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            width: '100%',
            position: 'relative',
            whiteSpace: 'pre-wrap',
            fontSize: '1rem',
            lineHeight: '1.6',
            animation: 'slideIn 0.5s ease',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {typedResult}
            button
              onClick={copyToClipboard}
              className="copy-btn">
              📋 Salin Hasil
            /button>
          /div>
        )}
      /div>
    /div>
  );
}
