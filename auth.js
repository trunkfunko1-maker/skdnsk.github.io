// auth.js - 全局唯一拦截脚本
(function() {
    // 🔒 1. 配置免密页面（登录页本身必须放行，否则会陷入死循环）
    if (window.location.pathname.endsWith('login.html')) return;

    // 🔒 2. 配置您想设置的账号和密码
    const CORRECT_USER = "admin";
    const CORRECT_PASS = "123456";

    // 🔒 3. 检查浏览器中是否有通过验证的通行证
    const isAuthed = sessionStorage.getItem('site_auth_token');

    if (isAuthed !== 'passed_successfully') {
        // 如果是在登录页输入的触发表单，由内部函数处理，这里只做拦截
        // 记录当前被拦截的页面，方便登录后跳回来
        sessionStorage.setItem('auth_redirect_url', window.location.href);
        
        // 强制重定向到登录页
        // 使用相对根目录路径 '/'，确保在任何子文件夹下都能正确找到登录页
        window.location.href = '/login.html';
    }

    // 🔓 4. 暴露给登录页面调用的全局登录函数
    window.executeSiteLogin = function(username, password) {
        if (username === CORRECT_USER && password === CORRECT_PASS) {
            sessionStorage.setItem('site_auth_token', 'passed_successfully');
            const redirectUrl = sessionStorage.getItem('auth_redirect_url') || '/index.html';
            sessionStorage.removeItem('auth_redirect_url');
            window.location.href = redirectUrl;
            return true;
        }
        return false;
    };
})();
