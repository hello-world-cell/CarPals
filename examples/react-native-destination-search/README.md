# Destination search + autocomplete (React Native)

This folder is a **standalone pattern** for React Native. The main CarPals repo is **React (Vite)**; copy these files into an **Expo** or **React Native CLI** app.

## Features

- Debounced query state
- Abortable API calls
- Dropdown list of suggestions
- **OneMap** (Singapore, official SLA data) — token from [OneMap register](https://www.onemap.gov.sg/apidocs/register)
- **Google Places Autocomplete** (optional) — use a **backend proxy** in production; never ship an unrestricted key in a store build

## Setup

1. Create an app (e.g. `npx create-expo-app@latest my-app && cd my-app`).
2. Copy `src/` from this folder into your app (merge paths as you prefer).
3. Install deps if needed: `npx expo install` (core `react-native` APIs are built-in).

## Environment

- **OneMap:** set `EXPO_PUBLIC_ONEMAP_TOKEN` (Expo) or `ONEMAP_TOKEN` in your env / `app.config.js` `extra`.
- **Google (optional):** `EXPO_PUBLIC_GOOGLE_PLACES_KEY` — restrict by Android SHA-1 / iOS bundle ID in Google Cloud Console.

## OneMap auth

Search uses:

`GET https://www.onemap.gov.sg/api/common/elastic/search?...`

Header: `Authorization: <your access token>` (see [Search API docs](https://www.onemap.gov.sg/apidocs/search/)).

Tokens expire (~3 days); production apps should implement [token renewal](https://www.onemap.gov.sg/apidocs/docs/tokenmanagement).

## Google Places (optional)

Uses the legacy **Place Autocomplete** JSON endpoint. For production, call it from your server and return normalized results to the app.
