# 💎 FinTrackr – Premium Smart Expense Manager

FinTrackr is a production-grade, offline-first mobile application built with **React Native** and **Expo**. It provides a premium, high-performance experience for tracking daily expenses, visualizing financial health through animated charts, and managing categories with full cloud sync via Supabase.

---

## 📱 App Preview

| Dashboard | History | Add Transaction | Profile |
| :---: | :---: | :---: | :---: |
| ![Dashboard](./assets/images/preview/1-dashboard.png) | ![History](./assets/images/preview/2-history.png) | ![Add Transaction](./assets/images/preview/3-add-transaction.png) | ![Profile](./assets/images/preview/4-profile.png) |

---

### Authentication Screens

| Login | Register |
| :---: | :---: |
| ![Login](./assets/images/preview/5-login.png) | ![Register](./assets/images/preview/6-register.png) |

> [!TIP]
> **To add your own screenshots:** Replace the placeholder URLs above with your actual image paths from assets or external hosting.

---

## 🌟 Key Features

- **🚀 Performance-First**: Multi-threaded animations and optimized data layer using SQLite.
- **✨ Premium Branding**: Custom-designed high-resolution icons and splash screens with a modern Emerald & Charcoal aesthetic.
- **🛡️ Industry-Grade Logging**: Centralized pipeline capturing global console logs and JS crashes via `ErrorUtils`.
- **💾 Stable Storage**: Hybrid storage architecture using **SQLite** as the primary Supabase adapter for maximum reliability.
- **🎨 Manual Theme Switcher**: Toggle between **Light**, **Dark**, and **System Sync** directly from the Profile settings.
- **📊 Animated Visualizations**: Interactive Donut Pie Charts for category-based spending breakdown.
- **☁️ Cloud Authentication**: Secure login and profile management powered by **Supabase**.
- **📤 Data Export**: Export entire financial history to **CSV** via the native share sheet.
- **💎 Premium UI**: Token-based design system with specific HSL-tailored colors and smooth micro-interactions.

---

## 🛠️ Tech Stack

- **Core**: React Native, Expo (SDK 55)
- **Navigation**: Expo Router (Typed File-based)
- **State Management**: Zustand (+ Persistent Storage)
- **Backend/Auth**: Supabase
- **Storage Layer**: SQLite (Supabase Adapter) + AsyncStorage (Zustand)
- **Logging**: Centralized Class-based Logger + ErrorUtils
- **Visuals**: Gifted Charts, Expo Linear Gradient, Reanimated
- **Icons**: Expo Vector Icons (Material Community)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (LTS)
- Expo Go app on your mobile device (for development)
- A Supabase account

### 2. Installation
```bash
# Recommended Repository Name: FinTrackr-Expo
git clone https://github.com/your-username/FinTrackr-Expo.git

# Install dependencies
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add your Supabase credentials:
```env
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Running the App
```bash
# Start the development server
npx expo start -c
```

---

## 📦 Building for Production

To generate an APK for Android:
1. Install EAS CLI: `npm install -g eas-cli`
2. Configure the build: `eas build:configure`
3. Run the build:
   ```bash
   eas build -p android --profile preview
   ```

---

## 📂 Project Structure

- `app/`: Expo Router screens and layouts.
- `components/`: Reusable UI modules (Cards, Buttons, Charts).
- `store/`: Zustand stores for global state (Auth, Expenses).
- `lib/`: Utility functions (Supabase client, Export logic).
- `hooks/`: Custom hooks (Theme resolution, Debounce).
- `theme/`: Centralized design system (standardized colors, spacing, typography).
- `assets/`: Custom branding assets (icons, splash screens).

---

## 📄 License
MIT License.

