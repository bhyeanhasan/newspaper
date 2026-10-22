import React, { useState, useEffect } from 'react';
import { 
  Newspaper, 
  Search, 
  X, 
  Moon, 
  Sun, 
  Bookmark, 
  CloudSun, 
  Clock, 
  Calendar,
  Languages,
  Sparkles
} from 'lucide-react';

const CITIES = [
  { name: 'Dhaka', nameBn: 'ঢাকা', temp: '28°C', condition: 'Sunny / রৌদ্রোজ্জ্বল' },
  { name: 'Chattogram', nameBn: 'চট্টগ্রাম', temp: '27°C', condition: 'Humid / আর্দ্র' },
  { name: 'London', nameBn: 'লন্ডন', temp: '16°C', condition: 'Cloudy / মেঘলা' },
  { name: 'New York', nameBn: 'নিউ ইয়র্ক', temp: '18°C', condition: 'Clear / পরিষ্কার' }
];

export default function Header({ 
  searchQuery, 
  setSearchQuery, 
  theme, 
  toggleTheme, 
  lang, 
  setLang, 
  bookmarkCount, 
  onGoToBookmarks,
  onResetTab,
  children
}) {
  const [cityIndex, setCityIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState({ en: '', bn: '' });

  // Update clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      
      const enDate = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });

      // Bengali date format representation
      const bnDate = `${now.toLocaleDateString('bn-BD', { weekday: 'long' })}, ${now.toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}`;
      
      setCurrentDate({ en: enDate, bn: bnDate });
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentCity = CITIES[cityIndex];

  const cycleCity = () => {
    setCityIndex((prev) => (prev + 1) % CITIES.length);
  };

  return (
    <header className="site-header-container">
      {/* Top Utility Bar */}
      <div className="top-utility-bar">
        <div className="utility-content">
          <div className="utility-left">
            <span className="utility-item">
              <Calendar size={14} className="text-red-500" />
              <span>{lang === 'bn' ? currentDate.bn : currentDate.en}</span>
            </span>
            <span className="utility-item">
              <Clock size={14} />
              <span>{currentTime}</span>
            </span>
          </div>

          <div className="utility-right">
            <button 
              className="weather-badge" 
              onClick={cycleCity}
              title="Click to cycle cities"
            >
              <CloudSun size={15} color="#f59e0b" />
              <span>{lang === 'bn' ? currentCity.nameBn : currentCity.name}: {currentCity.temp}</span>
            </button>

            <button 
              className="lang-toggle-btn"
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              title="Change Language / ভাষা পরিবর্তন"
            >
              <Languages size={15} />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Unified Sticky Navbar Wrapper (Glues Masthead and Tabs together with 0 gap) */}
      <div className="sticky-navbar-wrapper">
        <div className="site-masthead">
          <div className="masthead-inner">
            {/* Logo & Branding */}
            <div className="brand-section" onClick={onResetTab}>
              <div className="brand-logo-icon">
                <Newspaper size={26} strokeWidth={2.2} />
              </div>
              <div>
                <div className="brand-title">
                  Khabar<span>Hub</span>
                </div>
                <div className="brand-subtitle">
                  {lang === 'bn' 
                    ? 'জাতীয়, ইংরেজি ও আন্তর্জাতিক সংবাদ মাধ্যম' 
                    : 'Bengali, English & International Press Hub'}
                </div>
              </div>
            </div>

            {/* Search Input */}
            <div className="search-wrapper">
              <Search className="search-icon" size={18} />
              <input 
                type="text"
                className="search-input"
                placeholder={lang === 'bn' ? 'পত্রিকা বা হট নিউজ অনুসন্ধান করুন...' : 'Search newspapers, hot news or topics...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className="search-clear" 
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Actions: Theme Toggle, Bookmarks */}
            <div className="masthead-actions">
              <button 
                className="icon-btn" 
                onClick={onGoToBookmarks}
                title={lang === 'bn' ? 'সংরক্ষিত পত্রিকা ও খবর' : 'Saved Bookmarks'}
              >
                <Bookmark size={19} />
                {bookmarkCount > 0 && (
                  <span className="badge-count">{bookmarkCount}</span>
                )}
              </button>

              <button 
                className="icon-btn" 
                onClick={toggleTheme}
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun size={19} color="#f59e0b" /> : <Moon size={19} />}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs rendered inside sticky wrapper */}
        {children}
      </div>
    </header>
  );
}
