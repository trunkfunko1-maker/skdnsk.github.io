---
layout: default
title: 联系我
---

# 联系我

如果您有任何想法或建议，请通过下方页面告知我。

<!-- 表单部分 -->
<div class="contact-container" style="max-width: 600px; margin-top: 20px;">
  <form id="contact-form" action="https://formspree.io/f/xzdoeald" method="POST">
    
  <div style="margin-bottom: 15px;">
      <label>您的邮箱:</label><br>
      <!-- 使用 type="text" 避开浏览器邮箱格式检测，name="contact" 避开服务商检测 -->
      <input type="text" name="contact" required style="width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px;">
    </div>
    <div style="margin-bottom: 15px;">
      <label>留言内容:</label><br>
      <textarea name="message" required style="width: 100%; height: 150px; padding: 10px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px;"></textarea>
    </div>

  <button id="submit-btn" type="submit" style="padding: 10px 25px; background-color: #24292e; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">
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
        status.style.color = "green";
        status.innerHTML = "✅ 发送成功！我已收到您的消息。";
        form.reset(); // 清空输入框
      } else {
        response.json().then(data => {
          if (Object.hasOwn(data, 'errors')) {
            status.innerHTML = data["errors"].map(error => error["message"]).join(", ");
          } else {
            status.style.color = "red";
            status.innerHTML = "❌ 哎呀！发送出错了，请稍后再试。";
          }
        })
      }
    }).catch(error => {
      status.style.color = "red";
      status.innerHTML = "❌ 网络错误，无法连接到服务器。";
    }).finally(() => {
      button.disabled = false;
      button.innerText = "立即发送";
    });
  }

  form.addEventListener("submit", handleSubmit);
</script>
