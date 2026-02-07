# 🚀 项目部署指南

本指南将帮助您将多功能工具中心部署到GitHub和Vercel，让所有人都可以在线使用。

## 📋 部署前准备

### 1. 创建GitHub仓库

1. 访问 https://github.com/new
2. 创建新仓库：`multi-tool-hub`
3. 选择 Public（公开）或 Private（私有）
4. **不要**初始化 README、.gitignore 或 License
5. 点击 "Create repository"

### 2. 安装Git工具

确保您的电脑已安装Git：
```bash
git --version
```

如果没有安装，请访问 https://git-scm.com/downloads 下载安装。

## 🎯 快速部署到Vercel（推荐）

Vercel是最简单、最快的Next.js部署方式。

### 步骤1：推送到GitHub

在项目根目录执行：

```bash
# 初始化Git
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: Multi-Tool Hub"

# 添加远程仓库（替换为您的用户名）
git remote add origin https://github.com/yourusername/multi-tool-hub.git

# 推送到GitHub
git branch -M main
git push -u origin main
```

### 步骤2：部署到Vercel

#### 方式A：通过网页界面（推荐）

1. 访问 https://vercel.com
2. 点击右上角 "Sign Up" 或 "Log In"
3. 使用GitHub账号登录并授权
4. 点击 "Add New" → "Project"
5. 选择 `multi-tool-hub` 仓库
6. 配置项目：
   - **Project Name**: multi-tool-hub
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
7. 点击 "Deploy"
8. 等待2-3分钟，构建完成！

#### 方式B：通过Vercel CLI

```bash
# 安装Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel
```

### 步骤3：配置域名（可选）

1. 在Vercel项目设置中
2. 点击 "Domains"
3. 添加自定义域名或使用提供的 `.vercel.app` 域名
4. 按照提示配置DNS

## 🔧 部署到GitHub Pages

如果需要使用GitHub Pages：

### 1. 修改配置

创建或修改 `next.config.js`：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
```

### 2. 安装gh-pages

```bash
pnpm add -D gh-pages
```

### 3. 修改package.json

添加以下脚本：

```json
{
  "scripts": {
    "export": "next build",
    "deploy": "gh-pages -d out",
    "deploy:ci": "next build && gh-pages -d out"
  }
}
```

### 4. 部署

```bash
pnpm run export
pnpm run deploy
```

访问：https://yourusername.github.io/multi-tool-hub

## 🤖 自动化部署（GitHub Actions）

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
          
      - name: Install dependencies
        run: pnpm install
        
      - name: Build
        run: pnpm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### 配置GitHub Secrets

1. 在GitHub仓库中，进入 Settings → Secrets and variables → Actions
2. 添加以下secrets：
   - `VERCEL_TOKEN`: 从 Vercel Account Settings → Tokens 创建
   - `ORG_ID`: 从 Vercel 项目设置中获取
   - `PROJECT_ID`: 从 Vercel 项目设置中获取

## 📊 部署检查清单

在部署前，确保：

- [ ] 所有依赖已安装 (`pnpm install`)
- [ ] 本地开发服务器正常运行 (`pnpm run dev`)
- [ ] 构建成功无错误 (`pnpm run build`)
- [ ] README.md 已更新
- [ ] .gitignore 配置正确
- [ ] 环境变量已配置（如需要）

## 🔍 常见问题

### Q1: 构建失败，提示找不到模块

**解决方案**：
```bash
# 清除缓存重新安装
rm -rf node_modules .next
pnpm install
```

### Q2: Vercel部署后API无法访问

**解决方案**：
- 检查API路由是否正确导出
- 确认使用动态导入或服务端组件
- 查看Vercel日志获取详细错误

### Q3: 图片显示不出来

**解决方案**：
- GitHub Pages需要配置 `images.unoptimized: true`
- Vercel会自动优化图片，无需额外配置

### Q4: 环境变量未生效

**解决方案**：
- 在Vercel项目设置中添加环境变量
- 重新部署项目
- 确保使用 `process.env.VARIABLE_NAME`

## 📝 部署后维护

### 更新项目

```bash
# 拉取最新代码
git pull origin main

# 安装新依赖
pnpm install

# 本地测试
pnpm run dev

# 提交更新
git add .
git commit -m "Update feature"
git push origin main
```

### 查看部署状态

- **Vercel**: 访问项目Dashboard查看部署日志
- **GitHub Pages**: 查看Actions标签页的构建日志

## 🎉 完成部署

部署完成后，您将获得：

1. ✅ 一个在线可访问的网址
2. ✅ 自动HTTPS加密
3. ✅ 全球CDN加速
4. ✅ 自动部署更新
5. ✅ 自定义域名支持

## 📞 需要帮助？

如果遇到问题，请：

1. 查看项目的Issues
2. 检查Vercel/GitHub的部署日志
3. 参考官方文档：
   - [Vercel文档](https://vercel.com/docs)
   - [Next.js部署](https://nextjs.org/docs/deployment)
   - [GitHub Pages](https://docs.github.com/pages)

---

**祝您部署顺利！🚀**
