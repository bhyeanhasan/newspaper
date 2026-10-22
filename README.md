# 📰 KhabarHub (সংবাদ সংযোগ)
### Bengali, English & International Newspaper Hub & Live Hot News Portal

A modern, responsive React web application built with **Vite** and **Vanilla CSS** connecting readers to curated Bengali newspapers, English national dailies from Bangladesh, premier international media outlets, and breaking hot news.

---

## 🌟 Key Features

1. **🇧🇩 Bengali Newspapers (বাংলা সংবাদপত্র)**
   - Complete directory of major national dailies: *Prothom Alo, Daily Ittefaq, Bangladesh Pratidin, Jugantor, Samakal, Kaler Kantho, Manab Zamin, Bonik Barta, Kalbela, Desh Rupantor, Bangla Tribune, Jago News 24, Bdnews24 (Bangla), Dainik Azadi, etc.*
   - Direct website links & official **E-Paper** buttons.
   - Filter by National, Heritage, Business, Tabloid, Online 24/7, and Regional.

2. **🗞️ English Newspapers in Bangladesh (ইংরেজি সংবাদপত্র)**
   - Top English dailies & financial press: *The Daily Star, Dhaka Tribune, The Business Standard (TBS), The Financial Express, New Age, Daily Sun, UNB, Dhaka Courier, etc.*
   - Direct reading links & E-Paper shortcuts.

3. **🌍 International Newspapers & Media (আন্তর্জাতিক সংবাদপত্র)**
   - Global investigative press: *BBC News, Reuters, The Guardian, The New York Times, Al Jazeera English, CNN, Washington Post, Financial Times, Bloomberg, The Wall Street Journal, DW, Le Monde, Times of India, Dawn, Nikkei Asia, etc.*
   - Filter by region (Global, Americas, UK & Europe, Middle East, Asia).

4. **🔥 Hot News of Bangladesh Newspapers (বাংলাদেশের হট নিউজ)**
   - Curated trending headlines, lead stories, and breaking updates from top Bangladeshi publications.
   - Categorized by Economy, Tech & AI, Logistics & Trade, Agriculture, Sports, and City Life.

5. **🌐 Hot News of International Newspapers (আন্তর্জাতিক হট নিউজ)**
   - Breaking global news covering Climate Summits, Tech/AI breakthroughs, Global Markets, Geopolitics, and Astronomy.

6. **⚡ Live Breaking News Ticker**
   - High-impact animated marquee ticker with pause-on-hover interaction.

7. **🔍 Real-Time Global Search**
   - Instant search across all newspaper names, categories, and hot news stories.

8. **⭐ Bookmarks & Favorites (সংরক্ষিত তালিকা)**
   - Bookmark any newspaper or news story with automatic `localStorage` persistence.

9. **🌙 Dark & Light Mode + 🌐 Bilingual Language Toggle**
   - Seamless dark/light theme switching with smooth transitions.
   - Toggle entire UI between Bengali (বাংলা) and English.

10. **📖 Interactive News Preview Modal**
    - Clean reader popup with article summary, publication source attribution, and direct external link to the full story.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/noyon/newspaper.git
cd newspaper

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## 📂 Project Architecture

```
newspaper/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Header.jsx          # Top utility bar (weather, clock, date), search & logo
│   │   ├── HotNewsTicker.jsx   # Animated live breaking news ticker
│   │   ├── NavigationTabs.jsx  # Main section tabs with badge counts
│   │   ├── HotNewsSection.jsx  # BD & International hot stories, hero card & modal trigger
│   │   ├── NewspaperSection.jsx# Newspaper directory cards, E-Paper links, filters
│   │   ├── NewsModal.jsx       # Modal reader view with source attribution
│   │   └── Footer.jsx          # Directory links, disclaimer & back-to-top
│   ├── data/
│   │   └── newspapersData.js   # Comprehensive dataset of BD & Global papers & hot news
│   ├── App.jsx                 # Main state, bookmarks, theme & layout coordinator
│   ├── index.css               # Modern design system & CSS variables (Dark/Light)
│   └── main.jsx
├── index.html                  # SEO tags, Hind Siliguri, Inter & Outfit Google fonts
├── package.json
└── vite.config.js
```

