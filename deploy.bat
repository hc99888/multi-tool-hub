@echo off
chcp 65001 >nul
echo ==========================================
echo   Multi-Tool Hub - GitHub 部署脚本
echo ==========================================
echo.

echo 📋 项目信息：
echo    GitHub 用户名: HC99888
echo    仓库名称: multi-tool-hub
echo    仓库类型: Public
echo.

echo 🔍 检查 Git 配置...
git remote -v | findstr origin
if %errorlevel% neq 0 (
    echo ➕ 配置远程仓库...
    git remote add origin https://github.com/HC99888/multi-tool-hub.git
) else (
    echo ✅ 远程仓库已配置
    git remote set-url origin https://github.com/HC99888/multi-tool-hub.git
)

echo.
echo 📦 准备推送代码...
echo.
echo ⚠️  首次推送需要 GitHub 认证
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   请选择认证方式：
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo   方法 1: 使用 GitHub CLI (推荐)
echo     1. 安装 GitHub CLI: https://cli.github.com/
echo     2. 运行: gh auth login
echo     3. 推送: git push -u origin main
echo.
echo   方法 2: 使用 Personal Access Token
echo     1. 创建 Token: https://github.com/settings/tokens
echo     2. 用户名输入: HC99888
echo     3. 密码输入: 粘贴 token (不是密码!)
echo.
echo   方法 3: 使用 SSH 密钥
echo     1. 生成: ssh-keygen -t ed25519 -C "your_email@example.com"
echo     2. 添加: https://github.com/settings/keys
echo     3. 修改 URL: git remote set-url origin git@github.com:HC99888/multi-tool-hub.git
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 🚀 现在尝试推送代码...
echo.
echo 如果提示认证，请按照上面的方法配置
echo.

git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ 代码已成功推送到 GitHub！
    echo.
    echo 🌐 访问您的仓库:
    echo    https://github.com/HC99888/multi-tool-hub
    echo.
    echo 🎯 下一步 - 部署到 Vercel:
    echo    1. 访问: https://vercel.com
    echo    2. 使用 GitHub 账号登录
    echo    3. 导入 'multi-tool-hub' 仓库
    echo    4. 点击 'Deploy'
    echo.
    echo 📖 详细说明请查看: YOUR_DEPLOYMENT.md
    echo.
) else (
    echo.
    echo ❌ 推送失败
    echo.
    echo 💡 提示:
    echo    1. 首次推送需要配置 GitHub 认证
    echo    2. 推荐使用 GitHub CLI (方法 1)
    echo    3. 或使用 Personal Access Token (方法 2)
    echo.
    echo 📖 详细说明请查看: YOUR_DEPLOYMENT.md
    echo.
)

pause
