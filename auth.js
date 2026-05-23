// auth.js - 终极无死角版：密码拦截 + 多账号匹配 + 登录浮窗 + 强力地毯式暗黑主题
(function() {
    // 🔒 1. 基础配置：密码、账号、欢迎词
    const CORRECT_PASSWORD = "323339";
    const VALID_USERNAMES = ["admin32", "admin33", "admin39"];
    const WELCOME_MAP = { "admin32": "欢迎fyh", "admin33": "欢迎hxb", "admin39": "欢迎lbr" };

    // 🎮 2. 游戏排除列表：只要网址包含这些词，就绝对不加载暗黑主题
    const EXCLUDED_GAMES = ["game.html", "tetris", "snake", "22.html"]; 

    // 🌌 3.【核心升级】核武级地毯式暗黑 CSS（专门对付 GitHub Pages 的各种主题大盒子）
    const MYSTERIOUS_THEME_CSS = `
        /* 💥 第一步：强行把全站所有可能的基础大背景、容器、主区域全部刷成深空紫黑 */
        html, body, 
        .wrapper, .container, .main-content, #content, 
        main, section, article, .markdown-body {
            background-color: #0d0b18 !important;
            color: #e2e0eb !important;
        }

        /* 💥 第二步：强制把所有文本相关的标签（段落、列表、表格等）统一为柔和雾银字 */
        p, span, li, td, th, em, strong {
            color: #e2e0eb !important;
        }

        /* 💥 第三步：将所有标题文字强行拉亮为纯白，并加上暗紫分界线 */
        h1, h2, h3, h4, h5, h6 {
            color: #ffffff !important;
            border-bottom: 1px solid #231c42 !important;
            padding-bottom: 8px;
        }

        /* 💥 第四步：精准保护导航栏！由于上面把 div 刷黑了，这里必须用更高的权重把导航栏救回来 */
        body .navbar {
            background-color: #141126 !important;
            border-bottom: 1px solid #2a2254 !important;
            padding: 12px !important;
            border-radius: 8px;
            margin-bottom: 15px;
            display: flex !important; /* 确保弹性布局不被冲垮 */
        }
        body .navbar a {
            color: #a29bfe !important; /* 荧光淡紫链接 */
            margin: 0 12px !important;
            text-decoration: none !important;
            font-weight: bold !important;
        }
        body .navbar a:hover {
            color: #2ed573 !important; /* 悬停时变为炫绿 */
        }

        /* 💥 第五步：常规页面普通超链接颜色 */
        body a {
            color: #58a6ff !important;
        }

        /* 💥 第六步：图片加暗色阴影融化边缘 */
        img {
            border-radius: 8px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.7);
            border: 1px solid #231c42;
        }
    `;

    // ⚡ 4. 自动化动态注入主题（双重保障加载，防止部分页面 DOM 未就绪）
    const currentPath = window.location.pathname.toLowerCase();
    const isGame = EXCLUDED_GAMES.some(gameKeyword => currentPath.includes(gameKeyword.toLowerCase()));
    
    if (!isGame && !currentPath.endsWith('/login.html')) {
        const styleElement = document.createElement('style');
        styleElement.appendChild(document.createTextNode(MYSTERIOUS_THEME_CSS));
        
        // 只要 head 出来了立刻注入，没出来就等 DOMContentLoaded，确保万无一失
        if (document.head) {
            document.head.appendChild(styleElement);
        } else {
            document.addEventListener('DOMContentLoaded', () => document.head.appendChild(styleElement));
        }
    }

    // 🎯 5. 判断当前是否在登录页（绝对路径匹配）
    if (currentPath.endsWith('/login.html')) {
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

    // 🔒 6. 正常网页的拦截逻辑
    const isAuthed = sessionStorage.getItem('site_auth_token');
    if (isAuthed !== 'passed_successfully') {
        sessionStorage.setItem('auth_redirect_url', window.location.href);
        window.location.href = '/login.html'; 
        return;
    }

    // 🌟 7. 全站通用的欢迎浮窗生成逻辑
    const welcomeMsg = sessionStorage.getItem('site_welcome_msg');
    if (welcomeMsg) {
        sessionStorage.removeItem('site_welcome_msg');
        document.addEventListener('DOMContentLoaded', function() {
            const toast = document.createElement('div');
            toast.innerText = welcomeMsg;
            toast.style.cssText = `
                position: fixed; top: 15%; left: 50%; transform: translate(-50%, -50%);
                background: rgba(46, 213, 115, 0.95); color: white; padding: 14px 40px;
                border-radius: 30px; font-weight: bold; font-size: 18px; font-family: sans-serif;
                box-shadow: 0 5px 25px rgba(0, 0, 0, 0.4); z-index: 999999; opacity: 1;
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
