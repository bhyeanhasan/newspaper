import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import HotNewsTicker from './components/HotNewsTicker';
import NavigationTabs from './components/NavigationTabs';
import HotNewsSection from './components/HotNewsSection';
import NewspaperSection, { NewspaperLogo } from './components/NewspaperSection';
import NewsModal from './components/NewsModal';
import Footer from './components/Footer';

import { 
  BENGALI_NEWSPAPERS, 
  ENGLISH_NEWSPAPERS, 
  INTERNATIONAL_NEWSPAPERS, 
  HOT_NEWS_BANGLADESH, 
  HOT_NEWS_INTERNATIONAL 
} from './data/newspapersData';

import { 
  fetchLiveBangladeshNews, 
  fetchLiveInternationalNews 
} from './services/newsService';

import { 
  Newspaper, 
  BookOpen, 
  Globe, 
  Bookmark, 
  Check, 
  Trash2,
  ExternalLink 
} from 'lucide-react';

export default function App() {
  // Theme state (dark / light)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('khabarhub_theme') || 'dark';
  });

  // Language state ('bn' / 'en')
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('khabarhub_lang') || 'bn';
  });

  // Dynamic Hot News state
  const [bdHotNews, setBdHotNews] = useState(HOT_NEWS_BANGLADESH);
  const [intHotNews, setIntHotNews] = useState(HOT_NEWS_INTERNATIONAL);
  const [isNewsLoading, setIsNewsLoading] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState('');

  // Navigation state
  const [activeTab, setActiveTab] = useState('hot-news');
  const [searchQuery, setSearchQuery] = useState('');

  // Bookmarks state (saved item IDs)
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('khabarhub_bookmarks');
      return saved ? JSON.parse(saved) : ['prothom-alo', 'daily-star', 'bbc-news'];
    } catch (e) {
      return ['prothom-alo', 'daily-star', 'bbc-news'];
    }
  });

  // Active news item for preview modal
  const [activeModalNews, setActiveModalNews] = useState(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState(null);

  // Apply theme to <html> document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('khabarhub_theme', theme);
  }, [theme]);

  // Persist language
  useEffect(() => {
    localStorage.setItem('khabarhub_lang', lang);
  }, [lang]);

  // Persist bookmarks
  useEffect(() => {
    localStorage.setItem('khabarhub_bookmarks', JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Function to dynamically fetch recent hot news
  const loadDynamicNews = useCallback(async (isManual = false) => {
    setIsNewsLoading(true);
    try {
      const [liveBd, liveInt] = await Promise.all([
        fetchLiveBangladeshNews(),
        fetchLiveInternationalNews()
      ]);

      if (liveBd && liveBd.length > 0) {
        setBdHotNews(liveBd);
      }
      if (liveInt && liveInt.length > 0) {
        setIntHotNews(liveInt);
      }

      const now = new Date();
      setLastUpdatedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

      if (isManual) {
        showToast(lang === 'bn' ? 'তাজা খবর সফলভাবে আপডেট করা হয়েছে!' : 'Live news successfully updated!');
      }
    } catch (error) {
      console.error('Failed to fetch dynamic news:', error);
      if (isManual) {
        showToast(lang === 'bn' ? 'সংবাদ রিফ্রেশে ত্রুটি হয়েছে, সংরক্ষিত খবর প্রদর্শিত হচ্ছে' : 'Failed to refresh, showing cached news');
      }
    } finally {
      setIsNewsLoading(false);
    }
  }, [lang]);

  // Initial dynamic fetch on mount
  useEffect(() => {
    loadDynamicNews(false);
  }, [loadDynamicNews]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleToggleBookmark = (item) => {
    const isSaved = bookmarkedIds.includes(item.id);
    let updated;
    if (isSaved) {
      updated = bookmarkedIds.filter(id => id !== item.id);
      showToast(lang === 'bn' ? 'বুকমার্ক সরানো হয়েছে' : 'Removed from bookmarks');
    } else {
      updated = [...bookmarkedIds, item.id];
      showToast(lang === 'bn' ? 'বুকমার্কে সংরক্ষণ করা হয়েছে' : 'Saved to bookmarks');
    }
    setBookmarkedIds(updated);
  };

  const handleShare = async (item) => {
    const title = lang === 'bn' ? (item.title || item.name) : (item.titleEn || item.nameEn || item.name);
    const url = item.newsUrl || item.url || item.sourceUrl || window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Check this out on KhabarHub: ${title}`,
          url
        });
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      showToast(lang === 'bn' ? 'লিংক কপি করা হয়েছে!' : 'Link copied to clipboard!');
    } catch (e) {
      showToast(url);
    }
  };

  // Derive dynamic ticker headlines from currently loaded live news
  const dynamicTickerHeadlines = [
    ...bdHotNews.slice(0, 4).map(item => ({
      text: item.title,
      category: item.source || 'বাংলাদেশ',
      newsUrl: item.newsUrl,
      sourceUrl: item.sourceUrl,
      fullItem: item
    })),
    ...intHotNews.slice(0, 4).map(item => ({
      text: item.title,
      category: item.source || 'আন্তর্জাতিক',
      newsUrl: item.newsUrl,
      sourceUrl: item.sourceUrl,
      fullItem: item
    }))
  ];

  // Compute items in bookmarks
  const allItems = [
    ...BENGALI_NEWSPAPERS,
    ...ENGLISH_NEWSPAPERS,
    ...INTERNATIONAL_NEWSPAPERS,
    ...bdHotNews,
    ...intHotNews
  ];
  const bookmarkedItems = allItems.filter(item => bookmarkedIds.includes(item.id));

  // Category filters for sections
  const bengaliCategories = [
    { id: 'national', labelBn: 'জাতীয় দৈনিক', labelEn: 'National' },
    { id: 'heritage', labelBn: 'ঐতিহ্যবাহী', labelEn: 'Heritage' },
    { id: 'business', labelBn: 'বাণিজ্য', labelEn: 'Business' },
    { id: 'online', labelBn: 'অনলাইন পোর্টাল', labelEn: 'Online 24/7' },
    { id: 'tabloid', labelBn: 'ট্যাবলয়েড', labelEn: 'Tabloid' },
    { id: 'regional', labelBn: 'আঞ্চলিক (চট্টগ্রাম/উত্তরবঙ্গ)', labelEn: 'Regional' }
  ];

  const englishCategories = [
    { id: 'national', labelBn: 'জাতীয় দৈনিক', labelEn: 'National Daily' },
    { id: 'business', labelBn: 'বাণিজ্য ও অর্থনীতি', labelEn: 'Business & Economy' },
    { id: 'agency', labelBn: 'সংবাদ সংস্থা', labelEn: 'Wire Agency' },
    { id: 'online', labelBn: 'অনলাইন পোর্টাল', labelEn: 'Online' },
    { id: 'magazine', labelBn: 'ম্যাগাজিন', labelEn: 'Magazine' }
  ];

  const internationalCategories = [
    { id: 'Global', labelBn: 'বৈশ্বিক বার্তা সংস্থা', labelEn: 'Global' },
    { id: 'Americas', labelBn: 'আমেরিকা ও যুক্তরাষ্ট্র', labelEn: 'Americas' },
    { id: 'UK & Europe', labelBn: 'যুক্তরাজ্য ও ইউরোপ', labelEn: 'UK & Europe' },
    { id: 'Middle East', labelBn: 'মধ্যপ্রাচ্য', labelEn: 'Middle East' },
    { id: 'Asia', labelBn: 'এশিয়া ও দক্ষিণ এশিয়া', labelEn: 'Asia' }
  ];

  return (
    <div className="app-container">
      {/* Header Bar with unified sticky Masthead & Navigation Tabs */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        theme={theme}
        toggleTheme={toggleTheme}
        lang={lang}
        setLang={setLang}
        bookmarkCount={bookmarkedIds.length}
        onGoToBookmarks={() => setActiveTab('bookmarks')}
        onResetTab={() => {
          setActiveTab('hot-news');
          setSearchQuery('');
        }}
      >
        <NavigationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          lang={lang}
          counts={{
            hotNews: bdHotNews.length + intHotNews.length,
            bengali: BENGALI_NEWSPAPERS.length,
            english: ENGLISH_NEWSPAPERS.length,
            international: INTERNATIONAL_NEWSPAPERS.length,
            bookmarks: bookmarkedIds.length
          }}
        />
      </Header>

      {/* Dynamic Breaking / Hot News Ticker */}
      <HotNewsTicker 
        lang={lang}
        headlines={dynamicTickerHeadlines}
        onSelectHeadline={(headlineItem) => {
          if (headlineItem.fullItem) {
            setActiveModalNews(headlineItem.fullItem);
          } else {
            setActiveTab('hot-news');
          }
        }}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Hot News Tab with Dynamic Real-Time Fetching */}
        {activeTab === 'hot-news' && (
          <HotNewsSection
            bdHotNews={bdHotNews}
            intHotNews={intHotNews}
            lang={lang}
            onOpenModal={(news) => setActiveModalNews(news)}
            onToggleBookmark={handleToggleBookmark}
            bookmarkedIds={bookmarkedIds}
            onShare={handleShare}
            searchQuery={searchQuery}
            isLoading={isNewsLoading}
            onRefresh={() => loadDynamicNews(true)}
            lastUpdated={lastUpdatedTime}
          />
        )}

        {/* Bengali Newspapers Tab */}
        {activeTab === 'bengali-papers' && (
          <NewspaperSection
            title={lang === 'bn' ? 'বাংলা সংবাদপত্র ও অনলাইন পোর্টাল' : 'Bengali Newspapers & Portals'}
            subtitle={lang === 'bn' 
              ? 'বাংলাদেশের শীর্ষ জাতীয়, ঐতিহ্যবাহী ও আঞ্চলিক বাংলা সংবাদপত্রের তালিকা' 
              : 'Direct access to major Bangladeshi national dailies, epapers and news portals'}
            icon={Newspaper}
            accentColor="#e11d48"
            papers={BENGALI_NEWSPAPERS}
            lang={lang}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
            onShare={handleShare}
            searchQuery={searchQuery}
            categories={bengaliCategories}
          />
        )}

        {/* English Newspapers Tab */}
        {activeTab === 'english-papers' && (
          <NewspaperSection
            title={lang === 'bn' ? 'বাংলাদেশী ইংরেজি সংবাদপত্র' : 'English Newspapers of Bangladesh'}
            subtitle={lang === 'bn'
              ? 'বাংলাদেশের শীর্ষ ইংরেজি দৈনিক, ব্যবসা-বাণিজ্য ও বার্তা সংস্থা'
              : 'Leading English language dailies, financial journals and wire agencies'}
            icon={BookOpen}
            accentColor="#2563eb"
            papers={ENGLISH_NEWSPAPERS}
            lang={lang}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
            onShare={handleShare}
            searchQuery={searchQuery}
            categories={englishCategories}
          />
        )}

        {/* International Newspapers Tab */}
        {activeTab === 'international-papers' && (
          <NewspaperSection
            title={lang === 'bn' ? 'আন্তর্জাতিক সংবাদপত্র ও গণমাধ্যম' : 'International Newspapers & Media'}
            subtitle={lang === 'bn'
              ? 'বিশ্বসেরা আন্তর্জাতিক সংবাদ সংস্থা, শীর্ষ দৈনিক ও বৈশ্বিক সম্প্রচার মাধ্যম'
              : 'Premier global press, world investigative dailies and international broadcasters'}
            icon={Globe}
            accentColor="#7c3aed"
            papers={INTERNATIONAL_NEWSPAPERS}
            lang={lang}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
            onShare={handleShare}
            searchQuery={searchQuery}
            categories={internationalCategories}
          />
        )}

        {/* Bookmarks Tab */}
        {activeTab === 'bookmarks' && (
          <section>
            <div className="section-header">
              <div className="section-title-wrap">
                <div className="section-icon-box" style={{ background: '#d97706' }}>
                  <Bookmark size={20} />
                </div>
                <div>
                  <h2 className="section-title">
                    {lang === 'bn' ? 'আমার সংরক্ষিত পত্রিকা ও খবর' : 'Saved Outlets & Articles'}
                  </h2>
                  <div className="section-subtitle">
                    {lang === 'bn' 
                      ? 'আপনার পছন্দের সংবাদপত্র ও পরবর্তীতে পড়ার জন্য সংরক্ষিত খবরসমূহ' 
                      : 'Quick access to your handpicked newspapers and saved hot news stories'}
                  </div>
                </div>
              </div>

              {bookmarkedIds.length > 0 && (
                <button
                  className="read-btn secondary"
                  onClick={() => {
                    if (window.confirm(lang === 'bn' ? 'আপনি কি সব বুকমার্ক মুছে ফেলতে চান?' : 'Clear all saved bookmarks?')) {
                      setBookmarkedIds([]);
                      showToast(lang === 'bn' ? 'সব বুকমার্ক মুছে ফেলা হয়েছে' : 'Bookmarks cleared');
                    }
                  }}
                >
                  <Trash2 size={15} />
                  <span>{lang === 'bn' ? 'সব মুছুন' : 'Clear All'}</span>
                </button>
              )}
            </div>

            {bookmarkedItems.length === 0 ? (
              <div className="empty-state">
                <Bookmark className="empty-icon" />
                <h3 className="empty-title">
                  {lang === 'bn' ? 'কোনো সংরক্ষিত আইটেম নেই' : 'No Bookmarks Yet'}
                </h3>
                <p className="empty-subtitle">
                  {lang === 'bn'
                    ? 'যেকোনো পত্রিকা বা হট নিউজ কার্ডের বুকমার্ক আইকনে ক্লিক করে এখানে যুক্ত করুন।'
                    : 'Click the bookmark icon on any newspaper card or hot news article to save it here.'}
                </p>
              </div>
            ) : (
              <div className="newspaper-grid">
                {bookmarkedItems.map((item) => {
                  const isNews = item.summary || item.summaryEn;
                  const displayName = lang === 'bn' ? (item.name || item.title) : (item.nameEn || item.titleEn || item.name || item.title);
                  const desc = lang === 'bn' ? (item.descriptionBn || item.summary || item.description) : (item.description || item.summaryEn);
                  const link = item.newsUrl || item.url || item.sourceUrl;

                  return (
                    <div 
                      key={item.id} 
                      className="newspaper-card"
                      style={{ '--card-accent': item.color || '#d97706' }}
                    >
                      <div>
                        <div className="newspaper-top">
                          <div className="newspaper-brand-badge">
                            {isNews ? (
                              <div 
                                className="monogram-icon"
                                style={{ background: item.color || '#d97706' }}
                              >
                                📰
                              </div>
                            ) : (
                              <NewspaperLogo paper={item} accentColor={item.color || '#d97706'} />
                            )}
                            <div className="newspaper-titles">
                              <span className="paper-name">{displayName}</span>
                              <span className="paper-name-sub">
                                {isNews ? (item.source || 'Hot News') : (item.country || 'Newspaper')}
                              </span>
                            </div>
                          </div>

                          <button 
                            className="small-icon-btn bookmarked"
                            onClick={() => handleToggleBookmark(item)}
                            title="Remove bookmark"
                          >
                            <Bookmark size={16} />
                          </button>
                        </div>

                        <p className="newspaper-desc">
                          {desc}
                        </p>
                      </div>

                      <div className="paper-action-buttons">
                        {isNews ? (
                          <button
                            className="visit-link-btn"
                            onClick={() => setActiveModalNews(item)}
                          >
                            <span>{lang === 'bn' ? 'বিস্তারিত দেখুন' : 'Quick Preview'}</span>
                          </button>
                        ) : (
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="visit-link-btn"
                          >
                            <span>{lang === 'bn' ? 'পত্রিকায় যান' : 'Visit Website'}</span>
                            <ExternalLink size={14} />
                          </a>
                        )}

                        <button 
                          className="small-icon-btn"
                          onClick={() => handleShare(item)}
                          title="Share"
                        >
                          <Bookmark size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Modal View */}
      {activeModalNews && (
        <NewsModal
          news={activeModalNews}
          onClose={() => setActiveModalNews(null)}
          lang={lang}
          isBookmarked={bookmarkedIds.includes(activeModalNews.id)}
          onToggleBookmark={handleToggleBookmark}
          onShare={handleShare}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notice">
          <Check size={16} color="var(--accent-green)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <Footer 
        lang={lang} 
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
