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
        <meta name="description" content="Premium Deployment panel for bot management" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-6 font-sans">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600 rounded-full filter blur-3xl opacity-10 animate-float1"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-600 rounded-full filter blur-3xl opacity-10 animate-float2"></div>
          <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-blue-600 rounded-full filter blur-3xl opacity-10 animate-float3"></div>
        </div>

        <div className="w-full max-w-md z-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              Deploy Panel
            </h1>
            <p className="text-gray-400 text-lg">Enterprise-grade bot deployment</p>
          </div>

          {/* Card Container */}
          <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl border border-gray-700 backdrop-blur-sm bg-opacity-50">
            {/* Card Header */}
            <div className="px-6 py-4 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">
                {!login ? (signupMode ? 'Create Account' : 'Welcome Back') : 'Deploy New Bot'}
              </h2>
              <p className="text-gray-400 text-sm">
                {!login ? (signupMode ? 'Join our platform' : 'Sign in to continue') : 'Configure your bot deployment'}
              </p>
            </div>

            <div className="p-6">
              {!login ? (
                // Login or Signup Form
                <form onSubmit={signupMode ? handleSignup : handleLogin}>
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                        Username
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <input
                          id="username"
                          type="text"
                          placeholder="Enter your username"
                          className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                          value={inputLogin.username}
                          onChange={e => setInputLogin({ ...inputLogin, username: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                          value={inputLogin.password}
                          onChange={e => setInputLogin({ ...inputLogin, password: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    {signupMode && (
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                          WhatsApp Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                          </div>
                          <input
                            id="phone"
                            type="tel"
                            placeholder="e.g. 6281234567890"
                            className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                            value={inputLogin.phone}
                            onChange={e => setInputLogin({ ...inputLogin, phone: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    )}

                    {error && (
                      <div className="p-3 bg-red-900 bg-opacity-20 border border-red-700 rounded-lg text-red-300 text-sm flex items-start">
                        <svg className="h-5 w-5 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>{error}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-600 transition-all shadow-lg hover:shadow-purple-500/20 flex items-center justify-center"
                    >
                      {signupMode ? (
                        <>
                          <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                          </svg>
                          Create Account
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          Sign In
                        </>
                      )}
                    </button>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSignupMode(!signupMode);
                          setError('');
                        }}
                        className="text-sm text-gray-400 hover:text-purple-400 transition-colors"
                      >
                        {signupMode ? (
                          <span className="flex items-center justify-center">
                            <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Already have an account? Sign in
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Don't have an account? Sign up
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                // Deploy Form
                <form onSubmit={handleDeploy}>
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="deploy-username" className="block text-sm font-medium text-gray-300 mb-2">
                        Bot Username
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                          </svg>
                        </div>
                        <input
                          id="deploy-username"
                          type="text"
                          placeholder="Enter bot username"
                          className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                          value={form.username}
                          onChange={e => setForm({ ...form, username: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="ram" className="block text-sm font-medium text-gray-300 mb-2">
                          RAM Allocation
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <input
                            id="ram"
                            type="number"
                            placeholder="e.g. 512"
                            className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                            value={form.ram}
                            onChange={e => setForm({ ...form, ram: e.target.value })}
                            required
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-400 text-sm">MB</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="cpu" className="block text-sm font-medium text-gray-300 mb-2">
                          CPU Allocation
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <input
                            id="cpu"
                            type="number"
                            placeholder="e.g. 50"
                            min="1"
                            max="100"
                            className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                            value={form.cpu}
                            onChange={e => setForm({ ...form, cpu: e.target.value })}
                            required
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-400 text-sm">%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-600 transition-all shadow-lg hover:shadow-purple-500/20 flex items-center justify-center ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Deploying...
                        </span>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          Deploy Bot
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className="mt-8 bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
              <div className="px-6 py-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Deployment Successful
                </h3>
              </div>
              <div className="p-6 bg-gray-900 bg-opacity-50">
                <pre className="text-sm text-gray-300 font-mono p-4 bg-gray-800 rounded-lg overflow-x-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setResult(null)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-white transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Deploy Panel Bot. All rights reserved.</p>
          </div>
        </div>

        {/* Add these animations to your global CSS */}
        <style jsx global>{`
          @keyframes float1 {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(20px, 20px) rotate(5deg); }
          }
          @keyframes float2 {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(-20px, 10px) rotate(-5deg); }
          }
          @keyframes float3 {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(10px, -20px) rotate(3deg); }
          }
          .animate-float1 { animation: float1 15s ease-in-out infinite; }
          .animate-float2 { animation: float2 18s ease-in-out infinite; }
          .animate-float3 { animation: float3 12s ease-in-out infinite; }
        `}</style>
      </div>
    </>
  );
            }
