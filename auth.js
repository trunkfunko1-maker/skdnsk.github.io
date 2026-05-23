// auth.js - 全站一体化终极脚本：权限拦截 + 登录浮窗 + 暗黑主题 + 全局公用顶底栏动态注入
(function() {
    // 🔒 1. 基础配置：密码、账号、欢迎词
    const CORRECT_PASSWORD = "323339";
    const VALID_USERNAMES = ["admin32", "admin33", "admin39"];
    const WELCOME_MAP = { "admin32": "欢迎fyh", "admin33": "欢迎hxb", "admin39": "欢迎lbr" };

    // 🎮 2. 游戏排除列表：只要网址包含这些词，就绝对不加载任何样式与公用顶底栏（game.html 完美安全）
    const EXCLUDED_GAMES = ["game.html", "tetris", "snake"]; 

    // 🌌 3. 核武级地毯式暗黑 CSS
    const MYSTERIOUS_THEME_CSS = `
        html, body, 
        .wrapper, .container, .main-content, #content, 
        main, section, article, .markdown-body, .contact-container {
            background-color: #0d0b18 !important;
            color: #e2e0eb !important;
        }
        p, span, li, td, th, em, strong, label { color: #e2e0eb !important; }
        h1, h2, h3, h4, h5, h6 {
            color: #ffffff !important;
            border-bottom: 1px solid #231c42 !important;
            padding-bottom: 8px;
        }
        /* 顶栏公共样式美化 */
        body .navbar {
            background-color: #141126 !important;
            border-bottom: 1px solid #2a2254 !important;
            padding: 12px !important;
            border-radius: 8px;
            margin-bottom: 15px;
            display: flex !important;
            justify-content: space-around !important;
        }
        body .navbar a {
            color: #a29bfe !important;
            margin: 0 12px !important;
            text-decoration: none !important;
            font-weight: bold !important;
        }
        body .navbar a:hover { color: #54a0ff !important; }
        body a { color: #58a6ff !important; }
        img {
            border-radius: 8px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.7);
            border: 1px solid #231c42;
        }
        body input[type="text"], body input[type="password"], body textarea {
            background-color: #141126 !important; color: #ffffff !important; border: 1px solid #3d346d !important;
        }
        body input:focus, body textarea:focus { border-color: #a29bfe !important; outline: none; }
        body button, body input[type="submit"] {
            background: linear-gradient(180deg, #3742fa 0%, #1e3799 100%) !important;
            color: white !important; border: none !important; border-radius: 25px !important;
            font-weight: bold !important; box-shadow: 0 4px 15px rgba(30, 55, 153, 0.4) !important;
            cursor: pointer !important; transition: transform 0.2s ease !important;
        }
        body button:hover { transform: scale(1.03); }
        
        /* 底栏特殊美化控制 */
        body footer {
            background: #141126 !important;
            color: white !important;
            text-align: center !important;
            padding: 20px !important;
            margin-top: 50px !important;
            border-top: 1px solid #2a2254 !important;
            border-radius: 8px !important;
        }
    `;

    const currentPath = window.location.pathname.toLowerCase();
    const isGame = EXCLUDED_GAMES.some(gameKeyword => currentPath.includes(gameKeyword.toLowerCase()));
    const isLoginPage = currentPath.endsWith('/login.html');

    // ⚡ 4. 自动化动态注入主题样式
    if (!isGame && !isLoginPage) {
        const styleElement = document.createElement('style');
        styleElement.appendChild(document.createTextNode(MYSTERIOUS_THEME_CSS));
        if (document.head) { document.head.appendChild(styleElement); } 
        else { document.addEventListener('DOMContentLoaded', () => document.head.appendChild(styleElement)); }
    }

    // 🚀 5.【全新中心化组件逻辑】全自动注入网站共用的顶栏和底栏
    if (!isGame && !isLoginPage) {
        document.addEventListener('DOMContentLoaded', function() {
            // A. 构建顶栏 HTML (全部升级为绝对路径前缀 '/')
            const navbarContainer = document.createElement('div');
            navbarContainer.innerHTML = `
                <div class="navbar">
                    <a href="/index.html">首页</a>
                    <a href="/contact.html">联系</a>
                    <a href="/23.html">关于</a>
                </div>
                <div class="navbar">
                    <a href="/24.html">王茂纲</a>
                    <a href="/25.html">异闻录</a>
                    <a href="/22.html">怪物鸡吧</a>
                </div>
            `;
            // 将顶栏强行塞到当前页面 <body> 的最前方
            document.body.insertBefore(navbarContainer, document.body.firstChild);

            // B. 构建底栏 HTML
            const footerElement = document.createElement('footer');
            footerElement.innerHTML = `
                <p>© 2026 川大附中天堂网 </p>
                <p><a href="mailto:djkenfisao@proton.me" style="color: #58a6ff;">发送投稿</a></p>
                <p><a href="/contact.html" style="color: #58a6ff;">联系我</a></p>
                <p><a href="javascript:void(0);" onclick="sessionStorage.removeItem('site_auth_token'); window.location.reload();" style="color: #ff4d4f; font-weight: bold; text-decoration: none;">退出登录</a></p>
            `;
            // 将底栏强行追加到当前页面 <body> 的最底部
            document.body.appendChild(footerElement);
        });
    }

    // 🎯 6. 判断当前是否在登录页
    if (isLoginPage) {
        document.addEventListener('DOMContentLoaded', function() {
            const loginBtn = document.getElementById('login-btn');
            const userInput = document.getElementById('username');
            const passInput = document.getElementById('password');
            const errorMsg = document.getElementById('error-msg');

            if (loginBtn && userInput && passInput) {
                function doLogin() {
                    const u = userInput.value.trim();
                    const p = passInput.value.trim();

                    if (VALID_USERNAMES.includes(u) && p === CORRECT_PASSWORD) {
                        sessionStorage.setItem('site_auth_token', 'passed_successfully');
                        sessionStorage.setItem('site_welcome_msg', WELCOME_MAP[u]);
                        
                        let redirectUrl = sessionStorage.getItem('auth_redirect_url') || '/index.html';
                        if (redirectUrl.endsWith('/login.html')) { redirectUrl = '/index.html'; }
                        
                        sessionStorage.removeItem('auth_redirect_url');
                        window.location.href = redirectUrl;
                    } else {
                        if (errorMsg) errorMsg.innerText = "账号或密码错误，拒绝访问！";
                    }
                }
                loginBtn.addEventListener('click', doLogin);
                window.addEventListener('keydown', function(e) { if (e.key === 'Enter') doLogin(); });
            }
        });
        return;
    }

    // 🔒 7. 正常网页的拦截逻辑
    const isAuthed = sessionStorage.getItem('site_auth_token');
    if (isAuthed !== 'passed_successfully') {
        sessionStorage.setItem('auth_redirect_url', window.location.href);
        window.location.href = '/login.html'; 
        return;
    }

    // 🌟 8. 全站通用的欢迎浮窗生成逻辑
    const welcomeMsg = sessionStorage.getItem('site_welcome_msg');
    if (welcomeMsg) {
        sessionStorage.removeItem('site_welcome_msg');
        document.addEventListener('DOMContentLoaded', function() {
            const toast = document.createElement('div');
            toast.innerText = welcomeMsg;
            toast.style.cssText = `
                position: fixed; top: 15%; left: 50%; transform: translate(-50%, -50%);
                background: rgba(0, 168, 255, 0.95); color: white; padding: 14px 40px;
                border-radius: 30px; font-weight: bold; font-size: 18px; font-family: sans-serif;
                box-shadow: 0 5px 25px rgba(0, 168, 255, 0.3); z-index: 999999; opacity: 1;
                transition: opacity 0.5s ease, transform 0.5s ease;
            `;
            document.body.appendChild(toast);
            setTimeout(function() {
                toast.style.opacity = '0';
                toast.style.transform = 'translate(-50%, -60%)';
                setTimeout(function() { toast.remove(); }, 500);
            }, 2000);
        });
    }
})();
