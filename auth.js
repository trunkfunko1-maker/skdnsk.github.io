// auth.js - 全自动化拦截与事件绑定脚本（支持固定账号 + 多密码三选一）
(function() {
    // 🔒 1. 在这里配置你的账号和允许的密码列表
    const CORRECT_USER = "admin";
    const VALID_PASSWORDS = ["32fyh", "33hxb", "39lbr"];

    // 🎯 2. 判断当前是否在登录页
    if (window.location.pathname.endsWith('login.html')) {
        
        document.addEventListener('DOMContentLoaded', function() {
            const loginBtn = document.getElementById('login-btn');
            const userInput = document.getElementById('username'); // 重新获取账号输入框
            const passInput = document.getElementById('password');
            const errorMsg = document.getElementById('error-msg');

            if (loginBtn && userInput && passInput) {
                
                function doLogin() {
                    const u = userInput.value.trim(); // 获取用户输入的账号
                    const p = passInput.value.trim(); // 获取用户输入的密码

                    // 🛠️ 核心逻辑：账号必须匹配，且密码必须在允许的数组里
                    if (u === CORRECT_USER && VALID_PASSWORDS.includes(p)) {
                        // 验证通过，发放通行证
                        sessionStorage.setItem('site_auth_token', 'passed_successfully');
                        
                        // 读出之前的原网址，如果没有则默认回首页
                        let redirectUrl = sessionStorage.getItem('auth_redirect_url') || '/index.html';
                        if (redirectUrl.endsWith('login.html')) {
                            redirectUrl = '/index.html';
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
        window.location.href = '/login.html';
    }
})();
