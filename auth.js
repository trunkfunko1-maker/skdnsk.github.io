// auth.js - 全站一体化脚本：黑灰主题 + 修正导航栏文字
(function() {
    // 🔒 1. 基础配置
    const CORRECT_PASSWORD = "323339";
    const VALID_USERNAMES = ["admin32", "admin33", "admin39"];
    const WELCOME_MAP = { "admin32": "欢迎fyh", "admin33": "欢迎hxb", "admin39": "欢迎lbr" };
    const EXCLUDED_GAMES = ["game.html", "tetris", "snake"]; 

    // 🌌 2. 黑灰色调 CSS
    const MYSTERIOUS_THEME_CSS = `
        .page-header, #header_wrap, .site-header, .site-title, .project-name, .project-tagline, .downloads {
            display: none !important; height: 0 !important; min-height: 0 !important; max-height: 0 !important;
            padding: 0 !important; margin: 0 !important; border: none !important; position: absolute !important; top: -9999px !important;
        }
        html, body, .wrapper, .container, .main-content, #content, main, section, article, .markdown-body, .contact-container {
            background-color: #121212 !important; color: #e0e0e0 !important; margin-top: 0 !important; padding-top: 0 !important;
        }
        p, span, li, td, th, em, strong, label { color: #e0e0e0 !important; }
        h1, h2, h3, h4, h5, h6 { color: #ffffff !important; border-bottom: 1px solid #2d2d2d !important; padding-bottom: 8px; }
        body a { color: #64b5f6 !important; }
        body a:hover { color: #90caf9 !important; }
        body .navbar {
            background-color: #1e1e1e !important; border: 1px solid #2d2d2d !important; border-bottom: 2px solid #3d3d3d !important;
            padding: 12px !important; border-radius: 8px; margin-bottom: 20px; display: flex !important; justify-content: space-around !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        }
        body .navbar a { color: #b0bec5 !important; margin: 0 12px !important; text-decoration: none !important; font-weight: bold !important; transition: color 0.2s ease; }
        body .navbar a:hover { color: #ffffff !important; }
        img { border-radius: 8px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8); border: 1px solid #2d2d2d; }
        video { border: 1px solid #2d2d2d; background-color: #000000; }
        body input[type="text"], body input[type="password"], body textarea { background-color: #1e1e1e !important; color: #ffffff !important; border: 1px solid #3d3d3d !important; border-radius: 4px; }
        body input:focus, body textarea:focus { border-color: #64b5f6 !important; outline: none; }
        body button, body input[type="submit"] {
            background: linear-gradient(180deg, #424242 0%, #212121 100%) !important; color: #ffffff !important; border: 1px solid #4d4d4d !important; border-radius: 25px !important;
            font-weight: bold !important; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.6) !important; cursor: pointer !important; transition: all 0.2s ease !important;
        }
        body button:hover { background: linear-gradient(180deg, #616161 0%, #212121 100%) !important; transform: scale(1.03); border-color: #64b5f6 !important; }
        body footer { background: #1e1e1e !important; color: #90a4ae !important; text-align: center !important; padding: 20px !important; margin-top: 50px !important; border-top: 1px solid #2d2d2d !important; border-radius: 8px !important; box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.3); }
    `;

    const currentPath = window.location.pathname.toLowerCase();
    const isGame = EXCLUDED_GAMES.some(gameKeyword => currentPath.includes(gameKeyword.toLowerCase()));
    const isLoginPage = currentPath.endsWith('/login.html');

    if (!isGame && !isLoginPage) {
        const injectStyles = () => {
            const styleElement = document.createElement('style');
            styleElement.appendChild(document.createTextNode(MYSTERIOUS_THEME_CSS));
            document.head.appendChild(styleElement);
        };
        if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', injectStyles); } else { injectStyles(); }
    }

    // 🚀 3. 动态注入修正后的顶底栏（王茂钢 完美纠正并去重）
    if (!isGame && !isLoginPage) {
        document.addEventListener('DOMContentLoaded', function() {
            const targetKillList = ['.page-header', '#header_wrap', '.site-header', '.site-title', '.project-name', '.project-tagline'];
            targetKillList.forEach(function(selector) {
                const elements = document.querySelectorAll(selector);
                elements.forEach(function(el) { if (el) el.remove(); });
            });

            // 构建新双排导航栏 (已修正为 王茂钢 且移除了重复标签)
            const navbarContainer = document.createElement('div');
            navbarContainer.innerHTML = `
                <div class="navbar">
                    <a href="/index.html">首页</a>
                    <a href="/contact.html">联系</a>
                    <a href="/23.html">关于</a>
                </div>
                <div class="navbar">
                    <a href="/24.html">王茂钢</a>
                    <a href="/25.html">异闻录</a>
                    <a href="/22.html">怪物鸡吧</a>
                </div>
            `;
            document.body.insertBefore(navbarContainer, document.body.firstChild);

            const footerElement = document.createElement('footer');
            footerElement.innerHTML = `
                <p>© 2026 川大附中天堂网 </p>
                <p><a href="mailto:djkenfisao@proton.me" style="color: #64b5f6;">发送投稿</a></p>
                <p><a href="/contact.html" style="color: #64b5f6;">联系我</a></p>
                <p><a href="javascript:void(0);" onclick="sessionStorage.removeItem('site_auth_token'); window.location.reload();" style="color: #ff4d4f; font-weight: bold; text-decoration: none;">退出登录</a></p>
            `;
            document.body.appendChild(footerElement);
        });
    }

    // 🎯 4. 登录页逻辑
    if (isLoginPage) {
        document.addEventListener('DOMContentLoaded', function() {
            const loginBtn = document.getElementById('login-btn');
            const userInput = document.getElementById('username');
            const passInput = document.getElementById('password');
            const errorMsg = document.getElementById('error-msg');
            if (loginBtn && userInput && passInput) {
                function doLogin() {
                    const u = userInput.value.trim(); const p = passInput.value.trim();
                    if (VALID_USERNAMES.includes(u) && p === CORRECT_PASSWORD) {
                        sessionStorage.setItem('site_auth_token', 'passed_successfully');
                        sessionStorage.setItem('site_welcome_msg', WELCOME_MAP[u]);
                        let redirectUrl = sessionStorage.getItem('auth_redirect_url') || '/index.html';
                        if (redirectUrl.endsWith('/login.html')) { redirectUrl = '/index.html'; }
                        sessionStorage.removeItem('auth_redirect_url'); window.location.href = redirectUrl;
                    } else { if (errorMsg) errorMsg.innerText = "账号或密码错误，拒绝访问！"; }
                }
                loginBtn.addEventListener('click', doLogin);
                window.addEventListener('keydown', function(e) { if (e.key === 'Enter') doLogin(); });
            }
        });
        return;
    }

    // 🔒 5. 权限拦截
    const isAuthed = sessionStorage.getItem('site_auth_token');
    if (isAuthed !== 'passed_successfully') {
        sessionStorage.setItem('auth_redirect_url', window.location.href);
        window.location.href = '/login.html'; return;
    }

    // 🌟 6. 欢迎浮窗
    const welcomeMsg = sessionStorage.getItem('site_welcome_msg');
    if (welcomeMsg) {
        sessionStorage.removeItem('site_welcome_msg');
        document.addEventListener('DOMContentLoaded', function() {
            const toast = document.createElement('div');
            toast.innerText = welcomeMsg;
            toast.style.cssText = `
                position: fixed; top: 15%; left: 50%; transform: translate(-50%, -50%);
                background: #424242; color: white; padding: 14px 40px; border: 1px solid #616161;
                border-radius: 30px; font-weight: bold; font-size: 18px; font-family: sans-serif;
                box-shadow: 0 5px 25px rgba(0, 0, 0, 0.6); z-index: 999999; opacity: 1; transition: opacity 0.5s ease, transform 0.5s ease;
            `;
            document.body.appendChild(toast);
            setTimeout(function() {
                toast.style.opacity = '0'; toast.style.transform = 'translate(-50%, -60%)';
                setTimeout(function() { toast.remove(); }, 500);
            }, 2000);
        });
    }
})();
