import React from 'react';
import { Newspaper, Heart, ArrowUp, Globe, Shield } from 'lucide-react';

export default function Footer({ lang, onSelectTab }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {/* Brand Col */}
        <div className="footer-col">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.9rem' }}>
            <div className="brand-logo-icon" style={{ width: 36, height: 36 }}>
              <Newspaper size={20} />
            </div>
            <div className="brand-title" style={{ fontSize: '1.35rem' }}>
              Khabar<span>Hub</span>
            </div>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 380, marginBottom: '1.25rem' }}>
            {lang === 'bn' 
              ? 'বাংলাদেশের সর্ববৃহৎ সংবাদপত্র সংযোগ হাব ও হট নিউজ পোর্টাল। বাংলা, ইংরেজি ও আন্তর্জাতিক বিশ্বস্ত গণমাধ্যমের সমস্ত লিংক ও ব্রেকিং খবর এক ঠিকানায়।'
              : 'The comprehensive news gateway connecting you directly to top Bangladeshi Bengali newspapers, national English dailies, and premier international news outlets.'}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span className="category-tag">🇧🇩 24+ বাংলা দৈনিক</span>
            <span className="category-tag">🗞️ 12+ English Dailies</span>
            <span className="category-tag">🌍 18+ International</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4>{lang === 'bn' ? 'সংবাদ বিভাগ' : 'Sections'}</h4>
          <ul className="footer-links">
            <li>
              <button onClick={() => onSelectTab('hot-news')}>
                🔥 {lang === 'bn' ? 'হট নিউজ ও ব্রেকিং' : 'Hot News & Breaking'}
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('bengali-papers')}>
                🇧🇩 {lang === 'bn' ? 'বাংলা সংবাদপত্রসমূহ' : 'Bengali Newspapers'}
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('english-papers')}>
                🗞️ {lang === 'bn' ? 'ইংরেজি সংবাদপত্রসমূহ' : 'English Newspapers'}
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('international-papers')}>
                🌍 {lang === 'bn' ? 'আন্তর্জাতিক গণমাধ্যম' : 'International Media'}
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('bookmarks')}>
                ⭐ {lang === 'bn' ? 'আমার সংরক্ষিত বুকমার্ক' : 'My Bookmarks'}
              </button>
            </li>
          </ul>
        </div>

        {/* Top Outlets */}
        <div className="footer-col">
          <h4>{lang === 'bn' ? 'শীর্ষ দৈনিক' : 'Top Outlets'}</h4>
          <ul className="footer-links">
            <li><a href="https://www.prothomalo.com" target="_blank" rel="noopener noreferrer">প্রথম আলো (Prothom Alo)</a></li>
            <li><a href="https://www.thedailystar.net" target="_blank" rel="noopener noreferrer">The Daily Star</a></li>
            <li><a href="https://www.tbsnews.net" target="_blank" rel="noopener noreferrer">The Business Standard</a></li>
            <li><a href="https://www.ittefaq.com.bd" target="_blank" rel="noopener noreferrer">দৈনিক ইত্তেফাক (Daily Ittefaq)</a></li>
            <li><a href="https://www.bbc.com/news" target="_blank" rel="noopener noreferrer">BBC News</a></li>
            <li><a href="https://www.reuters.com" target="_blank" rel="noopener noreferrer">Reuters</a></li>
          </ul>
        </div>

        {/* E-Paper & Legal */}
        <div className="footer-col">
          <h4>{lang === 'bn' ? 'ই-পেপার ও নীতি' : 'E-Paper & Policy'}</h4>
          <ul className="footer-links">
            <li><a href="https://epaper.prothomalo.com" target="_blank" rel="noopener noreferrer">প্রথম আলো ই-পেপার</a></li>
            <li><a href="https://epaper.thedailystar.net" target="_blank" rel="noopener noreferrer">Daily Star E-Paper</a></li>
            <li><a href="https://epaper.ittefaq.com.bd" target="_blank" rel="noopener noreferrer">ইত্তেফাক ই-পেপার</a></li>
            <li><a href="https://epaper.samakal.com" target="_blank" rel="noopener noreferrer">সমকাল ই-পেপার</a></li>
            <li style={{ marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              <Shield size={12} style={{ display: 'inline', marginRight: 4 }} />
              {lang === 'bn' ? 'সকল লোগো ও সংবাদের স্বত্বাধিকার সংশ্লিষ্ট পত্রিকার।' : 'All trademarks belong to their respective publishers.'}
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div>
          © {new Date().getFullYear()} KhabarHub (সংবাদ সংযোগ). {lang === 'bn' ? 'সর্বস্বত্ব সংরক্ষিত।' : 'All rights reserved.'}
        </div>
        <button 
          onClick={scrollToTop}
          className="sub-toggle-btn"
          style={{ background: 'var(--bg-tertiary)' }}
        >
          <span>{lang === 'bn' ? 'উপরে উঠুন' : 'Back to Top'}</span>
          <ArrowUp size={14} />
        </button>
      </div>
    </footer>
  );
}
