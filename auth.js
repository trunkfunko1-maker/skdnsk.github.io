// auth.js - 终极无死角版：密码拦截 + 多账号匹配 + 登录浮窗 + 强力地毯式暗黑主题（修复22页面冲突）
(function() {
    // 🔒 1. 基础配置：密码、账号、欢迎词
    const CORRECT_PASSWORD = "323339";
    const VALID_USERNAMES = ["admin32", "admin33", "admin39"];
    const WELCOME_MAP = { "admin32": "欢迎fyh", "admin33": "欢迎hxb", "admin39": "欢迎lbr" };

    // 🎮 2. 游戏排除列表：【已移除 22.html】现在只有真正的游戏页面才不受主题影响
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
            color: #2ed573 !important;
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

        /* 💥 第七步：【全新新增】专门针对 contact 页面的表单输入框进行全透暗黑化 */
        body input[type="text"], 
        body input[type="password"], 
        body textarea {
            background-color: #141126 !important; /* 变成暗紫输入框 */
            color: #ffffff !important;            /* 输入文字为纯白 */
            border: 1px solid #3d346d !important; /* 暗紫色边框 */
        }
        body input:focus, body textarea:focus {
            border-color: #a29bfe !important;     /* 聚焦时边框发光 */
            outline: none;
        }

        /* 💥 第八步：【全新新增】将全站所有的普通按钮、提交按钮统一升级为炫绿科技感样式 */
        body button, body input[type="submit"] {
            background: linear-gradient(180deg, #2ed573 0%, #26af5f 100%) !important;
            color: white !important;
            border: none !important;
            border-radius: 25px !important;      /* 变成圆角高档按钮 */
            font-weight: bold !important;
            box-shadow: 0 4px 15px rgba(46, 213, 115, 0.3) !important;
            cursor: pointer !important;
            transition: transform 0.2s ease !important;
        }
        body button:hover {
            transform: scale(1.03);             /* 悬停微动特效 */
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
