import React, { useState } from 'react';
import { 
  Flame, 
  ExternalLink, 
  Bookmark, 
  Share2, 
  Clock, 
  Eye, 
  RotateCw,
  Radio,
  Sparkles
} from 'lucide-react';
import { formatTimeAgo } from '../services/newsService';

export default function HotNewsSection({ 
  bdHotNews, 
  intHotNews, 
  lang, 
  onOpenModal, 
  onToggleBookmark, 
  bookmarkedIds, 
  onShare,
  searchQuery,
  isLoading = false,
  onRefresh,
  lastUpdated
}) {
  const [subScope, setSubScope] = useState('all'); // 'all', 'bd', 'int'
  const [activeCategory, setActiveCategory] = useState('all');

  // Combine or filter items based on scope
  let combinedNews = [];
  if (subScope === 'all') {
    combinedNews = [
      ...bdHotNews.map(n => ({ ...n, region: n.region || 'bd' })), 
      ...intHotNews.map(n => ({ ...n, region: n.region || 'int' }))
    ].sort((a, b) => (a.hotRank || 1) - (b.hotRank || 1));
  } else if (subScope === 'bd') {
    combinedNews = bdHotNews.map(n => ({ ...n, region: n.region || 'bd' }));
  } else {
    combinedNews = intHotNews.map(n => ({ ...n, region: n.region || 'int' }));
  }

  // Filter by category
  if (activeCategory !== 'all') {
    combinedNews = combinedNews.filter(item => item.categoryTag === activeCategory);
  }

  // Filter by search query if any
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    combinedNews = combinedNews.filter(item => 
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.titleEn && item.titleEn.toLowerCase().includes(q)) ||
      (item.source && item.source.toLowerCase().includes(q)) ||
      (item.summary && item.summary.toLowerCase().includes(q)) ||
      (item.summaryEn && item.summaryEn.toLowerCase().includes(q))
    );
  }

  const leadStory = combinedNews.length > 0 ? combinedNews[0] : null;
  const otherStories = combinedNews.length > 1 ? combinedNews.slice(1) : [];

  const getTimeDisplay = (story) => {
    if (story?.pubDate) {
      return formatTimeAgo(story.pubDate, lang);
    }
    return lang === 'bn' ? (story?.time || 'সম্প্রতি') : (story?.timeEn || story?.time || 'Recently');
  };

  const categories = [
    { id: 'all', labelBn: 'সকল ক্যাটাগরি', labelEn: 'All Categories' },
    { id: 'economy', labelBn: 'অর্থনীতি ও বাণিজ্য', labelEn: 'Economy & Business' },
    { id: 'tech', labelBn: 'বিজ্ঞান ও প্রযুক্তি', labelEn: 'Tech & Science' },
    { id: 'sports', labelBn: 'খেলাধুলা', labelEn: 'Sports' },
    { id: 'politics', labelBn: 'রাজনীতি ও বিশ্ব', labelEn: 'Politics & World' },
    { id: 'environment', labelBn: 'পরিবেশ ও জলবায়ু', labelEn: 'Environment' }
  ];

  return (
    <section>
      {/* Section Header Controls */}
      <div className="section-header">
        <div className="section-title-wrap">
          <div className="section-icon-box" style={{ background: '#e11d48' }}>
            <Flame size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <h2 className="section-title">
                {lang === 'bn' ? 'শীর্ষ হট ও তাজা খবর' : 'Live Hot & Recent News'}
              </h2>
              <span className="live-pulse-badge">
                <span className="pulse-dot" style={{ background: '#22c55e' }} />
                <span>{lang === 'bn' ? 'লাইভ ফিড' : 'LIVE FEED'}</span>
              </span>
            </div>
            <div className="section-subtitle">
              {lang === 'bn' 
                ? 'বাংলাদেশ ও আন্তর্জাতিক সংবাদপত্র থেকে সরাসরি সংগৃহীত সাম্প্রতিক খবর' 
                : 'Dynamically aggregated recent headlines from Bangladeshi & Global newspapers'}
              {lastUpdated && ` • ${lang === 'bn' ? 'আপডেট:' : 'Updated:'} ${lastUpdated}`}
            </div>
          </div>
        </div>

        {/* Region Sub-toggles & Refresh Button */}
        <div className="section-controls">
          <button 
            className="read-btn secondary"
            onClick={onRefresh}
            disabled={isLoading}
            title={lang === 'bn' ? 'সর্বশেষ খবর রিফ্রেশ করুন' : 'Refresh recent news'}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RotateCw size={15} className={isLoading ? 'spin-animation' : ''} />
            <span>{isLoading ? (lang === 'bn' ? 'খবর আসছে...' : 'Fetching...') : (lang === 'bn' ? 'রিফ্রেশ' : 'Refresh News')}</span>
          </button>

          <div className="sub-toggle-bar">
            <button 
              className={`sub-toggle-btn ${subScope === 'all' ? 'active' : ''}`}
              onClick={() => setSubScope('all')}
            >
              <span>{lang === 'bn' ? 'সব খবর' : 'All Hot'}</span>
            </button>
            <button 
              className={`sub-toggle-btn ${subScope === 'bd' ? 'active' : ''}`}
              onClick={() => setSubScope('bd')}
            >
              <span>🇧🇩 {lang === 'bn' ? 'বাংলাদেশ' : 'Bangladesh'}</span>
            </button>
            <button 
              className={`sub-toggle-btn ${subScope === 'int' ? 'active' : ''}`}
              onClick={() => setSubScope('int')}
            >
              <span>🌍 {lang === 'bn' ? 'আন্তর্জাতিক' : 'International'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="filter-pills" style={{ marginBottom: '1.75rem' }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`filter-pill ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {lang === 'bn' ? cat.labelBn : cat.labelEn}
          </button>
        ))}
      </div>

      {isLoading && combinedNews.length === 0 ? (
        <div className="empty-state">
          <RotateCw className="empty-icon spin-animation" />
          <h3 className="empty-title">
            {lang === 'bn' ? 'তাজা খবর লোড হচ্ছে...' : 'Fetching Live Recent News...'}
          </h3>
          <p className="empty-subtitle">
            {lang === 'bn' 
              ? 'পত্রিকাগুলোর অনলাইন সংস্করণ থেকে তাজা হেডলাইন ও লিংক সংগ্রহ করা হচ্ছে।' 
              : 'Streaming recent headlines directly from active newspapers.'}
          </p>
        </div>
      ) : combinedNews.length === 0 ? (
        <div className="empty-state">
          <Flame className="empty-icon" />
          <h3 className="empty-title">
            {lang === 'bn' ? 'কোনো খবর পাওয়া যায়নি' : 'No News Found'}
          </h3>
          <p className="empty-subtitle">
            {lang === 'bn' 
              ? 'আপনার অনুসন্ধানের সাথে মিলে এমন কোনো সাম্প্রতিক খবর পাওয়া যায়নি।' 
              : 'Try adjusting your search query or switching categories.'}
          </p>
        </div>
      ) : (
        <div className="news-grid">
          {/* Big Featured Lead Story */}
          {leadStory && (
            <article className="hot-lead-card">
              <div className="lead-image-wrap">
                <img 
                  src={leadStory.imageUrl} 
                  alt={lang === 'bn' ? leadStory.title : (leadStory.titleEn || leadStory.title)}
                  className="lead-image"
                  loading="lazy"
                />
                <div className="lead-badge-float">
                  <Flame size={14} />
                  <span>
                    {leadStory.isBreaking 
                      ? (lang === 'bn' ? 'তাজা ব্রেকিং' : 'RECENT BREAKING') 
                      : (lang === 'bn' ? 'শীর্ষ খবর' : 'TOP STORY')}
                  </span>
                </div>
              </div>

              <div className="lead-content">
                <div>
                  <div className="meta-row">
                    <span className="source-pill">
                      {lang === 'bn' ? leadStory.source : (leadStory.sourceEn || leadStory.source)}
                    </span>
                    <span className="utility-item">
                      <Clock size={13} />
                      {getTimeDisplay(leadStory)}
                    </span>
                    <span>• {leadStory.readTime || '3 min read'}</span>
                    <span style={{ marginLeft: 'auto', fontWeight: 600, color: leadStory.region === 'bd' ? '#059669' : '#2563eb' }}>
                      {leadStory.region === 'bd' ? '🇧🇩 Bangladesh' : '🌍 International'}
                    </span>
                  </div>

                  <h3 
                    className="lead-title"
                    onClick={() => onOpenModal(leadStory)}
                  >
                    {lang === 'bn' ? leadStory.title : (leadStory.titleEn || leadStory.title)}
                  </h3>

                  <p className="lead-summary">
                    {lang === 'bn' ? leadStory.summary : (leadStory.summaryEn || leadStory.summary)}
                  </p>
                </div>

                <div className="card-footer-actions">
                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <button 
                      className="read-btn"
                      onClick={() => onOpenModal(leadStory)}
                    >
                      <Eye size={16} />
                      <span>{lang === 'bn' ? 'বিস্তারিত দেখুন' : 'Quick Preview'}</span>
                    </button>
                    <a 
                      href={leadStory.newsUrl || leadStory.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="read-btn secondary"
                      title="Open full news article on newspaper website"
                    >
                      <ExternalLink size={15} />
                      <span>{lang === 'bn' ? 'মূল পত্রিকায় পড়ুন' : 'Read at Source'}</span>
                    </a>
                  </div>

                  <div className="action-icon-group">
                    <button 
                      className={`small-icon-btn ${bookmarkedIds.includes(leadStory.id) ? 'bookmarked' : ''}`}
                      onClick={() => onToggleBookmark(leadStory)}
                      title={bookmarkedIds.includes(leadStory.id) ? 'Remove bookmark' : 'Bookmark story'}
                    >
                      <Bookmark size={16} />
                    </button>
                    <button 
                      className="small-icon-btn"
                      onClick={() => onShare(leadStory)}
                      title="Share story"
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* Secondary Hot Stories */}
          {otherStories.map((story) => {
            const isBookmarked = bookmarkedIds.includes(story.id);
            const title = lang === 'bn' ? story.title : (story.titleEn || story.title);
            const summary = lang === 'bn' ? story.summary : (story.summaryEn || story.summary);
            const source = lang === 'bn' ? story.source : (story.sourceEn || story.source);
            const timeAgo = getTimeDisplay(story);

            return (
              <article key={story.id} className="hot-news-card">
                <div className="news-card-img-wrap">
                  <img 
                    src={story.imageUrl} 
                    alt={title}
                    className="news-card-img"
                    loading="lazy"
                  />
                  {story.isBreaking && (
                    <div className="breaking-flag">
                      {lang === 'bn' ? 'ব্রেকিং' : 'RECENT'}
                    </div>
                  )}
                </div>

                <div className="news-card-body">
                  <div className="meta-row">
                    <span className="source-pill">{source}</span>
                    <span className="utility-item">
                      <Clock size={12} />
                      {timeAgo}
                    </span>
                  </div>

                  <h4 
                    className="news-card-title"
                    onClick={() => onOpenModal(story)}
                  >
                    {title}
                  </h4>

                  <p className="news-card-summary">
                    {summary}
                  </p>

                  <div className="card-footer-actions">
                    <button 
                      className="read-btn secondary"
                      onClick={() => onOpenModal(story)}
                    >
                      <Eye size={15} />
                      <span>{lang === 'bn' ? 'বিস্তারিত' : 'Preview'}</span>
                    </button>

                    <div className="action-icon-group">
                      <a 
                        href={story.newsUrl || story.sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="small-icon-btn"
                        title="Read direct news article on source website"
                      >
                        <ExternalLink size={15} />
                      </a>
                      <button 
                        className={`small-icon-btn ${isBookmarked ? 'bookmarked' : ''}`}
                        onClick={() => onToggleBookmark(story)}
                        title={isBookmarked ? 'Bookmarked' : 'Bookmark'}
                      >
                        <Bookmark size={15} />
                      </button>
                      <button 
                        className="small-icon-btn"
                        onClick={() => onShare(story)}
                        title="Share"
                      >
                        <Share2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
