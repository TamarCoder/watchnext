# 🎬 Movie Catalog

A cross-platform movie catalog for **iOS, Android and web**, built with React Native and Expo.
Browse trending movies, search the full TMDB catalog, open details, and save favorites.

<p align="center">
  <img src="docs/screenshots/trending-dark.png" width="230" alt="Trending screen, dark mode" />
  <img src="docs/screenshots/details-light.png" width="230" alt="Movie details, light mode" />
  <img src="docs/screenshots/error-offline.png" width="230" alt="Offline error screen" />
</p>

<p align="center"><img src="docs/screenshots/demo.gif" width="300" alt="App demo" /></p>

## Features

- **Movies & TV Shows home** — auto-playing hero carousel, Top 10 row, genre chips, Now in cinemas, Coming soon, All-time best, Popular people
- **Details** — parallax backdrop, YouTube trailer, cast, director, where to watch, reviews, similar titles
- **People** — photo, biography and every movie or show they are known for
- **Genres & "See all"** — infinite grids with sorting (popular, top rated, newest)
- **Search** — movies, TV shows and people in one search, with filter tabs
- **Favorites** — movies and shows saved on the device, kept between launches
- **Motion** — staggered card entrance, press feedback, skeleton loaders, slide transitions
- **Dark mode** — follows the system theme; every colour comes from one token file
- **Any screen size** — the grid picks 2–5 columns from the screen width; the details screen switches to a two-column layout on tablets
- **Clear error screens** — offline, bad token, missing movie, server error, empty search; each with its own icon, text and a retry button when retrying can help

## Tech stack

| Area | Choice |
|---|---|
| Framework | React Native + Expo (SDK 58), TypeScript (strict) |
| Navigation | Expo Router — file-based routes, native tabs |
| Server state | TanStack Query — caching, paging, retry |
| Images | expo-image — caching and fade-in; expo-linear-gradient for overlays |
| Motion | react-native-reanimated — entrance, press and parallax animations |
| Icons | expo-symbols — SF Symbols on iOS, Material Symbols on Android |
| Storage | AsyncStorage — favorites |
| Quality | ESLint (eslint-config-expo), `tsc --noEmit`, expo-doctor |

## Architecture

```
src/
├── api/          tmdb.ts — the only file that talks to TMDB; typed errors,
│                 movies and TV normalized into one shape
├── app/          routes (Expo Router)
│   ├── (tabs)/   Movies · TV Shows · Search · Favorites
│   ├── movie/ tv/ [id].tsx — one shared details screen
│   ├── person/   [id].tsx — person page
│   ├── genre/    [id].tsx — genre grid with sorting
│   └── list/     [kind].tsx — "See all" grid
├── components/   TitleHome, HeroCarousel, TitleRow, TopTenRow, TitleDetails,
│                 MovieCard, MovieGrid, Skeleton, StateView / ErrorView
├── constants/    theme.ts — colour, spacing, radius and motion tokens
├── hooks/        useTitleList, useTitle, usePerson, useSearch, useTheme …
└── providers/    FavoritesProvider
```

**Why these choices**

- **Expo + Expo Router.** One TypeScript codebase for three platforms. Routes are files, so the folder tree *is* the navigation map.
- **TanStack Query instead of a global store.** Almost all state here is server data. Query gives caching, loading/error states, paging and retry for free, so there is no hand-written reducer.
- **One API module with typed errors.** `tmdb.ts` turns every failure into a `TmdbError` with a `kind` (`network`, `unauthorized`, `not-found`, …). Screens never read HTTP codes; `ErrorView` maps each kind to the right message, and the query client does not retry errors that a retry cannot fix.
- **Context for favorites.** It is small, local, device-only state. A store library would be more code than the feature itself.
- **Design tokens.** Light and dark palettes live in `constants/theme.ts`. Components only read tokens through `useTheme()`, so no colour is hard-coded in a screen.

## Getting started

1. Create a free TMDB account and copy your **API Read Access Token** from
   <https://www.themoviedb.org/settings/api>.
2. Create a `.env` file in the project root:
   ```bash
   EXPO_PUBLIC_TMDB_TOKEN=your_read_access_token
   ```
3. Install and run:
   ```bash
   npm install
   npx expo start
   ```
   Press `i` for iOS, `a` for Android, `w` for web.

> `EXPO_PUBLIC_` variables are bundled into the app. The TMDB read token is read-only, but for a production app put a small proxy server in front of the API.

## Scripts

| Command | What it does |
|---|---|
| `npm start` | Start the Expo dev server |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type check |

## Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB.

## License

MIT — see [LICENSE](LICENSE).
