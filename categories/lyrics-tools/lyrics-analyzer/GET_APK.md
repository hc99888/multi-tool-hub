# 如何获取 APK 文件

## 当前状态说明

⚠️ **当前沙箱环境无法构建 APK**

原因：缺少以下必要工具：
- Java JDK 17+
- Android SDK
- Gradle 构建工具

## 获取 APK 的三种方案

### 方案一：在本地构建（推荐）✅

这是最可靠的方式，可以在自己的电脑上构建。

#### 步骤：

1. **克隆或下载项目代码**
   ```bash
   # 如果有Git仓库
   git clone <your-repo-url>
   cd projects

   # 或直接下载项目文件夹
   ```

2. **安装必要工具**

   **a. 安装 Node.js**
   - 下载: https://nodejs.org (推荐 18+ 版本)
   - 验证: `node --version`

   **b. 安装 Java JDK**
   - 下载: https://www.oracle.com/java/technologies/downloads/ (JDK 17)
   - 或使用 OpenJDK: `apt install openjdk-17-jdk`
   - 验证: `java -version`

   **c. 安装 Android SDK**

   **方式1: 通过 Android Studio (推荐)**
   - 下载: https://developer.android.com/studio
   - 安装后打开 Settings → SDK Manager
   - 安装以下组件：
     - Android SDK Platform-Tools
     - Android SDK Build-Tools 34.0.0
     - Android 14 (API 34)

   **方式2: 通过命令行**
   ```bash
   # Linux
   wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
   unzip commandlinetools-linux-11076708_latest.zip
   mkdir -p ~/Android/Sdk/cmdline-tools
   mv cmdline-tools ~/Android/Sdk/cmdline-tools/latest

   # 设置环境变量（添加到 ~/.bashrc）
   export ANDROID_HOME=~/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools
   export PATH=$PATH:$ANDROID_HOME/emulator

   # 安装SDK包
   sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"
   ```

3. **安装项目依赖**
   ```bash
   cd /path/to/projects
   pnpm install
   ```

4. **一键构建 APK**
   ```bash
   pnpm run build:android
   ```

5. **获取 APK 文件**

   构建成功后，APK 文件位于：
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

6. **安装到手机**
   ```bash
   # 使用 USB 连接手机
   adb devices

   # 安装 APK
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

#### 详细文档
- 📘 [BUILD_APK.md](BUILD_APK.md) - 完整构建指南
- 🚀 [QUICKSTART_APK.md](QUICKSTART_APK.md) - 快速入门

---

### 方案二：使用在线构建服务 ☁️

如果不想在本地安装Android SDK，可以使用在线构建平台。

#### 推荐平台：

**1. GitHub Actions**
- 免费使用
- 自动构建
- 可下载APK

**2. Codemagic**
- https://codemagic.io
- 免费额度有限
- 简单易用

**3. Appcircle**
- https://appcircle.io
- CI/CD 平台
- 支持多种项目类型

#### 使用 GitHub Actions 示例：

1. **创建 GitHub 仓库**
2. **推送项目代码**
3. **创建 `.github/workflows/build-apk.yml`**:

```yaml
name: Build Android APK

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install pnpm
      uses: pnpm/action-setup@v2
      with:
        version: 8

    - name: Install dependencies
      run: pnpm install

    - name: Build Next.js
      run: pnpm run build

    - name: Setup Java
      uses: actions/setup-java@v3
      with:
        distribution: 'zulu'
        java-version: '17'

    - name: Setup Android SDK
      uses: android-actions/setup-android@v2

    - name: Grant execute permission for gradlew
      run: chmod +x android/gradlew

    - name: Build Debug APK
      run: |
        cd android
        ./gradlew assembleDebug

    - name: Upload APK
      uses: actions/upload-artifact@v3
      with:
        name: app-debug
        path: android/app/build/outputs/apk/debug/app-debug.apk
```

4. **推送后自动触发构建**
5. **在 Actions 页面下载 APK**

---

### 方案三：联系开发者获取 📧

如果您不熟悉构建过程，可以：

1. **联系项目负责人**
2. **提供以下信息**：
   - 您的邮箱地址
   - 需要的应用版本（debug/release）
   - 特殊需求（如自定义配置）

3. **等待收到 APK 文件**
   - 通过邮件或网盘链接获取
   - 直接安装到手机

---

## 快速参考

### 如果您有 Git 访问权限

```bash
# 1. 克隆项目
git clone <your-repo-url>
cd projects

# 2. 安装依赖
pnpm install

# 3. 构建APK
pnpm run build:android

# 4. 查找APK
ls -lh android/app/build/outputs/apk/debug/app-debug.apk
```

### 如果您使用在线构建

1. 推送代码到 GitHub
2. 等待 Actions 自动构建
3. 从 Actions 页面下载 APK

### 如果您需要帮助

- 📧 联系开发者
- 📚 阅读 [BUILD_APK.md](BUILD_APK.md)
- 💬 提交 Issue 反馈问题

---

## 常见问题

### Q: 为什么沙箱环境不能构建？
A: 沙箱环境没有安装 Android SDK 和 Java，这些工具体积较大且需要特定的环境配置。

### Q: 本地构建需要多久？
A: 首次构建需要 10-20 分钟（下载依赖），后续构建只需 2-5 分钟。

### Q: APK 文件多大？
A: 大约 5-15 MB（取决于功能和资源）。

### Q: 可以在 iOS 上使用吗？
A: 当前只配置了 Android 平台。如需 iOS，需要：
- Mac 电脑
- Xcode
- Apple 开发者账号（签名）

### Q: debug 版和 release 版有什么区别？
A:
- **Debug 版**：开发测试用，体积大，性能一般，可调试
- **Release 版**：发布用，体积小，性能优化，需要签名

---

## 技术支持

- 📘 完整构建指南: [BUILD_APK.md](BUILD_APK.md)
- 🚀 快速入门: [QUICKSTART_APK.md](QUICKSTART_APK.md)
- 📋 项目状态: [APK_READY.md](APK_READY.md)
- 🌐 Capacitor 文档: https://capacitorjs.com/docs

---

**选择最适合您的方案，获取 APK 文件！** 📱
