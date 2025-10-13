# Gym Log (barbellbook)

A lightweight React + Capacitor app for logging strength training workouts. This README describes the repository layout, main technologies, how to run the app for development and native targets, and where to find key files.

## Tech stack

-   Frontend: React 19 + TypeScript
-   Bundler / dev server: Vite
-   Mobile: Capacitor (iOS / Android bridges)
-   Styling: TailwindCSS
-   Charts: Recharts
-   Extras: Framer Motion, react-router-dom

## Quick scripts

-   `npm run dev` — start Vite dev server
-   `npm run build` — production build (web + used by native builds)
-   `npm run preview` — preview production build locally
-   `npm run ios:open` — sync Capacitor and open the iOS workspace in Xcode
-   `npm run ios:build` — build & run the iOS app on Simulator (xcodebuild)
-   `npm run android:open` — open Android project in Android Studio
-   `npm run android:build` — build Android debug APK

See `package.json` for the exact commands.

## Project structure (top-level)

Summary of the repository layout and purpose for top-level folders and important files.

-   `src/` — application source code (React + TSX)

    -   `App.tsx` — root app component and routing
    -   `main.tsx` — React entry and Vite boot
    -   `index.css` — global styles (Tailwind entry)
    -   `assets/` — icons and images
    -   `components/` — reusable UI components grouped by purpose
        -   `common/` — generic controls and small UI pieces (Buttons, Inputs, Loader, Menu)
        -   `layout/` — layout components
        -   `pages/` — page-level components used by routing
    -   `context/` — React Context providers (e.g., `SettingsContext.tsx`, `WorkoutContext.tsx`)
    -   `data/` — static data (e.g., `exercises.json`)
    -   `hooks/` — custom hooks (timers, overlays)
    -   `layouts/` — page layout wrappers like `DefaultLayout.tsx`
    -   `pages/` — route pages (Home, Workout, Stats, History, Settings, etc.)
    -   `types/` — shared TypeScript types (e.g., `workout.ts`)
    -   `utils/` — utility helpers (calculations, date formatting, greetings)

-   `public/` — static web assets (icons, manifest, app icons)
-   `android/` — Capacitor-managed Android project (Gradle, native code)
-   `ios/` — Capacitor-managed iOS project (Xcode workspace, Pods)
-   `build/` — CI/local build artifacts and reports (Gradle, others)

Top-level config

-   `package.json` — scripts & dependencies
-   `vite.config.ts` — Vite configuration
-   `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json` — TypeScript configs
-   `capacitor.config.ts` — Capacitor config for native builds
-   `eslint.config.ts` — ESLint rules

## Folder reference (detailed)

-   `src/components/common` — small UI building blocks used across pages. Look here first when adding buttons, inputs, or other controls.
-   `src/context` — global state providers. `SettingsContext` manages user preferences; `WorkoutContext` holds workout session and logged data.
-   `src/pages` — page components mapped by routes. Each file is a self-contained page (fetching/consuming context as needed).
-   `src/hooks` — reusable logic extracted from components (timers, tab navigation, overlays).
-   `src/utils` — pure helper functions (1RM calculators, trend calculations, date/time helpers). Keep logic here and write unit tests when you add important algorithms.

## How to run (development)

1. Install dependencies:

    npm install

2. Start the dev server:

    npm run dev

Open http://localhost:5173 (Vite default) to view the app.

## How to run on devices / emulators

-   iOS (macOS + Xcode required):

    -   Sync Capacitor & open Xcode: `npm run ios:open`
    -   Or build and run on Simulator via `npm run ios:build` (this runs `pod install` and `xcodebuild` as defined in scripts)

-   Android:
    -   Open Android project in Android Studio: `npm run android:open`
    -   Or build a debug APK: `npm run android:build`

Note: Native builds require the relevant SDKs (Xcode for iOS, Android SDK/NDK/Gradle for Android) installed and configured.

## Conventions and notes

-   TypeScript is used across the app; prefer typed components and export shared types into `src/types`.
-   Keep presentational components in `components/` and page-level logic inside `pages/`.
-   Place pure functions in `utils/` and add unit tests for important calculations (e.g., `calculate1RM.ts`, `calculateTrend.ts`).
-   Use contexts for cross-cutting state (settings, workout session). Keep context providers minimal and testable.
