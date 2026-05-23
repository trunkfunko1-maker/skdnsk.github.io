// auth.js - 终极防御精准版：权限拦截 + 登录浮窗 + 暗黑主题 + 顶底栏注入 + 强制后发制人（绝不误伤）
(function() {
    // 🔒 1. 基础配置：密码、账号、欢迎词
    const CORRECT_PASSWORD = "323339";
    const VALID_USERNAMES = ["admin32", "admin33", "admin39"];
    const WELCOME_MAP = { "admin32": "欢迎fyh", "admin33": "欢迎hxb", "admin39": "欢迎lbr" };

    // 🎮 2. 游戏排除列表
    const EXCLUDED_GAMES = ["game.html", "tetris", "snake"]; 

    // 🌌 3. 核武级地毯式暗黑 CSS
    const MYSTERIOUS_THEME_CSS = `
        /* 🎯 精准定点隐形：只针对官方主题特有的外壳组件，增加 .site-title 确保拦截，绝不误伤用户正文 */
        .page-header, #header_wrap, .site-header, .site-title, .project-name, .project-tagline, .downloads {
            display: none !important;
            height: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            opacity: 0 !important;
            visibility: hidden !important;
        }

        html, body, 
        .wrapper, .container, .main-content, #content, 
        main, section, article, .markdown-body, .contact-container {
            background-color: #0d0b18 !important;
            color: #e2e0eb !important;
        }
        p, span, li, td, th, em, strong, label { color: #e2e0eb !important; }
        
        /* ✨ 用户手写的所有 H1-H6 标题保持绝对安全、高亮显现 */
        h1, h2, h3, h4, h5, h6 {
            color: #ffffff !important;
            border-bottom: 1px solid #231c42 !important;
            padding-bottom: 8px;
        }
        
        /* 顶栏公共样式 */
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
        
        body footer {
            background: #141126 !important; color: white !important; text-align: center !important;
            padding: 20px !important; margin-top: 50px !important; border-top: 1px solid #2a2254 !important; border-radius: 8px !important;
        }
    `;

    const currentPath = window.location.pathname.toLowerCase();
    const isGame = EXCLUDED_GAMES.some(gameKeyword => currentPath.includes(gameKeyword.toLowerCase()));
    const isLoginPage = currentPath.endsWith('/login.html');

    // ⚡ 4. 自动化动态注入主题样式（改用后发制人逻辑：等待 DOM 解析完再挂载到最后，防止被官方主题样式覆盖）
    if (!isGame && !isLoginPage) {
        const injectStyles = () => {
            const styleElement = document.createElement('style');
            styleElement.appendChild(document.createTextNode(MYSTERIOUS_THEME_CSS));
            document.head.appendChild(styleElement);
        };
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', injectStyles);
        } else {
            injectStyles();
        }
    }

    // 🚀 5. 全自动注入顶底栏 + 精准物理移除官方组件
    if (!isGame && !isLoginPage) {
        document.addEventListener('DOMContentLoaded', function() {
            
            // 定向粉碎官方模板类名，不碰任何通用基础标签
            const targetKillList = [
                '.page-header', '#header_wrap', '.site-header', '.site-title', '.project-name', '.project-tagline'
            ];
            targetKillList.forEach(function(selector) {
                const elements = document.querySelectorAll(selector);
                elements.forEach(function(el) { if (el) el.remove(); });
            });

            // A. 构建新顶栏 HTML
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
            document.body.insertBefore(navbarContainer, document.body.firstChild);

            // B. 构建新底栏 HTML
            const footerElement = document.createElement('footer');
            footerElement.innerHTML = `
                <p>© 2026 川大附中天堂网 </p>
                <p><a href="mailto:djkenfisao@proton.me" style="color: #58a6ff;">发送投稿</a></p>
                <p><a href="/contact.html" style="color: #58a6ff;">联系我</a></p>
                <p><a href="javascript:void(0);" onclick="sessionStorage.removeItem('site_auth_token'); window.location.reload();" style="color: #ff4d4f; font-weight: bold; text-decoration: none;">退出登录</a></p>
            `;
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
