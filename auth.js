// auth.js - 全自动化拦截、多账号匹配、登录欢迎浮窗及皮肤管理脚本
(function() {
    // 🔒 1. 基础配置：密码、账号、欢迎词
    const CORRECT_PASSWORD = "323339";
    const VALID_USERNAMES = ["admin32", "admin33", "admin39"];
    const WELCOME_MAP = { "admin32": "欢迎fyh", "admin33": "欢迎hxb", "admin39": "欢迎lbr" };

    // 🎮 2. 配置小游戏页面的关键词（只要网址包含这些，就保持 style.css 的默认样式）
    const EXCLUDED_GAMES = ["game", "tetris", "snake", "22.html"]; 

    // ⚡ 4.【核心改变】自动化动态皮肤管理（彻底解决样式冲突）
    (function injectTheme() {
        const currentPath = window.location.pathname.toLowerCase();
        const isGame = EXCLUDED_GAMES.some(gameKeyword => currentPath.includes(gameKeyword.toLowerCase()));
        
        // 如果不是小游戏页面，且不是登录页，就给最外层网页挂上暗黑主题标签
        if (!isGame && !currentPath.endsWith('login.html')) {
            // 这行代码会瞬间给 <html> 标签加上 class="mysterious-theme"
            document.documentElement.classList.add('mysterious-theme');
        }
    })();


    // 🎯 5. 判断当前是否在登录页
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
