// auth.js - 全自动化拦截、多账号匹配、登录欢迎浮窗及全局动态暗黑主题脚本
(function() {
    // 🔒 1. 基础配置：密码、账号、欢迎词
    const CORRECT_PASSWORD = "323339";
    const VALID_USERNAMES = ["admin32", "admin33", "admin39"];
    const WELCOME_MAP = { "admin32": "欢迎fyh", "admin33": "欢迎hxb", "admin39": "欢迎lbr" };

    // 🎮 2.【核心配置】配置小游戏页面的关键词（只要网址里包含这些词，就不加载暗黑主题）
    const EXCLUDED_GAMES = ["game", "tetris", "snake", "22.html"]; // 可以在这里精准添加你的游戏文件名

    // 🌌 3. 全局暗黑主题 CSS 样式定义
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
            border-bottom: 1px solid #231c42 !important; /* 带有暗紫色的分界线 */
            padding-bottom: 8px;
        }
        /* 针对你主页 navbar 导航栏的暗色适配 */
        .navbar {
            background-color: #141126 !important; /* 略微浮起的暗紫色背景 */
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
            color: #2ed573 !important; /* 悬停时变为炫绿，呼应你的风格 */
        }
        /* 统一普通文本超链接颜色，保证暗色调下的清晰阅览 */
        a {
            color: #58a6ff !important; 
        }
        a:hover {
            text-decoration: underline !important;
        }
        /* 针对页面图片的优化，加上暗色阴影，防止白底图片太刺眼 */
        img {
            border-radius: 8px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.7);
            border: 1px solid #231c42;
            max-width: 100%;
            height: auto;
        }
        /* 针对横线 <hr> 的优化 */
        hr {
            border: 0;
            border-top: 1px solid #231c42;
            margin: 30px 0;
        }
    `;

    // ⚡ 4. 自动化动态注入主题样式
    (function injectTheme() {
        // 检查当前网址是否包含小游戏关键词
        const currentPath = window.location.pathname.toLowerCase();
        const isGame = EXCLUDED_GAMES.some(gameKeyword => currentPath.includes(gameKeyword.toLowerCase()));
        
        // 如果不是小游戏页面，且不是登录页（登录页自带了样式），就注入全局主题
        if (!isGame && !currentPath.endsWith('login.html')) {
            const styleElement = document.createElement('style');
            styleElement.appendChild(document.createTextNode(MYSTERIOUS_THEME_CSS));
            // 确保在 head 里面第一时间注入，防止页面闪白
            if (document.head) {
                document.head.appendChild(styleElement);
            } else {
                document.addEventListener('DOMContentLoaded', () => document.head.appendChild(styleElement));
            }
        }
    })();


    // 🎯 5. 判断当前是否在登录页（保持原有验证逻辑）
    if (window.location.pathname.endsWith('login.html')) {
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
                        
                        let redirectUrl = sessionStorage.getItem('auth_redirect_url') || 'index.html';
                        if (redirectUrl.endsWith('login.html')) { redirectUrl = 'index.html'; }
                        
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
        window.location.href = 'login.html';
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
