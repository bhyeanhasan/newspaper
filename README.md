# 📰 KhabarHub (সংবাদ সংযোগ)
### Bengali, English & International Newspaper Hub & Live Hot News Portal

A modern, fast, responsive React web application built with **React 19**, **Vite**, and **Vanilla CSS** connecting readers to curated Bengali newspapers, English national dailies from Bangladesh, premier international media outlets, and real-time breaking news feeds.

🔗 **Live Website**: [https://bhyeanhasan.github.io/newspaper/](https://bhyeanhasan.github.io/newspaper/)

---

## 🌟 Key Features

1. **🇧🇩 Bengali Newspapers (বাংলা সংবাদপত্র)**
   - Complete directory of major national dailies: *Prothom Alo, Daily Ittefaq, Bangladesh Pratidin, Jugantor, Samakal, Kaler Kantho, Manab Zamin, Bonik Barta, Kalbela, Desh Rupantor, Bangla Tribune, Jago News 24, Bdnews24 (Bangla), Dainik Azadi, etc.*
   - Direct website links & official **E-Paper** buttons.
   - Verified high-resolution official newspaper logos with responsive fallbacks.

2. **🗞️ English Newspapers in Bangladesh (ইংরেজি সংবাদপত্র)**
   - Top English dailies & financial press: *The Daily Star, Dhaka Tribune, The Business Standard (TBS), The Financial Express, New Age, Daily Sun, UNB, Dhaka Courier, etc.*
   - Direct reading links & E-Paper shortcuts.

3. **🌍 International Newspapers & Media (আন্তর্জাতিক সংবাদপত্র)**
   - Global investigative press: *BBC News, Reuters, The Guardian, The New York Times, Al Jazeera English, CNN, Washington Post, Financial Times, Bloomberg, The Wall Street Journal, DW, Le Monde, Times of India, Dawn, Nikkei Asia, etc.*
   - Filter by region (Global, Americas, UK & Europe, Middle East, Asia).

4. **🔥 Minimalist Live Hot News (শীর্ষ হট ও তাজা খবর)**
   - Distraction-free, clean typography layout (irrelevant stock photos removed).
   - Accurately displays publication timestamps: *এইমাত্র (Just now)*, *মিনিট আগে (m ago)*, *ঘণ্টা আগে (h ago)*, *গতকাল (Yesterday)*, or *N দিন আগে (Nd ago)* using exact calendar-day differences.
   - Automatically sanitized news summaries free from raw HTML tags and Google News boilerplate text.
   - Direct **[মূল পত্রিকায় সম্পূর্ণ পড়ুন]** buttons opening the publisher's exact article link.

5. **⚡ Live Breaking News Ticker**
   - High-impact animated marquee ticker with pause-on-hover interaction.

6. **🔍 Real-Time Global Search**
   - Instant search across all newspaper names, categories, and hot news stories.

7. **⭐ Bookmarks & Favorites (সংরক্ষিত তালিকা)**
   - Bookmark any newspaper or news story with automatic `localStorage` persistence.

8. **🌙 Dark & Light Mode + 🌐 Bilingual Language Toggle**
   - Seamless dark/light theme switching with smooth transitions.
   - Toggle entire UI between Bengali (বাংলা) and English.

9. **📖 Interactive News Preview Modal**
   - Clean, minimalistic reader popup with article summary, publication source attribution, and direct external link to the full story.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/bhyeanhasan/newspaper.git
cd newspaper

# Install dependencies
npm install
```

### 2. Local Development

```bash
# Start local development server with live RSS proxy
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Fetching Latest News Data Manually

```bash
# Runs the feed scraper to update fresh headlines in public/data/
node scripts/updateNews.js
```

### 4. Production Build & Local Preview

```bash
# Build production bundle (automatically runs prebuild to fetch latest news)
npm run build

# Preview production build locally
npm run preview
```

---

## 🚢 Deployment to GitHub Pages

The application is deployed to GitHub Pages and can be updated using either **npm scripts** or **GitHub Actions**.

### Option A: Manual CLI Deploy (Recommended for Local Pushes)

To build the latest bundle, update the news cache, and deploy directly to the `gh-pages` branch:

```bash
# Deploys directly to gh-pages branch
npm run deploy
```

> **What happens under the hood:**
> 1. `prebuild` executes `node scripts/updateNews.js` to fetch fresh live RSS feeds into `public/data/`.
> 2. `build` bundles the app into `dist/` with relative asset paths.
> 3. `predeploy` syncs `dist/` to `docs/`.
> 4. `deploy` pushes the distribution bundle to the `gh-pages` branch via `gh-pages -d dist`.

---

### Option B: Automated GitHub Actions CI/CD

The repository includes a GitHub Actions workflow at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) that handles deployments automatically:

