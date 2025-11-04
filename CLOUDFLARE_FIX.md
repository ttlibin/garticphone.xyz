# Cloudflare拦截解决方案

## 问题说明

当使用代理服务器访问garticphone.com时，Cloudflare的安全服务会拦截请求，显示：
- "Please enable cookies"
- "Sorry, you have been blocked"

这是因为Cloudflare检测到请求来自代理服务器而非真实浏览器。

## 解决方案

我已经更新了服务器配置，使其：

1. **模拟真实浏览器** - 使用完整的浏览器User-Agent
2. **添加浏览器请求头** - 包括Accept、Accept-Language等
3. **处理Cookie** - 正确转发和处理Cookie
4. **移除代理标识** - 删除可能暴露代理身份的请求头

## 如何应用修复

### 方法1：重启服务器（推荐）

1. 在运行服务器的终端按 `Ctrl + C` 停止服务器
2. 重新运行 `npm start`

### 方法2：使用开发模式（自动重启）

```bash
npm run dev
```

这样代码修改后会自动重启。

## 如果仍然被拦截

### 选项A：等待一段时间

Cloudflare可能对IP有临时限制，等待10-30分钟后重试。

### 选项B：使用VPN或更换网络

如果您的IP被标记，可以尝试：
- 使用VPN
- 更换网络连接（如移动热点）
- 重启路由器获取新IP

### 选项C：直接访问方案

如果代理持续被拦截，可以考虑：
1. 在网站中直接链接到 https://garticphone.com（新窗口打开）
2. 使用官方的iframe嵌入方案（如果提供）

## 测试代理是否工作

访问：`http://localhost:3000/test-proxy`

如果看到JSON响应而不是Cloudflare拦截页面，说明代理工作正常。

## 技术说明

Cloudflare使用多种技术检测机器人：
- User-Agent检测
- 请求头模式分析
- Cookie行为分析
- IP信誉评分
- TLS指纹识别

我们的修复主要针对前两项，但某些情况下Cloudflare仍可能拦截。

