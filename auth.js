// auth.js - 全自动化拦截与事件绑定脚本
(function() {
    // 🔒 1. 在这里配置你的账号和密码
    const CORRECT_USER = "admin";
    const CORRECT_PASS = "123456";

    // 🎯 2. 判断当前是否在登录页
    if (window.location.pathname.endsWith('login.html')) {
        
        // 【核心升级】：等网页元素全部加载完后，自动接管登录页面的按钮
        document.addEventListener('DOMContentLoaded', function() {
            const loginBtn = document.getElementById('login-btn');
            const userInput = document.getElementById('username');
            const passInput = document.getElementById('password');
            const errorMsg = document.getElementById('error-msg');

            // 如果页面上确实有这些元素，就绑定点击和回车事件
            if (loginBtn && userInput && passInput) {
                
                function doLogin() {
                    const u = userInput.value.trim();
                    const p = passInput.value.trim();

                    if (u === CORRECT_USER && p === CORRECT_PASS) {
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
                        if (errorMsg) errorMsg.innerText = "账号或密码错误！";
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