1. **On Every Push to `main`**:
   Whenever changes are pushed to `main`, GitHub Actions automatically installs dependencies, runs `npm run build`, and deploys the generated bundle to GitHub Pages.
   
   ```bash
   git add -A
   git commit -m "Update application"
   git push origin main
   ```

2. **Scheduled News Refresh (Cron)**:
   The workflow runs on a **4-hour schedule** (`cron: '0 */4 * * *'`) to automatically fetch breaking news feeds and deploy updated headlines to GitHub Pages without requiring manual intervention.

3. **Manual Trigger (GitHub UI)**:
   Navigate to the **Actions** tab on GitHub, select **Deploy to GitHub Pages**, and click **Run workflow**.

---

## 📂 Project Architecture

```
newspaper/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Pages CI/CD & 4-hour news cron
├── public/
│   ├── data/
│   │   ├── latest-news-bd.json # Fresh Bangladesh top headlines (generated)
│   │   └── latest-news-int.json# Fresh International top headlines (generated)
│   ├── favicon.svg
│   └── icons.svg
├── scripts/
│   └── updateNews.js           # Automated RSS fetcher & sanitizer script
├── docs/                       # Synced production bundle for GitHub Pages
├── dist/                       # Vite production build artifacts
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Masthead, sticky utility bar, theme & language switcher
│   │   ├── HotNewsTicker.jsx   # Animated live breaking news marquee
│   │   ├── NavigationTabs.jsx  # Section tabs with category counts
│   │   ├── HotNewsSection.jsx  # Minimalist live hot stories with direct source links
│   │   ├── NewspaperSection.jsx# Newspaper directory cards with official logos
│   │   ├── NewsModal.jsx       # Modal reader view with source attribution
│   │   └── Footer.jsx          # Directory links, disclaimer & back-to-top
│   ├── data/
│   │   └── newspapersData.js   # 50+ Bengali, English, and International press data
│   ├── services/
│   │   └── newsService.js      # RSS XML parser, calendar-aware relative time formatter
│   ├── App.jsx                 # Global state, bookmarks, search & layout coordinator
│   ├── index.css               # Design system tokens, dark/light themes & typography
│   └── main.jsx
├── index.html                  # SEO meta tags, Google Fonts (Hind Siliguri, Inter)
├── package.json                # Project dependencies, build & deploy scripts
└── vite.config.js              # Vite configuration & dev news proxy middleware
```

---

## 📜 Available NPM Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with local news proxy middleware. |
| `npm run build` | Fetches live news (`prebuild`) and builds the production bundle in `dist/`. |
| `npm run predeploy` | Builds production app and mirrors `dist/` into `docs/`. |
| `npm run deploy` | Publishes the `dist/` directory directly to GitHub Pages (`gh-pages` branch). |
| `npm run preview` | Serves the production build locally for verification. |
| `npm run lint` | Runs `oxlint` for fast code linting and error checking. |

---

## 📄 License & Attribution

- **News Content & Trademarks**: All articles, headlines, and newspaper logos remain the intellectual property and copyright of their respective publishers.
- **Application Code**: Open-source under the [MIT License](LICENSE).
