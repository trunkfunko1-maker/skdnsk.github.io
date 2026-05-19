// auth.js - 全局唯一拦截脚本（已修正顺序 Bug）
(function() {
    // 🔒 1. 配置您想设置的账号和密码
    const CORRECT_USER = "admin";
    const CORRECT_PASS = "123456";

    // 🔓 2. 暴露给登录页面调用的全局登录函数
    // 【重要修复】：必须放在最上方，确保登录页加载此脚本时能成功注册该函数
    window.executeSiteLogin = function(username, password) {
        if (username === CORRECT_USER && password === CORRECT_PASS) {
            sessionStorage.setItem('site_auth_token', 'passed_successfully');
            
            // 读取拦截前存下的原网址，如果没有则默认跳回首页
            let redirectUrl = sessionStorage.getItem('auth_redirect_url') || 'index.html';
            
            // 防止死循环：如果记录的原网址就是登录页，则强制改回首页
            if (redirectUrl.endsWith('login.html')) {
                redirectUrl = 'index.html';
            }
            
            sessionStorage.removeItem('auth_redirect_url'); // 擦除缓存
            window.location.href = redirectUrl; // 跳转
            return true;
        }
        return false;
    };

    // 🔒 3. 配置免密页面（如果是登录页本身，不执行后面的拦截重定向逻辑）
    if (window.location.pathname.endsWith('login.html')) return;

    // 🔒 4. 检查浏览器中是否有通过验证的通行证
    const isAuthed = sessionStorage.getItem('site_auth_token');

    if (isAuthed !== 'passed_successfully') {
        // 没登录，记录当前想访问的页面 URL
        sessionStorage.setItem('auth_redirect_url', window.location.href);
        
        // 强制重定向到登录页
        window.location.href = 'login.html';
    }
})();
