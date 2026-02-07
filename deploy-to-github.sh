#!/bin/bash

# ==========================================
# GitHub 部署脚本 - Multi-Tool Hub
# ==========================================

echo "🚀 开始部署到 GitHub..."
echo ""

# 配置信息
GITHUB_USERNAME="HC99888"
REPO_NAME="multi-tool-hub"
REMOTE_URL="https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

echo "📋 项目信息："
echo "   GitHub 用户名: ${GITHUB_USERNAME}"
echo "   仓库名称: ${REPO_NAME}"
echo "   仓库地址: ${REMOTE_URL}"
echo ""

# 检查远程仓库
echo "🔍 检查远程仓库配置..."
if git remote get-url origin &>/dev/null; then
    echo "✅ 远程仓库已配置"
    git remote set-url origin ${REMOTE_URL}
else
    echo "➕ 添加远程仓库..."
    git remote add origin ${REMOTE_URL}
fi

echo ""
echo "📦 准备推送代码..."
echo ""
echo "⚠️  注意：首次推送需要 GitHub 认证"
echo ""
echo "方法 1️⃣: 使用 GitHub CLI (推荐)"
echo "   1. 安装 gh: https://cli.github.com/"
echo "   2. 登录: gh auth login"
echo "   3. 推送: git push -u origin main"
echo ""
echo "方法 2️⃣: 使用 Personal Access Token"
echo "   1. 访问: https://github.com/settings/tokens"
echo "   2. 创建新 token (需要 repo 权限)"
echo "   3. 推送: git push -u origin main"
echo "   4. 输入用户名: ${GITHUB_USERNAME}"
echo "   5. 输入密码: 使用 token 而不是密码"
echo ""
echo "方法 3️⃣: 使用 SSH 密钥"
echo "   1. 生成 SSH key: ssh-keygen -t ed25519 -C \"your_email@example.com\""
echo "   2. 添加到 GitHub: https://github.com/settings/keys"
echo "   3. 修改远程 URL: git remote set-url origin git@github.com:${GITHUB_USERNAME}/${REPO_NAME}.git"
echo "   4. 推送: git push -u origin main"
echo ""

# 执行推送
echo "🚀 尝试推送代码..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 代码已成功推送到 GitHub！"
    echo ""
    echo "🌐 访问您的仓库:"
    echo "   ${REMOTE_URL}"
    echo ""
    echo "🎯 下一步 - 部署到 Vercel:"
    echo "   1. 访问: https://vercel.com"
    echo "   2. 登录 GitHub 账号"
    echo "   3. 点击 'Add New' → 'Project'"
    echo "   4. 选择 '${REPO_NAME}' 仓库"
    echo "   5. 点击 'Deploy'"
    echo ""
else
    echo ""
    echo "❌ 推送失败"
    echo ""
    echo "请按照上面的方法 1️⃣ 2️⃣ 3️⃣ 之一配置 GitHub 认证后重试"
    echo ""
fi
