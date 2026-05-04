---
layout: default
title: 联系我
---

# 联系我

你可以通过下方的表单直接向我发送信息：

<form action="https://formspree.io/f/xzdoeald" method="POST">
  <!-- 核心代码：发送成功后跳转回你的 thanks 页面 -->
  <input type="hidden" name="_next" value="contact.md">
  
  <label>您的邮箱：</label>
  <input type="email" name="email">
  </div>
  
  <div style="margin-bottom: 15px;">
    <label>留言内容：</label><br>
    <textarea name="message" required style="width: 100%; height: 150px; padding: 8px;"></textarea>
  </div>

  <button type="submit" style="padding: 10px 20px; background: #24292e; color: white; border: none; cursor: pointer;">
    发送邮件
  </button>
</form>
