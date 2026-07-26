# 📱 Urban Companion Mobile App Guide (PWA & Android APK)

This guide explains how to run, install, and package **Urban Companion** as a Mobile Application.

---

## 🌐 Option 1: PWA (Progressive Web App - Instant Install)

The PWA allows users to install **Urban Companion** directly to their Android, iPhone, iPad, or Desktop home screen with **zero app store approval required**.

### Features:
- 📱 Native app icon on Home Screen & App Drawer
- ⚡ Offline asset caching via Service Worker
- 🎯 Standalone fullscreen UI (hides browser address bar)
- 🔔 In-App "Install Urban Companion" prompt banner

### How to Install:
1. **On Android (Chrome / Edge)**:
   - Open the web app URL.
   - Tap the **"Install Urban Companion"** banner at the bottom OR tap the Chrome menu `⋮` and select **"Add to Home screen"** / **"Install app"**.

2. **On iOS (Safari)**:
   - Open the web app in Safari.
   - Tap the **Share button** (square with up arrow).
   - Select **"Add to Home Screen"**.

3. **On Desktop (Chrome / Edge / Brave)**:
   - Click the install icon in the URL address bar or click "Install" on the bottom banner.

---

## 🤖 Option 2: Capacitor Native Android Application (APK)

Package the frontend as a native Android App (`.apk`) using **Capacitor**.

### Prerequisites:
- **Node.js** (v18+)
- **Android Studio** (or Android SDK & Java JDK 17 installed)

### Step 1: Install Dependencies
Inside the `frontend/` directory, install Capacitor dependencies:
```bash
cd frontend
npm install @capacitor/core @capacitor/android
npm install -D @capacitor/cli
```

### Step 2: Initialize Capacitor Platform (First Time Only)
Add the Android platform to your project:
```bash
npx cap add android
```
*(This generates an `android/` directory containing a full Android Studio project structure).*

### Step 3: Build & Sync Web Assets
Whenever you update frontend code, build the web dist and sync to the native Android project:
```bash
npm run cap:sync
```
Or manually:
```bash
npm run build
npx cap sync
```

### Step 4: Build APK File

#### Method A: Using Android Studio (Recommended)
1. Open the native project in Android Studio:
   ```bash
   npx cap open android
   ```
2. In Android Studio, select **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
3. Once completed, your APK will be generated at:
   `android/app/build/outputs/apk/debug/app-debug.apk`

#### Method B: Command Line (Gradle)
Run from the `frontend/android` directory:
```bash
cd android
./gradlew assembleDebug
```

---

## 🔗 Connecting Mobile App to Backend Server

When running on a physical Android device or emulator, `localhost` points to the mobile device itself. To connect the mobile app to your backend:

1. Create or update `frontend/.env`:
   ```env
   VITE_API_BASE_URL=http://YOUR_LOCAL_IP:8000/api
   ```
   *(e.g., `http://192.168.1.100:8000/api` or your deployed Cloud Backend URL `https://your-backend.onrender.com/api`)*

2. Re-sync assets:
   ```bash
   npm run cap:sync
   ```
