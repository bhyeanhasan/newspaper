import React, { useEffect } from 'react';
import { X, ExternalLink, Bookmark, Share2, Clock, Globe, ShieldCheck } from 'lucide-react';
import { formatTimeAgo } from '../services/newsService';

export default function NewsModal({ 
  news, 
  onClose, 
  lang, 
  isBookmarked, 
  onToggleBookmark, 
  onShare 
}) {
  if (!news) return null;

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const title = lang === 'bn' ? news.title : (news.titleEn || news.title);
  const altTitle = lang === 'bn' ? news.titleEn : news.title;
  const summary = lang === 'bn' ? news.summary : (news.summaryEn || news.summary);
  const source = lang === 'bn' ? news.source : (news.sourceEn || news.source);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button 
          className="modal-close-btn" 
          onClick={onClose}
          title="Close (Esc)"
        >
          <X size={20} />
        </button>

        <div className="modal-body">
          <div className="meta-row">
            <span className="source-pill" style={{ color: 'var(--accent-red)', fontWeight: 700 }}>
              {source}
            </span>
            <span className="utility-item">
              <Clock size={13} />
              {news.pubDate ? formatTimeAgo(news.pubDate, lang) : (lang === 'bn' ? (news.time || 'সম্প্রতি') : (news.timeEn || news.time || 'Recently'))}
            </span>
            <span>• {news.readTime}</span>
            <span className="category-tag">
              {news.category}
            </span>
          </div>

          <h3 className="modal-title">{title}</h3>
          
          {altTitle && (
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '1.25rem', fontStyle: 'italic' }}>
              {altTitle}
            </p>
          )}

          <div className="modal-full-text">
            {summary}
          </div>

          <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '10px', marginBottom: '1.75rem', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
              <ShieldCheck size={16} color="var(--accent-green)" />
              <span>{lang === 'bn' ? 'সংবাদ সূত্র ও স্বত্বাধিকার' : 'News Source & Attribution'}</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {lang === 'bn'
                ? `এই সংবাদটির সম্পূর্ণ প্রতিবেদন ও কপিরাইট সংরক্ষিত আছে ${source}-এর মূল প্ল্যাটফর্মে। সম্পূর্ণ প্রতিবেদন পড়তে নিচের লিংকে ক্লিক করুন।`
                : `Full article content and copyright remain property of ${source}. Access the authoritative report directly via official link.`}
            </div>
          </div>

          <div className="card-footer-actions" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', flex: 1 }}>
              {/* Direct News Article Link */}
              <a 
                href={news.newsUrl || news.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="read-btn"
                title="Open exact news story link"
              >
                <ExternalLink size={16} />
                <span>{lang === 'bn' ? 'মূল পত্রিকায় সম্পূর্ণ প্রতিবেদন পড়ুন' : 'Read Full Article on Website'}</span>
              </a>

              {/* Newspaper Portal Homepage Link */}
              {news.sourceUrl && (
                <a 
                  href={news.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="read-btn secondary"
                  title="Visit newspaper main homepage"
                >
                  <Globe size={15} />
                  <span>{lang === 'bn' ? 'পত্রিকার হোমপেজ' : 'Portal Homepage'}</span>
                </a>
              )}
            </div>

            <div className="action-icon-group">
              <button 
                className={`small-icon-btn ${isBookmarked ? 'bookmarked' : ''}`}
                onClick={() => onToggleBookmark(news)}
                title={isBookmarked ? 'Bookmarked' : 'Bookmark'}
              >
                <Bookmark size={16} />
              </button>
              <button 
                className="small-icon-btn"
                onClick={() => onShare(news)}
                title="Share"
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
