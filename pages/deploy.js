import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

export default function Deploy({ loggedIn }) {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', ram: 1024, cpu: 50 });
  const [loading, setLoading] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (!loggedIn) {
      router.push('/login');
    }
  }, [loggedIn, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'username' ? value : parseInt(value) }));
  };

  const handleDeploy = async (e) => {
    e.preventDefault();
    if (deploying) return;
    
    setError('');
    setLoading(true);
    setDeploying(true);

    try {
      const response = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Gagal melakukan deploy');
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    
    const text = `Username: ${result.username}\nPassword: ${result.password}\nServer ID: ${result.server_id}\nHost: ${result.host}\nRAM: ${result.ram}MB\nCPU: ${result.cpu}%`;
    
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Berhasil Disalin ✅');
      })
      .catch(() => {
        alert('Gagal menyalin');
      });
  };

  if (!loggedIn) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Auto-Deploy Server</h1>
          <p className="text-gray-600">Buat server Node.js 18 secara instan dengan Pterodactyl</p>
        </motion.div>

        {!result ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6 sm:p-8">
              <form onSubmit={handleDeploy} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={deploying}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      RAM (MB)
                    </label>
                    <input
                      type="number"
                      name="ram"
                      min="512"
                      max="16384"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={formData.ram}
                      onChange={handleChange}
                      disabled={deploying}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CPU (%)
                    </label>
                    <input
                      type="number"
                      name="cpu"
                      min="10"
                      max="200"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={formData.cpu}
                      onChange={handleChange}
                      disabled={deploying}
                    />
                  </div>
                </div>
                
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg">
                    {error}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={deploying}
                  className={`w-full py-3 px-4 text-white font-medium rounded-lg transition duration-300 ${
                    deploying
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {deploying ? 'Processing...' : 'Deploy Server'}
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6 sm:p-8">
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold text-green-600 mb-6"
                >
                  🎉 AKUN BERHASIL DIBUAT 🎉
                </motion.div>
                
                <div className="space-y-4 text-left">
                  {[
                    ['👤', 'Username', result.username],
                    ['🧠', 'Password', result.password],
                    ['🛠️', 'Server ID', result.server_id],
                    ['🌐', 'Host', result.host],
                    ['📦', 'RAM', `${result.ram} MB`],
                    ['⚡', 'CPU', `${result.cpu}%`],
                  ].map(([icon, label, value], index) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start"
                    >
                      <span className="text-2xl mr-3">{icon}</span>
                      <div>
                        <div className="font-semibold text-gray-800">{label}</div>
                        <div className="text-gray-600 font-mono">{value}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  onClick={copyToClipboard}
                  className="mt-8 py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition duration-300"
                >
                  Salin Detail
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
        
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          >
            <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-700">Membuat server...</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
          }
