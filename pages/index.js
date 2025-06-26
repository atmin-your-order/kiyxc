import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [users, setUsers] = useState([
    ['admin123', 'kiyy'],
    ['testpass', 'tester']
  ]);
  const [login, setLogin] = useState(false);
  const [signupMode, setSignupMode] = useState(false);
  const [inputLogin, setInputLogin] = useState({ username: '', password: '', phone: '' });
  const [form, setForm] = useState({ username: '', ram: '', cpu: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    const found = users.find(([pass, user]) =>
      user === inputLogin.username && pass === inputLogin.password
    );
    if (found) {
      setLogin(true);
      setError('');
    } else {
      setError('Invalid username or password!');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const exist = users.find(([_, user]) => user === inputLogin.username);
    if (exist) {
      setError('Username already taken!');
      return;
    }

    const newUsers = [...users, [inputLogin.password, inputLogin.username]];
    setUsers(newUsers);
    setError('');
    setSignupMode(false);

    // Kirim notifikasi WA via API
    try {
      await fetch('/api/twilio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: inputLogin.phone,
          message: `✅ Hai ${inputLogin.username}, akun kamu berhasil didaftarkan di Deploy Panel Bot!`
        })
      });
    } catch (err) {
      console.error('Failed to send WhatsApp message');
    }

    alert('Akun berhasil dibuat! Silakan login.');
  };

  const handleDeploy = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError('Failed to deploy. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Deploy Panel Bot</title>
        <meta name="description" content="Deployment panel for bot management" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Deploy Panel Bot</h1>
            <p className="text-purple-200">Manage your bot deployments with ease</p>
          </div>

          {/* Card Container */}
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
            {!login ? (
              // Login or Signup Form
              <form onSubmit={signupMode ? handleSignup : handleLogin} className="p-8">
                <div className="mb-6">
                  <label htmlFor="username" className="block text-gray-700 text-sm font-medium mb-2">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                    value={inputLogin.username}
                    onChange={e => setInputLogin({ ...inputLogin, username: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                    value={inputLogin.password}
                    onChange={e => setInputLogin({ ...inputLogin, password: e.target.value })}
                    required
                  />
                </div>

                {signupMode && (
                  <div className="mb-6">
                    <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-2">
                      Nomor WhatsApp
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="e.g. 6281234567890"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                      value={inputLogin.phone}
                      onChange={e => setInputLogin({ ...inputLogin, phone: e.target.value })}
                      required
                    />
                  </div>
                )}

                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                >
                  {signupMode ? 'Sign Up' : 'Sign In'}
                </button>

                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSignupMode(!signupMode);
                      setError('');
                    }}
                    className="text-sm text-purple-600 hover:underline"
                  >
                    {signupMode ? 'Sudah punya akun? Login' : 'Belum punya akun? Daftar di sini'}
                  </button>
                </div>
              </form>
            ) : (
              // Deploy Form
              <form onSubmit={handleDeploy} className="p-8">
                <div className="mb-6">
                  <label htmlFor="deploy-username" className="block text-gray-700 text-sm font-medium mb-2">
                    Bot Username
                  </label>
                  <input
                    id="deploy-username"
                    type="text"
                    placeholder="Enter bot username"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                    value={form.username}
                    onChange={e => setForm({ ...form, username: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="ram" className="block text-gray-700 text-sm font-medium mb-2">
                    RAM Allocation (MB)
                  </label>
                  <input
                    id="ram"
                    type="number"
                    placeholder="e.g. 512"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                    value={form.ram}
                    onChange={e => setForm({ ...form, ram: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="cpu" className="block text-gray-700 text-sm font-medium mb-2">
                    CPU Allocation (%)
                  </label>
                  <input
                    id="cpu"
                    type="number"
                    placeholder="e.g. 50"
                    min="1"
                    max="100"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                    value={form.cpu}
                    onChange={e => setForm({ ...form, cpu: e.target.value })}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deploying...
                    </span>
                  ) : 'Deploy Bot'}
                </button>
              </form>
            )}
          </div>

          {/* Result */}
          {result && (
            <div className="mt-8 bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Deployment Result</h3>
              <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center text-purple-200 text-sm">
            <p>© {new Date().getFullYear()} Bot Deployment Panel</p>
          </div>
        </div>
      </div>
    </>
  );
              }
