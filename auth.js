// auth.js - 全站一体化脚本：密码拦截 + 多账号匹配 + 登录浮窗 + 全局动态主题（绝对路径版）
(function() {
    // 🔒 1. 基础配置：密码、账号、欢迎词
    const CORRECT_PASSWORD = "323339";
    const VALID_USERNAMES = ["admin32", "admin33", "admin39"];
    const WELCOME_MAP = { "admin32": "欢迎fyh", "admin33": "欢迎hxb", "admin39": "欢迎lbr" };

    // 🎮 2. 游戏排除列表：只要网址包含这些词，就绝对不加载暗黑主题（保持游戏原本色彩）
    const EXCLUDED_GAMES = ["game.html", "tetris", "snake", "22.html"]; 

    // 🌌 3. 内嵌全局暗黑主题 CSS（确保全站所有引入 auth.js 的页面都能直接变色，无需依赖外部 css）
    const MYSTERIOUS_THEME_CSS = `
        body {
            background-color: #0d0b18 !important; /* 深邃星空紫黑底色 */
            color: #e2e0eb !important;           /* 柔和护眼的雾银文本色 */
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            line-height: 1.7;
        }
        /* 主标题与次标题 */
        h1, h2, h3, h4 {
            color: #ffffff !important;
            border-bottom: 1px solid #231c42 !important;
            padding-bottom: 8px;
        }
        /* 统一各页面的导航栏样式 */
        .navbar {
            background-color: #141126 !important;
            border-bottom: 1px solid #2a2254 !important;
            padding: 12px !important;
            border-radius: 8px;
            margin-bottom: 15px;
        }
        .navbar a {
            color: #a29bfe !important; /* 荧光淡紫链接 */
            margin: 0 12px !important;
            text-decoration: none !important;
            font-weight: bold;
            transition: color 0.2s ease;
        }
        .navbar a:hover {
            color: #2ed573 !important; /* 悬停时变为炫绿 */
        }
        /* 统一网页内普通超链接颜色 */
        a {
            color: #58a6ff !important;
        }
        /* 柔化页面内的图片，防止刺眼 */
        img {
            border-radius: 8px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.7);
            border: 1px solid #231c42;
            max-width: 100%;
            height: auto;
        }
        hr {
            border: 0;
            border-top: 1px solid #231c42;
            margin: 30px 0;
        }
    `;

    // ⚡ 4. 自动化动态注入主题（走绝对路径判定，精准避开小游戏和登录页）
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

    // 🎯 5. 判断当前是否在登录页（全升级为绝对路径匹配 `/login.html`）
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
                        
                        // 登录成功后，默认跳转回根目录首页
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

    // 🔒 6. 正常网页的拦截逻辑（绝对路径重定向）
    const isAuthed = sessionStorage.getItem('site_auth_token');
    if (isAuthed !== 'passed_successfully') {
        sessionStorage.setItem('auth_redirect_url', window.location.href);
        window.location.href = '/login.html'; // 确保一脚踢回根目录的登录页
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
