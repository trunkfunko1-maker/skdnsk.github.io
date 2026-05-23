// auth.js - 全站一体化脚本：密码拦截 + 多账号匹配 + 登录浮窗(天蓝) + 全局动态主题(深蓝按钮版)
(function() {
    // 🔒 1. 基础配置：密码、账号、欢迎词
    const CORRECT_PASSWORD = "323339";
    const VALID_USERNAMES = ["admin32", "admin33", "admin39"];
    const WELCOME_MAP = { "admin32": "欢迎fyh", "admin33": "欢迎hxb", "admin39": "欢迎lbr" };

    // 🎮 2. 游戏排除列表：只要网址包含这些词，就绝对不加载任何样式（game.html 完美安全）
    const EXCLUDED_GAMES = ["game.html", "tetris", "snake"]; 

    // 🌌 3. 核武级地毯式暗黑 CSS
    const MYSTERIOUS_THEME_CSS = `
        /* 💥 第一步：强行把全站所有可能的基础大背景、容器、主区域全部刷成深空紫黑 */
        html, body, 
        .wrapper, .container, .main-content, #content, 
        main, section, article, .markdown-body, .contact-container {
            background-color: #0d0b18 !important;
            color: #e2e0eb !important;
        }

        /* 💥 第二步：强制把所有文本相关的标签统一为柔和雾银字 */
        p, span, li, td, th, em, strong, label {
            color: #e2e0eb !important;
        }

        /* 💥 第三步：将所有标题文字强行拉亮为纯白，并加上暗紫分界线 */
        h1, h2, h3, h4, h5, h6 {
            color: #ffffff !important;
            border-bottom: 1px solid #231c42 !important;
            padding-bottom: 8px;
        }

        /* 💥 第四步：精准保护并美化导航栏 */
        body .navbar {
            background-color: #141126 !important;
            border-bottom: 1px solid #2a2254 !important;
            padding: 12px !important;
            border-radius: 8px;
            margin-bottom: 15px;
            display: flex !important;
        }
        body .navbar a {
            color: #a29bfe !important;
            margin: 0 12px !important;
            text-decoration: none !important;
            font-weight: bold !important;
        }
        body .navbar a:hover {
            color: #54a0ff !important; /* 🌠 配合深蓝主题，悬停文字变为清爽亮蓝 */
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

        /* 💥 第七步：专门针对 contact 页面的表单输入框进行全透暗黑化 */
        body input[type="text"], 
        body input[type="password"], 
        body textarea {
            background-color: #141126 !important;
            color: #ffffff !important;
            border: 1px solid #3d346d !important;
        }
        body input:focus, body textarea:focus {
            border-color: #a29bfe !important;
            outline: none;
        }

        /* 💥 第八步：【核心修改】将全站绿色按钮全部降维打击，升级为高档深蓝色渐变 */
        body button, body input[type="submit"] {
            background: linear-gradient(180deg, #3742fa 0%, #1e3799 100%) !important; /* 🔵 炫酷深蓝渐变 */
            color: white !important;
            border: none !important;
            border-radius: 25px !important;
            font-weight: bold !important;
            box-shadow: 0 4px 15px rgba(30, 55, 153, 0.4) !important; /* 🔵 蓝色光晕外阴影 */
            cursor: pointer !important;
            transition: transform 0.2s ease !important;
        }
        body button:hover {
            transform: scale(1.03);
        }
    `;

    // ⚡ 4. 自动化动态注入主题
    const currentPath = window.location.pathname.toLowerCase();
    const isGame = EXCLUDED_GAMES.some(gameKeyword => currentPath.includes(gameKeyword.toLowerCase()));
    
    if (!isGame && !currentPath.endsWith('/login.html')) {
        const styleElement = document.createElement('style');
        styleElement.appendChild(document.createTextNode(MYSTERIOUS_THEME_CSS));
        if (document.head) {
            document.head.appendChild(styleElement);
        } else {
            document.addEventListener('DOMContentLoaded', () => document.head.appendChild(styleElement));
        }
    }

    // 🎯 5. 判断当前是否在登录页
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

    // 🌟 7.【核心修改】全站通用的欢迎浮窗生成逻辑（已切换为天蓝色背景）
    const welcomeMsg = sessionStorage.getItem('site_welcome_msg');
    if (welcomeMsg) {
        sessionStorage.removeItem('site_welcome_msg');
        document.addEventListener('DOMContentLoaded', function() {
            const toast = document.createElement('div');
            toast.innerText = welcomeMsg;
            toast.style.cssText = `
                position: fixed; top: 15%; left: 50%; transform: translate(-50%, -50%);
                background: rgba(0, 168, 255, 0.95); /* ❄️ 完美天蓝色背景 */
                color: white; padding: 14px 40px;
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
