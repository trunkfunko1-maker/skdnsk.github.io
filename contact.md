---
layout: default
title: 联系我
---

<!-- 🔑 核心补充：引入全自动安全与暗黑主题脚本 -->
<script src="/auth.js?v=6"></script>

# 联系我

如果您有任何想法或建议，请通过下方页面告知我。

<!-- 表单部分 -->
<div class="contact-container" style="max-width: 600px; margin-top: 20px;">
<form id="contact-form" action="https://formspree.io/f/xzdoeald" method="POST">

<div style="margin-bottom: 15px;">
<label>您的邮箱:</label><br>
<input type="text" name="contact" required style="width: 100%; padding: 10px; margin-top: 5px; border-radius: 4px;">
</div>

<div style="margin-bottom: 15px;">
<label>留言内容:</label><br>
<!-- 🔒 已加入 resize: none; 彻底锁死右下角拖拽功能，防止排版变形 -->
<textarea name="message" required style="width: 100%; height: 150px; padding: 10px; margin-top: 5px; border-radius: 4px; resize: none;"></textarea>
</div>

<!-- 这里的按钮样式已被 auth.js 自动接管，变为精美的炫绿圆角按钮 -->
<button id="submit-btn" type="submit" style="padding: 12px 30px; font-size: 16px;">
立即发送
</button>

<!-- 状态显示区域 -->
<p id="form-status" style="margin-top: 15px; font-weight: bold;"></p>
</form>
</div>

<!-- JavaScript 逻辑：处理异步提交，防止跳转 -->
<script>
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");
const button = document.getElementById("submit-btn");

async function handleSubmit(event) {
event.preventDefault(); // 阻止表单默认的跳转行为
const data = new FormData(event.target);
button.disabled = true;
button.innerText = "发送中...";
status.innerHTML = "正在努力发送...";

fetch(event.target.action, {
method: form.method,
body: data,
headers: {
'Accept': 'application/json'
}
}).then(response => {
if (response.ok) {
status.style.color = "#2ed573"; /* 配合暗黑模式改为亮绿色 */
status.innerHTML = "✅ 发送成功！我已收到您的消息。";
form.reset(); // 清空输入框
} else {
response.json().then(data => {
if (Object.hasOwn(data, 'errors')) {
status.innerHTML = data["errors"].map(error => error["message"]).join(", ");
} else {
status.style.color = "#ff4d4f";
status.innerHTML = "❌ 哎呀！发送出错了，请稍后再试。";
}
})
}
}).catch(error => {
status.style.color = "#ff4d4f";
status.innerHTML = "❌ 网络错误，无法连接到服务器。";
}).finally(() => {
button.disabled = false;
button.innerText = "立即发送";
});
}

form.addEventListener("submit", handleSubmit);
</script>
