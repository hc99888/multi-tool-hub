#!/bin/bash
set -Eeuo pipefail

COZE_WORKSPACE_PATH="${COZE_WORKSPACE_PATH:-$(pwd)}"

cd "${COZE_WORKSPACE_PATH}"

echo "=========================================="
echo "  歌词智能分析 - Android APK 构建脚本"
echo "=========================================="
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js"
    echo "   请安装 Node.js >= 18.0.0"
    exit 1
fi

echo "✓ Node.js 版本: $(node --version)"

# 检查 Java
if ! command -v java &> /dev/null; then
    echo "❌ 错误: 未找到 Java JDK"
    echo "   请安装 Java JDK 17 或更高版本"
    exit 1
fi

echo "✓ Java 版本: $(java -version 2>&1 | head -n 1)"

# 检查 Android SDK
if [ -z "$ANDROID_HOME" ]; then
    echo "⚠️  警告: ANDROID_HOME 环境变量未设置"
    echo "   尝试检测默认位置..."

    if [ -d "$HOME/Android/Sdk" ]; then
        export ANDROID_HOME="$HOME/Android/Sdk"
        echo "✓ 检测到 Android SDK: $ANDROID_HOME"
    else
        echo "❌ 错误: 未找到 Android SDK"
        echo "   请安装 Android SDK 并设置 ANDROID_HOME 环境变量"
        echo "   参考: BUILD_APK.md 中的环境要求章节"
        exit 1
    fi
fi

export PATH="$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator"
echo "✓ ANDROID_HOME: $ANDROID_HOME"

echo ""
echo "步骤 1: 构建前端项目..."
echo "-------------------------------"
pnpm run build

if [ $? -ne 0 ]; then
    echo "❌ 前端构建失败"
    exit 1
fi

echo "✓ 前端构建完成"
echo ""

echo "步骤 2: 同步到 Android 项目..."
echo "-------------------------------"
npx cap sync android

if [ $? -ne 0 ]; then
    echo "❌ 同步失败"
    exit 1
fi

echo "✓ 同步完成"
echo ""

echo "步骤 3: 构建 Android 项目..."
echo "-------------------------------"
cd android

# 清理之前的构建
./gradlew clean

# 构建 Debug APK
./gradlew assembleDebug

if [ $? -ne 0 ]; then
    echo "❌ Android 构建失败"
    exit 1
fi

echo "✓ Android 构建完成"
echo ""

cd ..

# 查找 APK 文件
APK_PATH="android/app/build/outputs/apk/debug/app-debug.apk"

if [ -f "$APK_PATH" ]; then
    echo "=========================================="
    echo "  🎉 构建成功！"
    echo "=========================================="
    echo ""
    echo "APK 文件位置:"
    echo "  $APK_PATH"
    echo ""
    echo "文件大小:"
    ls -lh "$APK_PATH" | awk '{print "  " $5}'
    echo ""
    echo "安装方法:"
    echo "  adb install $APK_PATH"
    echo ""
    echo "或直接传输 APK 文件到手机安装"
    echo ""
else
    echo "❌ 错误: 未找到生成的 APK 文件"
    echo "   预期位置: $APK_PATH"
    exit 1
fi

echo "构建脚本执行完成！"
