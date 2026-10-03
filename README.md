# ⚡ PulseFeed — Personalized Omni-Content Dashboard

> **Software Development Engineer (SDE) Intern — Frontend Development Assignment**  
> Candidate: **Pushpendar Singh** ([@PushpendarSingh23](https://github.com/PushpendarSingh23))  
> Built with: **React 18 • Next.js 14 (App Router) • TypeScript • Redux Toolkit • Tailwind CSS • Framer Motion • Vitest**

---

## 🌟 Executive Overview

**PulseFeed** is a high-performance, responsive **Personalized Content Dashboard** designed to aggregate, curate, and stream multi-channel data streams into a unified, interactive interface. Users can track breaking news, movie/media recommendations, podcasts, and trending social conversations with customizable tracking algorithms, drag-and-drop feed reorganization, full internationalization (5 languages), dark/cyberpunk theming, and real-time live ticker simulations.

---

## 🚀 Key Features

### 1. Personalized Content Feed
- **Smart User Preferences**: Configurable interest categories (`AI & AGI`, `Technology`, `Finance & Crypto`, `Sports & Fitness`, `Entertainment`, `Health & Wellness`, `Science & Space`) and source channels (`News`, `Recommendations`, `Social`, `Audio/Podcasts`).
- **Dynamic Multi-Source Ingestion**: Hybrid architecture integrating News APIs, TMDB/Spotify media recommendations, and social feeds with zero-config resilient fallback engines.
- **Interactive Content Cards**: Rich media previews, category/source badges, live flame indicators, reaction counters, celebratory confetti bookmarks, and direct external references.
- **Infinite Scrolling & Pagination**: IntersectionObserver-powered infinite scroll with smooth shimmer skeleton states.

### 2. Modern Dashboard Layout & Navigation
- **Responsive Workspace**: Collapsible sidebar for desktop with quick category filter tracking and a mobile drawer.
- **Curated Section Views**:
  - 📰 **Personalized Stream**: Algorithmic unified feed.
  - 🔥 **Trending Spotlight**: Ranked viral leaderboard with hero carousel.
  - ⭐️ **Favorites Archive**: Bookmarks manager with search, category filtering, and one-click **JSON/CSV export**.
  - 📊 **Activity & Insights**: Reading analytics, estimated consumption time, and category distribution charts.

### 3. Advanced Search & Filtering
- **Debounced Search Input**: Performance-optimized real-time search with visual debounce loader, clear trigger, and global `/` keyboard shortcut.
- **Multi-Level Filters**: Filter simultaneously by Category, Media Source, and Sort Mode (*Latest*, *Most Popular*, *Highest Rated*, *Trending*).

### 4. Advanced UI/UX & Motion Interactions
- **Drag-and-Drop Feed Reorganization**: Smooth layout animations with Framer Motion `Reorder.Group` allowing users to reorder cards according to their personal reading priority.
- **Theming**: Dark Mode, Light Mode, System Sync, and high-contrast **Cyberpunk Mode** with localStorage persistence.
- **Audio & Trailer Previews**: In-modal movie trailer streaming and audio playback simulation.
- **Confetti Particle Micro-Interactions**: Real-time particle explosions on card bookmarking.

### 5. Robust State Management & Persistence
- **Redux Toolkit Architecture**:
  - `preferencesSlice`: Categories, media sources, theme, language, view modes, and auto-refresh settings.
  - `contentSlice`: Asynchronous thunks for feed data fetching, live item injection, like toggles, and drag-and-drop array mutations.
  - `favoritesSlice`: Bookmarked items with fast lookup, deletion, and bulk export.
  - `authSlice`: User profiles with **instant one-click Demo Persona switching** (`Pushpendar Singh`, `Sarah Jenkins`, `Elena Rostova`, `Guest Mode`).
  - `notificationsSlice`: Live breaking alerts and notification drawer history.
- **Local Storage Synchronization**: Custom middleware subscriber ensuring seamless session persistence across browser reloads.

### 6. Internationalization (i18n)
- Native typed internationalization supporting **5 languages**:
  - 🇺🇸 English (`en`)
  - 🇪🇸 Spanish / Español (`es`)
  - 🇮🇳 Hindi / हिन्दी (`hi`)
  - 🇫🇷 French / Français (`fr`)
  - 🇩🇪 German / Deutsch (`de`)

### 7. Real-Time Streaming Simulator
- Background event loop simulating **WebSockets / Server-Sent Events (SSE)** delivering breaking alerts, live chimes, and automatic feed injections.

---

## 🛠 Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5 (Strict mode) |
| **State Management** | Redux Toolkit (`@reduxjs/toolkit`, `react-redux`) |
| **Styling & UI** | Tailwind CSS 3, Lucide React, Glassmorphism |
| **Animations & DnD** | Framer Motion (Reorder & Layout animations), Canvas Confetti |
| **Testing** | Vitest, React Testing Library, JSDOM, User Event |
| **Build Tooling** | Node.js, PostCSS, ESLint |

---

## 📁 Project Architecture

```
personalized-content-dashboard/
├── e2e/
│   └── dashboard.spec.ts          # E2E test scenarios & specifications
├── src/
│   ├── __tests__/                 # Comprehensive Unit & Integration Tests
│   │   ├── components/            # Component tests (ContentCard, Search, Settings)
│   │   ├── store/                 # Redux slice unit tests (preferences, favorites, content)
│   │   └── setup.ts               # JSDOM matchMedia & LocalStorage polyfills
│   ├── app/
│   │   ├── globals.css            # Custom glassmorphism, themes & scrollbars
│   │   ├── layout.tsx             # Root Layout with Redux & Theme Providers
│   │   └── page.tsx               # Master Dashboard Page Orchestrator
│   ├── components/
│   │   ├── analytics/             # Reading statistics & distribution charts
│   │   ├── common/                # Badges, Skeletons, DebouncedInput, Toast
│   │   ├── favorites/             # Bookmarks archive, search & CSV/JSON export
│   │   ├── feed/                  # ContentCard, Drag-and-drop ContentFeed
│   │   ├── layout/                # Top Header & Collapsible Sidebar
│   │   ├── modals/                # Content Preview Modal, Settings, Auth, Notifications
│   │   ├── providers/             # ReduxProvider, ThemeProvider & Live Stream engine
│   │   └── trending/              # Trending leaderboard & Spotlight hero
│   ├── lib/
│   │   ├── i18n/                  # Multi-language dictionary & translation helper
│   │   └── store/                 # Redux Store, Slices & Persistence Subscriber
│   ├── services/
│   │   ├── apiService.ts          # Content service with pagination, filtering & sorting
│   │   └── mockData.ts            # High-fidelity realistic mock data across 7 domains
│   └── types/
│       └── index.ts               # TypeScript interfaces & types
├── vitest.config.ts               # Test runner configuration
├── tailwind.config.ts             # Tailwind dark mode & color tokens
├── package.json                   # Dependencies & build scripts
└── README.md                      # Comprehensive project documentation
```

---

## ⚡ Quick Start & Setup Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm** or **yarn**

### 1. Clone the Repository
```bash
git clone https://github.com/PushpendarSingh23/personalized-content-dashboard.git
cd personalized-content-dashboard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to explore the dashboard!

---

## 🧪 Running Tests

PulseFeed comes with 100% passing Unit, Integration, and E2E test suites:

### Run Vitest Test Suite
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Production Build Verification
```bash
npm run build
npm run start
```

---

## 💡 User Flow & Usage Guide

1. **Customizing Your Feed**:
   - Click the **Preferences (Sliders)** button in the header or sidebar.
   - Toggle categories on/off and select your preferred media sources.
   - Choose your preferred language (English, Spanish, Hindi, French, German) and visual theme.
2. **Reordering Content**:
   - In the feed, simply grab and drag any card vertically to reorganize your personal reading hierarchy.
3. **Saving & Exporting**:
   - Click the bookmark icon on any card to save it to your Favorites.
   - Navigate to the **Favorites** section from the sidebar and click **Download JSON** or **Download CSV** to export your bookmarks.
4. **Switching Demo Accounts**:
   - Click the profile avatar in the header to switch between different demo personas (e.g. *Pushpendar Singh*, *Sarah Jenkins*, *Elena Rostova*) or edit your profile bio.

---

## 👤 Author & Submission Details

- **Candidate**: Pushpendar Singh
- **Role**: Software Development Engineer (SDE) Intern — Frontend Development
- **GitHub Profile**: [@PushpendarSingh23](https://github.com/PushpendarSingh23)
- **Repository**: [personalized-content-dashboard](https://github.com/PushpendarSingh23/personalized-content-dashboard)

---
*Developed with focus on Clean Architecture, Scalability, WCAG Accessibility, Performance, and Fluid UI Interactions.*
