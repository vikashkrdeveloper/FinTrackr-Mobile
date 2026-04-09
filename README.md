# FinTrackr – Smart Expense Manager

FinTrackr is a production-grade, offline-first mobile application built with **React Native** and **Expo**. It provides a premium experience for tracking daily expenses, visualizing financial health through animated charts, and managing categories with full cloud sync via Supabase.

---

## 📱 App Preview

| Dashboard | Transactions | Analytics | Profile |
| :---: | :---: | :---: | :---: |
| ![Dashboard](https://placehold.co/300x600/1A1A1A/FFFFFF?text=Dashboard) | ![History](https://placehold.co/300x600/1A1A1A/FFFFFF?text=History) | ![Analytics](https://placehold.co/300x600/1A1A1A/FFFFFF?text=Analytics) | ![Profile](https://placehold.co/300x600/1A1A1A/FFFFFF?text=Profile) |

---

## 🌟 Key Features

- **🚀 Performance-First**: Multi-threaded animations and optimized data layer.
- **🛡️ Industry-Grade Logging**: Centralized pipeline capturing global console logs and JS crashes via `ErrorUtils`.
- **💾 Stable Storage**: Hybrid storage architecture using **SQLite** as the primary Supabase adapter for maximum reliability.
- **🎨 Manual Theme Switcher**: Toggle between **Light**, **Dark**, and **System Sync** directly from the Profile settings.
- **📊 Animated Visualizations**: Interactive Donut Pie Charts for category-based spending breakdown.
- **☁️ Cloud Authentication**: Secure login and profile management powered by **Supabase**.
- **📤 Data Export**: Export entire financial history to **CSV** via the native share sheet.
- **💎 Premium UI**: Token-based design system with specific HSL-tailored colors and smooth micro-interactions.

---

## 🛠️ Tech Stack

- **Core**: React Native, Expo (SDK 54)
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
# Clone the repository
git clone <your-repo-url>

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
- `hooks/`: Custom hooks (Theme resolution).
- `theme/`: Centralized design system (standardized colors, spacing, typography).

---

## 📄 License
MIT License.
