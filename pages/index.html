<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IKYY Deployment Panel</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', sans-serif;
        }

        body {
            min-height: 100vh;
            background: linear-gradient(135deg, #0f0c29, #302b63);
            color: white;
            overflow-x: hidden;
        }

        #particle-canvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
        }

        .container {
            position: relative;
            z-index: 2;
            max-width: 600px;
            margin: 0 auto;
            padding: 2rem;
        }

        .glass-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(12px);
            border-radius: 16px;
            padding: 2rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            margin-bottom: 2rem;
            transition: transform 0.3s ease;
        }

        .glass-card:hover {
            transform: translateY(-5px);
        }

        h1 {
            text-align: center;
            margin-bottom: 1.5rem;
            font-size: 2.2rem;
            background: linear-gradient(90deg, #72ffb6, #10d3ff);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        label {
            display: block;
            margin-bottom: 0.5rem;
            color: rgba(255, 255, 255, 0.9);
        }

        input, select {
            width: 100%;
            padding: 12px 16px;
            border-radius: 10px;
            border: none;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            font-size: 1rem;
            border: 1px solid transparent;
            transition: all 0.3s ease;
        }

        input:focus {
            outline: none;
            border-color: rgba(114, 255, 182, 0.5);
            box-shadow: 0 0 0 3px rgba(114, 255, 182, 0.2);
        }

        .input-with-unit {
            position: relative;
        }

        .unit {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: rgba(255, 255, 255, 0.6);
        }

        button {
            width: 100%;
            padding: 14px;
            border-radius: 10px;
            border: none;
            background: linear-gradient(90deg, #72ffb6, #10d3ff);
            color: #1a1a2e;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(114, 255, 182, 0.4);
        }

        button:disabled {
            background: #ccc;
            transform: none;
            box-shadow: none;
            cursor: not-allowed;
        }

        .progress-container {
            width: 100%;
            margin: 1rem 0;
        }

        .progress-bar {
            height: 8px;
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.1);
            overflow: hidden;
        }

        .progress-fill {
            height: 100%;
            border-radius: 10px;
            background: linear-gradient(90deg, #72ffb6, #10d3ff);
            transition: width 0.3s ease;
        }

        .progress-text {
            text-align: center;
            margin-top: 5px;
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.7);
        }

        .result-box {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 10px;
            padding: 1.5rem;
            margin-top: 1.5rem;
            white-space: pre-wrap;
            font-family: monospace;
            border: 1px solid rgba(114, 255, 182, 0.2);
        }

        .copy-btn {
            margin-top: 1rem;
            padding: 12px;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .copy-btn:hover {
            background: rgba(255, 255, 255, 0.2);
        }
    </style>
</head>
<body>
    <canvas id="particle-canvas"></canvas>
    
    <div class="container">
        <div class="glass-card">
            <h1>IKYY Deployment Panel</h1>
            
            <div id="form-content">
                <!-- Form will be rendered here -->
            </div>
            
            <div id="result-container" style="display: none;">
                <div class="result-box" id="result-box"></div>
                <button class="copy-btn" id="copy-btn">📋 Copy Result</button>
            </div>
        </div>
    </div>

    <script>
        // Particle Background
        const canvas = document.getElementById('particle-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        for (let i = 0; i < 80; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * 2 - 1,
                color: `rgba(114, 255, 182, ${Math.random() * 0.3 + 0.1})`
            });
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(p => {
                p.x += p.speedX;
                p.y += p.speedY;
                
                if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
                if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
                
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });
            
            requestAnimationFrame(animateParticles);
        }
        animateParticles();

        // App Logic
        const users = [
            ['admin123', 'kiyy'],
            ['testpass', 'tester']
        ];

        let login = false;
        let inputLogin = { username: '', password: '' };
        let form = { username: '', ram: '', cpu: '' };
        let result = null;
        let error = '';
        let typedResult = '';
        let isTyping = false;
        let isLoading = false;
        let progress = 0;
        let loginProgress = 0;

        const formContent = document.getElementById('form-content');
        const resultContainer = document.getElementById('result-container');
        const resultBox = document.getElementById('result-box');
        const copyBtn = document.getElementById('copy-btn');

        function renderLoginForm() {
            formContent.innerHTML = `
                <form id="login-form">
                    <div class="form-group">
                        <label>Username</label>
                        <input 
                            type="text" 
                            value="${inputLogin.username}"
                            placeholder="Enter username"
                            required
                        >
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            value="${inputLogin.password}"
                            placeholder="Enter password"
                            required
                        >
                    </div>
                    ${error ? `<p style="color: #ff6b6b; margin-bottom: 1rem;">${error}</p>` : ''}
                    <button type="submit" ${loginProgress > 0 ? 'disabled' : ''}>
                        ${loginProgress > 0 ? `Loading... ${loginProgress}%` : 'Login'}
                    </button>
                    ${loginProgress > 0 ? `
                        <div class="progress-container">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${loginProgress}%"></div>
                            </div>
                        </div>
                    ` : ''}
                </form>
            `;

            const form = document.getElementById('login-form');
            const inputs = form.querySelectorAll('input');
            
            inputs[0].addEventListener('input', (e) => {
                inputLogin.username = e.target.value;
            });
            
            inputs[1].addEventListener('input', (e) => {
                inputLogin.password = e.target.value;
            });
            
            form.addEventListener('submit', handleLogin);
        }

        function renderDeployForm() {
            formContent.innerHTML = `
                <form id="deploy-form">
                    <div class="form-group">
                        <label>Username</label>
                        <input 
                            type="text" 
                            value="${form.username}"
                            placeholder="Enter username"
                            ${isLoading ? 'disabled' : ''}
                            required
                        >
                    </div>
                    <div class="form-group">
                        <label>RAM Allocation</label>
                        <div class="input-with-unit">
                            <input 
                                type="number" 
                                value="${form.ram}"
                                placeholder="0 for unlimited"
                                ${isLoading ? 'disabled' : ''}
                                required
                            >
                            <span class="unit">GB</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>CPU Allocation</label>
                        <div class="input-with-unit">
                            <input 
                                type="number" 
                                value="${form.cpu}"
                                placeholder="0 for unlimited"
                                ${isLoading ? 'disabled' : ''}
                                required
                            >
                            <span class="unit">%</span>
                        </div>
                    </div>
                    <button type="submit" ${isLoading ? 'disabled' : ''}>
                        ${isLoading ? `Deploying... ${progress}%` : 'Deploy Server'}
                    </button>
                    ${isLoading ? `
                        <div class="progress-container">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progress}%"></div>
                            </div>
                            <div class="progress-text">
                                ${progress < 30 ? 'Initializing server...' : 
                                  progress < 70 ? 'Allocating resources...' : 
                                  progress < 100 ? 'Finalizing configuration...' : 
                                  'Done!'}
                            </div>
                        </div>
                    ` : ''}
                </form>
            `;

            const form = document.getElementById('deploy-form');
            const inputs = form.querySelectorAll('input');
            
            inputs[0].addEventListener('input', (e) => {
                form.username = e.target.value;
            });
            
            inputs[1].addEventListener('input', (e) => {
                form.ram = e.target.value;
            });
            
            inputs[2].addEventListener('input', (e) => {
                form.cpu = e.target.value;
            });
            
            form.addEventListener('submit', handleDeploy);
        }

        function handleLogin(e) {
            e.preventDefault();
            setLoginProgress(0);
            
            const found = users.find(([pass, user]) => 
                user === inputLogin.username && pass === inputLogin.password
            );
            
            const interval = setInterval(() => {
                setLoginProgress(prev => {
                    const newVal = prev + Math.floor(Math.random() * 15) + 5;
                    if (newVal >= 100) {
                        clearInterval(interval);
                        setTimeout(() => {
                            if (found) {
                                login = true;
                                error = '';
                                renderDeployForm();
                            } else {
                                error = 'Invalid username or password!';
                                renderLoginForm();
                            }
                            setLoginProgress(0);
                        }, 500);
                        return 100;
                    }
                    return newVal;
                });
            }, 200);
        }

        async function handleDeploy(e) {
            e.preventDefault();
            isLoading = true;
            progress = 0;
            result = null;
            typedResult = '';
            isTyping = false;
            resultContainer.style.display = 'none';
            renderDeployForm();

            // Progress animation
            const progressInterval = setInterval(() => {
                setProgress(prev => {
                    const newVal = prev + Math.floor(Math.random() * 10) + 1;
                    if (newVal >= 100) {
                        clearInterval(progressInterval);
                        return 100;
                    }
                    return newVal;
                });
            }, 300);

            try {
                // Your original POST logic
                const res = await fetch('/api/deploy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(form)
                });
                
                const data = await res.json();
                setResult(data);
                showResult(data);
            } catch (err) {
                console.error('Deployment failed:', err);
                error = 'Deployment failed. Please try again.';
            } finally {
                isLoading = false;
                progress = 100;
                renderDeployForm();
            }
        }

        function showResult(data) {
            resultContainer.style.display = 'block';
            
            const createdAt = new Date();
            const expireAt = new Date(createdAt);
            expireAt.setDate(expireAt.getDate() + 30);

            const formatDate = (d) => d.toLocaleDateString('id-ID');

            const output = `🔥 AKUN BERHASIL DIBUAT 🔥

👤 Username: ${data.username}
🔐 Password: ${data.password}
🌐 Host: ${data.panel || 'Tidak tersedia'}

💾 RAM: ${data.ram === 0 ? 'Unlimited' : `${data.ram} GB`}
⚙️ CPU: ${data.cpu === 0 ? 'Unlimited' : `${data.cpu} %`}
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
            const typingInterval = setInterval(() => {
                typedResult = output.slice(0, i);
                resultBox.textContent = typedResult;
                i++;
                if (i > output.length) {
                    clearInterval(typingInterval);
                    isTyping = false;
                }
            }, 10);
        }

        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(typedResult);
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '✓ Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        });

        function setLoginProgress(val) {
            loginProgress = val;
            if (!login) renderLoginForm();
        }

        function setProgress(val) {
            progress = val;
            if (login) renderDeployForm();
        }

        function setResult(data) {
            result = data;
        }

        // Initialize
        renderLoginForm();
    </script>
</body>
</html>
