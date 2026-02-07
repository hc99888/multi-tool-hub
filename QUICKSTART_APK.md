# 快速构建 APK

## 前提条件

✅ 已安装 Android SDK
✅ 已安装 Java JDK 17+
✅ 已设置 ANDROID_HOME 环境变量

详细安装步骤请参考 [BUILD_APK.md](BUILD_APK.md)

## 一键构建（推荐）

在项目根目录运行：

```bash
pnpm run build:android
```

这个命令会自动：
1. 构建 Next.js 前端项目
2. 同步到 Android 项目
3. 构建 Debug APK

构建完成后，APK 文件位于：
```
android/app/build/outputs/apk/debug/app-debug.apk
```

## 开发模式

### 1. 启动前端开发服务器

```bash
pnpm run dev
```

### 2. 在另一个终端同步到 Android

```bash
pnpm run sync:android
```

### 3. 运行到设备

```bash
# 连接 Android 设备或启动模拟器
adb devices

# 运行应用
pnpm run android:run
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm run build:android` | 完整构建 APK（推荐） |
| `pnpm run sync:android` | 同步前端代码到 Android |
| `pnpm run android:run` | 运行到设备/模拟器 |
| `pnpm run android:open` | 用 Android Studio 打开项目 |
| `npx cap sync android` | 手动同步（Capacitor 命令） |

## 手动构建步骤

如果你想手动控制每个步骤：

```bash
# 1. 构建前端
pnpm run build

# 2. 同步到 Android
npx cap sync android

# 3. 构建 APK
cd android
./gradlew assembleDebug

# 4. 查找 APK
cd ..
ls -lh android/app/build/outputs/apk/debug/app-debug.apk
```

## 安装 APK 到设备

### 方法1: 使用 adb

```bash
# 连接设备
adb devices

# 安装
adb install android/app/build/outputs/apk/debug/app-debug.apk

# 卸载
adb uninstall com.lyricsanalyzer.app
```

### 方法2: 直接传输

1. 将 APK 文件传输到手机
2. 在手机上点击安装
3. 允许安装未知来源应用

## 构建发布版 APK

### 1. 创建签名文件

```bash
keytool -genkey -v -keystore release.keystore \
  -alias lyrics-analyzer \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

### 2. 配置签名

编辑 `android/app/build.gradle`，添加签名配置：

```gradle
android {
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

### 3. 构建发布版

```bash
cd android
./gradlew assembleRelease
```

APK 文件位于：
```
android/app/build/outputs/apk/release/app-release.apk
```

## 故障排查

### 问题：无法找到 Android SDK

```bash
# 设置环境变量
export ANDROID_HOME=~/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### 问题：Gradle 构建失败

```bash
cd android
./gradlew clean
./gradlew assembleDebug --stacktrace
```

### 问题：设备未连接

```bash
# 检查设备连接
adb devices

# 重启 adb
adb kill-server
adb start-server
```

## 重要提示

⚠️ **关于 API 配置**

当前应用使用本地 API，但在 APK 中需要配置云端 API 地址：

1. 部署后端 API 到云端（Vercel、Railway 等）
2. 修改 `src/app/page.tsx` 中的 API 地址

示例：
```typescript
const API_BASE_URL = 'https://your-api-server.com';

const response = await fetch(`${API_BASE_URL}/api/lyrics/${type}`, ...);
```

更多详情请参考 [BUILD_APK.md](BUILD_APK.md)

## 技术支持

- 完整文档: [BUILD_APK.md](BUILD_APK.md)
- Capacitor 官方文档: https://capacitorjs.com/docs
- Android Studio 下载: https://developer.android.com/studio

---

**祝你构建顺利！🚀**
