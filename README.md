# Subscription App (Expo)

A simple subscription tracking UI built with Expo Router and NativeWind, with a custom email/password authentication flow powered by Clerk.

## Tech

- Expo + Expo Router (file-based routing)
- NativeWind (Tailwind-style styling)
- Clerk (@clerk/expo) + expo-secure-store for secure session token storage

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Add your Clerk publishable key to `.env`:

   ```env
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   ```

3. Start the app:

   ```bash
   npx expo start
   ```

## Scripts

- `npm run lint` — lint the project
- `npm run android` / `npm run ios` / `npm run web` — platform shortcuts

## Routes (high level)

- `app/(auth)/sign-in.tsx` — sign in (email/password)
- `app/(auth)/sign-up.tsx` — sign up + email verification code
- `app/(tabs)/*` — main app tabs (protected)
- `app/(tabs)/settings.tsx` — account details + sign out
