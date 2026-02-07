# 歌词智能分析 - APK构建指南

## 项目概述

本项目是一个基于 Next.js + Capacitor 的歌词智能分析应用，已配置为可构建 Android APK。

## 应用信息

- **应用名称**: 歌词智能分析
- **包名**: com.lyricsanalyzer.app
- **技术栈**:
  - 前端: Next.js 16 + React 19 + TypeScript
  - UI: shadcn/ui + Tailwind CSS
  - 移动端: Capacitor 8
  - 后端: Node.js API (需单独部署)

## 重要说明

⚠️ **关于API配置**

本应用使用后端API来调用大语言模型（LLM）。由于APK是静态应用，需要：

1. **部署后端API**: 将 `/src/app/api/lyrics/` 目录下的API路由部署到云端服务器
2. **配置API地址**: 在代码中配置API的基础URL

### 当前状态

- ✅ 前端已打包为静态文件（在 `out/` 目录）
- ✅ Capacitor Android 项目已配置（在 `android/` 目录）
- ⚠️ API路由需要单独部署到云端

## 环境要求

### Windows/macOS/Linux

1. **Node.js**: >= 18.0.0
2. **Java JDK**: 17 或更高版本
3. **Android SDK**:
   - 通过 Android Studio 安装
   - 或使用 Android Command Line Tools
4. **Gradle**: 8.0+ (Android项目中已包含)

### 安装 Android SDK

#### 方法1: 通过 Android Studio

1. 下载并安装 [Android Studio](https://developer.android.com/studio)
2. 打开 Android Studio
3. 进入 Settings/Preferences → Appearance & Behavior → System Settings → Android SDK
4. 安装以下组件：
   - Android SDK Platform-Tools
   - Android SDK Build-Tools
   - Android 14 (API 34) 或更高版本

#### 方法2: 通过命令行工具

```bash
# 下载 Android Command Line Tools
wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip

# 解压并设置环境变量
unzip commandlinetools-linux-11076708_latest.zip
mkdir -p ~/Android/Sdk/cmdline-tools
mv cmdline-tools ~/Android/Sdk/cmdline-tools/latest

# 设置环境变量（添加到 ~/.bashrc 或 ~/.zshrc）
export ANDROID_HOME=~/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

# 安装必要的SDK包
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"
```

## 构建步骤

### 1. 克隆或获取项目代码

```bash
cd /workspace/projects
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 构建 Next.js 项目

```bash
pnpm run build
```

### 4. 同步 Web 资源到 Android 项目

```bash
npx cap sync android
```

### 5. 打开 Android 项目

```bash
# 使用 Android Studio 打开（推荐）
npx cap open android

# 或使用命令行构建
cd android
./gradlew assembleDebug
```

### 6. 构建调试版 APK

#### 使用命令行：

```bash
cd android

# 构建调试版 APK
./gradlew assembleDebug

# APK 位置
# linux/mac: android/app/build/outputs/apk/debug/app-debug.apk
# windows: android\app\build\outputs\apk\debug\app-debug.apk
```

#### 使用 Android Studio：

1. 打开项目：`Build → Build Bundle(s) / APK(s) → Build APK(s)`
2. 等待构建完成
3. 点击 "locate" 查找生成的 APK 文件

### 7. 构建发布版 APK

#### 签名配置

创建签名文件：

```bash
keytool -genkey -v -keystore release.keystore -alias lyrics-analyzer -keyalg RSA -keysize 2048 -validity 10000
```

#### 配置签名

创建或编辑 `android/app/build.gradle`，添加：

```gradle
android {
    ...

    signingConfigs {
        release {
            storeFile file("../../release.keystore")
            storePassword "your-store-password"
            keyAlias "lyrics-analyzer"
            keyPassword "your-key-password"
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

#### 构建发布版 APK

```bash
./gradlew assembleRelease
```

APK 位置：
- `android/app/build/outputs/apk/release/app-release.apk`

## 开发工作流

### 开发阶段

```bash
# 启动 Next.js 开发服务器（端口5000）
pnpm run dev

# 在另一个终端启动 Capacitor 同步
npx cap sync android
npx cap run android
```

### 修改代码后

```bash
# 1. 重新构建前端
pnpm run build

# 2. 同步到 Android
npx cap sync android

# 3. 重新运行
npx cap run android
```

## 常见问题

### 问题1: ANDROID_HOME 环境变量未设置

**解决方案**:

```bash
# Linux/macOS
export ANDROID_HOME=~/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator

# Windows (PowerShell)
$env:ANDROID_HOME = "C:\Users\YourName\AppData\Local\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator"
```

### 问题2: Gradle 构建失败

**解决方案**:

```bash
cd android

# 清理构建缓存
./gradlew clean

# 使用 Gradle Wrapper 构建
./gradlew assembleDebug --stacktrace
```

### 问题3: 无法找到设备

**解决方案**:

```bash
# 检查设备连接
adb devices

# 启动模拟器
emulator -avd <your-avd-name>

# 或使用 Android Studio 的 AVD Manager
```

### 问题4: API 调用失败

**问题原因**: 静态应用无法调用本地 API

**解决方案**:

1. 部署 API 到云端服务器
2. 修改前端代码，配置 API 基础 URL

修改 `src/app/page.tsx`:

```typescript
const API_BASE_URL = 'https://your-api-server.com'; // 替换为你的API地址

const response = await fetch(`${API_BASE_URL}/api/lyrics/${type}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ lyrics: input }),
});
```

## 项目结构

```
.
├── android/                    # Capacitor Android 项目
│   ├── app/
│   │   ├── build.gradle       # 应用级构建配置
│   │   └── src/main/
│   │       ├── assets/        # Web 资源
│   │       └── res/           # Android 资源
│   └── build.gradle           # 项目级构建配置
├── out/                        # Next.js 静态构建输出
├── src/                        # Next.js 源代码
│   ├── app/
│   │   ├── api/lyrics/        # API 路由（需单独部署）
│   │   └── page.tsx           # 主页面
│   └── components/ui/         # UI 组件
├── capacitor.config.ts         # Capacitor 配置
├── next.config.ts              # Next.js 配置
├── package.json                # 项目依赖
└── BUILD_APK.md               # 本文档
```

## 部署后端 API

### 方案1: Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
cd src/app/api
vercel
```

### 方案2: Railway

1. 创建新项目
2. 选择 Next.js 模板
3. 推送代码到 GitHub
4. 连接 Railway 仓库

### 方案3: AWS Lambda + API Gateway

使用 Serverless Framework 或 SAM 部署 Next.js API 路由。

## 技术支持

- [Capacitor 官方文档](https://capacitorjs.com/docs)
- [Next.js 官方文档](https://nextjs.org/docs)
- [Android Studio 下载](https://developer.android.com/studio)

## 许可证

本项目仅供学习和个人使用。

---

**构建愉快！🎉**
