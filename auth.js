// auth.js - 全自动化拦截、多账号匹配及登录欢迎浮窗脚本
(function() {
    // 🔒 1. 在这里配置唯一的密码，以及允许的三个账号
    const CORRECT_PASSWORD = "323339";
    const VALID_USERNAMES = ["admin32", "admin33", "admin39"];
    
    // 📝 账号与欢迎词的对应关系映射表
    const WELCOME_MAP = {
        "admin32": "欢迎fyh",
        "admin33": "欢迎hxb",
        "admin39": "欢迎lbr"
    };

    // 🎯 2. 判断当前是否在登录页
    if (window.location.pathname.endsWith('login.html')) {
        
        document.addEventListener('DOMContentLoaded', function() {
            const loginBtn = document.getElementById('login-btn');
            const userInput = document.getElementById('username');
            const passInput = document.getElementById('password');
            const errorMsg = document.getElementById('error-msg');

            if (loginBtn && userInput && passInput) {
                
                function doLogin() {
                    const u = userInput.value.trim(); // 获取输入的账号
                    const p = passInput.value.trim(); // 获取输入的密码

                    // 🛠️ 核心逻辑：账号必须在三选一列表里，且密码必须匹配 323339
                    if (VALID_USERNAMES.includes(u) && p === CORRECT_PASSWORD) {
                        // 验证通过，发放通行证
                        sessionStorage.setItem('site_auth_token', 'passed_successfully');
                        
                        // 🌟【新增】：将当前账号对应的欢迎语暂存到浏览器缓存中
                        sessionStorage.setItem('site_welcome_msg', WELCOME_MAP[u]);
                        
                        // 读出之前的原网址，如果没有则默认回首页
                        let redirectUrl = sessionStorage.getItem('auth_redirect_url') || 'index.html';
                        if (redirectUrl.endsWith('login.html')) {
                            redirectUrl = 'index.html';
                        }
                        
                        sessionStorage.removeItem('auth_redirect_url');
                        window.location.href = redirectUrl; // 成功跳转
                    } else {
                        if (errorMsg) errorMsg.innerText = "账号或密码错误，拒绝访问！";
                    }
                }

                // 自动绑定点击事件
                loginBtn.addEventListener('click', doLogin);
                
                // 自动绑定回车事件
                window.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') doLogin();
                });
            }
        });

        return; // 在登录页就不执行下面的拦截逻辑了
    }

    // 🔒 3. 正常网页的拦截逻辑
    const isAuthed = sessionStorage.getItem('site_auth_token');

    if (isAuthed !== 'passed_successfully') {
        // 没登录，记录当前想访问的网址
        sessionStorage.setItem('auth_redirect_url', window.location.href);
        // 强行丢进登录页
        window.location.href = 'login.html';
        return;
    }

    // 🌟 4.【新增】全站通用的欢迎浮窗生成逻辑
    const welcomeMsg = sessionStorage.getItem('site_welcome_msg');
    if (welcomeMsg) {
        // 阅后即焚：立刻擦除缓存，确保用户刷新页面或者跳转到下个页面时，浮窗不会再次弹出来
        sessionStorage.removeItem('site_welcome_msg');
        
        // 等待页面内容加载完成后，动态往页面里塞一个漂亮的浮窗
        document.addEventListener('DOMContentLoaded', function() {
            const toast = document.createElement('div');
            toast.innerText = welcomeMsg;
            
            // 采用内联 CSS 样式，确保浮窗能在任何页面（包括 Markdown 渲染后的页面）完美居中悬浮
            toast.style.cssText = `
                position: fixed;
                top: 15%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(46, 213, 115, 0.95); /* 炫绿背景 */
                color: white;
                padding: 14px 40px;
                border-radius: 30px;
                font-weight: bold;
                font-size: 18px;
                font-family: sans-serif;
                box-shadow: 0 5px 25px rgba(0, 0, 0, 0.4);
                z-index: 999999; /* 确保在最上层，不被任何内容遮挡 */
                opacity: 1;
                transition: opacity 0.5s ease, transform 0.5s ease;
            `;
            
            document.body.appendChild(toast);

            // ⏱️ 停留 2000 毫秒（2秒）后，触发消失动画
            setTimeout(function() {
                toast.style.opacity = '0';
                toast.style.transform = 'translate(-50%, -60%)'; // 消失时伴随一点向上轻飘的动画效果
                
                // 动画执行完后，彻底从网页代码中把这个浮窗删掉
                setTimeout(function() {
                    toast.remove();
                }, 500);
            }, 2000);
        });
    }
})();
