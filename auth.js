// auth.js - 全自动化拦截脚本（完美兼容深层子目录绝对路径）
(function() {
    // 🔒 1. 配置唯一的密码，以及允许的三个账号
    const CORRECT_PASSWORD = "323339";
    const VALID_USERNAMES = ["admin32", "admin33", "admin39"];
    
    // 📝 账号与欢迎词的对应关系
    const WELCOME_MAP = {
        "admin32": "欢迎fyh",
        "admin33": "欢迎hxb",
        "admin39": "欢迎lbr"
    };

    // 🎯 2. 判断当前是否在登录页（兼容绝对路径写法）
    if (window.location.pathname.endsWith('/login.html')) {
        
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
                        // 验证通过，发放通行证
                        sessionStorage.setItem('site_auth_token', 'passed_successfully');
                        sessionStorage.setItem('site_welcome_msg', WELCOME_MAP[u]);
                        
                        // 🌟【修复】：没有记录原网址时，默认回根目录首页 /index.html
                        let redirectUrl = sessionStorage.getItem('auth_redirect_url') || '/index.html';
                        if (redirectUrl.endsWith('/login.html')) {
                            redirectUrl = '/index.html';
                        }
                        
                        sessionStorage.removeItem('auth_redirect_url');
                        window.location.href = redirectUrl; // 成功跳转
                    } else {
                        if (errorMsg) errorMsg.innerText = "账号或密码错误，拒绝访问！";
                    }
                }

                loginBtn.addEventListener('click', doLogin);
                window.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') doLogin();
                });
            }
        });

        return; // 在登录页就不执行后面的拦截逻辑了
    }

    // 🔒 3. 正常网页的拦截逻辑
    const isAuthed = sessionStorage.getItem('site_auth_token');

    if (isAuthed !== 'passed_successfully') {
        // 没登录，精确记录当前深层页面的完整网址（例如包含 /100/101.html）
        sessionStorage.setItem('auth_redirect_url', window.location.href);
        
        // 🌟【核心修复】：强行丢进根目录下的登录页，前面必须加 /
        window.location.href = '/login.html';
        return;
    }

    // 🌟 4. 全站通用的欢迎浮窗生成逻辑（保持不变）
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
