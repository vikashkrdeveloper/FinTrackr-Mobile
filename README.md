# FinTrackr – Smart Expense Manager

FinTrackr is a production-grade, offline-first mobile application built with **React Native** and **Expo**. It provides users with a premium experience for tracking daily expenses, visualizing financial health through animated charts, and managing categories with full cloud sync via Supabase.

---

## 🌟 Key Features

- **Dynamic Dashboard**: Real-time tracking of Total Income, Expenses, and Remaining Balance.
- **Animated Visualizations**: Interactive Donat Pie Charts for category-based spending breakdown.
- **Advanced History**: Search, filter by type (Income/Expense), and filter by custom categories.
- **Custom Categories**: Create bespoke categories with dynamic icons and theme-consistent colors.
- **Cloud Authentication**: Secure login and profile management powered by **Supabase**.
- **Data Export**: Export your entire financial history to **CSV** via the native share sheet.
- **Premium UI**: Token-based design system with full Dark Mode support and micro-interactions.

---

## 🛠️ Tech Stack

- **Core**: React Native, Expo (SDK 54)
- **Navigation**: Expo Router (File-based)
- **State Management**: Zustand (+ Persistence)
- **Backend/Auth**: Supabase
- **Visuals**: React Native Gifted Charts, Expo Linear Gradient
- **Animations**: React Native Reanimated
- **Icons**: Expo Vector Icons (Material Community)
- **Persistence**: AsyncStorage

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
npx expo start
```

---

## 📦 Building for Production

To generate an APK for Android:
1. Install EAS CLI: `npm install -g eas-cli`
2. Log in to Expo: `eas login`
3. Configure the build: `eas build:configure`
4. Run the build:
   ```bash
   eas build -p android --profile preview
   ```
   *This will generate a shareable APK link.*

---

## 📂 Project Structure

- `app/`: Expo Router screens and layouts.
- `components/`: Reusable UI modules (Cards, Buttons, Charts).
- `store/`: Zustand stores for global state (Auth, Expenses).
- `lib/`: Utility functions (Supabase client, Export logic).
- `theme/`: Centralized design system (Colors, Spacing, Typography).
- `assets/`: App icons, splash screens, and screenshots.

---

## 📄 License
This project is licensed under the MIT License.
