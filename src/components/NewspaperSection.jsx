import React, { useState } from 'react';
import { 
  ExternalLink, 
  Bookmark, 
  Share2, 
  FileText, 
  Globe 
} from 'lucide-react';

export function NewspaperLogo({ paper, accentColor }) {
  const [imgError, setImgError] = useState(false);

  const getDomain = (url) => {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return '';
    }
  };

  const domain = getDomain(paper.url);
  const logoUrl = paper.logoUrl || (domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : '');
  const monogram = (paper.nameEn || paper.name || 'NL').slice(0, 2).toUpperCase();

  if (imgError || !logoUrl) {
    return (
      <div 
        className="monogram-icon"
        style={{ background: paper.color || accentColor }}
      >
        {monogram}
      </div>
    );
  }

  return (
    <div className="paper-logo-box">
      <img
        src={logoUrl}
        alt={`${paper.name} logo`}
        className="paper-logo-img"
        onError={() => setImgError(true)}
        loading="lazy"
      />
    </div>
  );
}

export default function NewspaperSection({
  title,
  subtitle,
  icon: Icon,
  accentColor,
  papers,
  lang,
  bookmarkedIds,
  onToggleBookmark,
  onShare,
  searchQuery,
  categories = []
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter papers by category
  let filteredPapers = papers;
  if (selectedCategory !== 'all') {
    filteredPapers = filteredPapers.filter(p => {
      if (p.type) return p.type === selectedCategory;
      if (p.region) return p.region === selectedCategory;
      return true;
    });
  }

  // Filter papers by search query
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredPapers = filteredPapers.filter(p => 
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.nameBn && p.nameBn.toLowerCase().includes(q)) ||
      (p.nameEn && p.nameEn.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.descriptionBn && p.descriptionBn.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.country && p.country.toLowerCase().includes(q))
    );
  }

  return (
    <section>
      {/* Section Header */}
      <div className="section-header">
        <div className="section-title-wrap">
          <div className="section-icon-box" style={{ background: accentColor }}>
            <Icon size={20} />
          </div>
          <div>
            <h2 className="section-title">{title}</h2>
            <div className="section-subtitle">{subtitle}</div>
          </div>
        </div>

        <div className="section-controls">
          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {lang === 'bn' ? `মোট পত্রিকা: ${filteredPapers.length}` : `Total Outlets: ${filteredPapers.length}`}
          </div>
        </div>
      </div>

      {/* Category Pills */}
      {categories.length > 0 && (
        <div className="filter-pills" style={{ marginBottom: '1.75rem' }}>
          <button
            className={`filter-pill ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            {lang === 'bn' ? 'সকল' : 'All'}
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`filter-pill ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {lang === 'bn' ? cat.labelBn : cat.labelEn}
            </button>
          ))}
        </div>
      )}

      {filteredPapers.length === 0 ? (
        <div className="empty-state">
          <Icon className="empty-icon" />
          <h3 className="empty-title">
            {lang === 'bn' ? 'কোনো পত্রিকা পাওয়া যায়নি' : 'No Newspapers Found'}
          </h3>
          <p className="empty-subtitle">
            {lang === 'bn'
              ? 'আপনার অনুসন্ধানের সাথে মিলে এমন কোনো পত্রিকা তালিকায় পাওয়া যায়নি।'
              : 'Try clearing your search query or choosing another category filter.'}
          </p>
        </div>
      ) : (
        <div className="newspaper-grid">
          {filteredPapers.map((paper) => {
            const isBookmarked = bookmarkedIds.includes(paper.id);
            const displayName = lang === 'bn' ? paper.name : (paper.nameEn || paper.name);
            const subName = lang === 'bn' ? paper.nameEn : paper.nameBn;
            const description = lang === 'bn' ? (paper.descriptionBn || paper.description) : paper.description;

            return (
              <div 
                key={paper.id} 
                className="newspaper-card"
                style={{ '--card-accent': paper.color || accentColor }}
              >
                <div>
                  <div className="newspaper-top">
                    <div className="newspaper-brand-badge">
                      <NewspaperLogo paper={paper} accentColor={accentColor} />

                      <div className="newspaper-titles">
                        <span className="paper-name">{displayName}</span>
                        {subName && (
                          <span className="paper-name-sub">{subName}</span>
                        )}
                      </div>
                    </div>

                    <button 
                      className={`small-icon-btn ${isBookmarked ? 'bookmarked' : ''}`}
                      onClick={() => onToggleBookmark(paper)}
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark publication'}
                    >
                      <Bookmark size={16} />
                    </button>
                  </div>

                  <p className="newspaper-desc">
                    {description}
                  </p>
                </div>

                <div className="paper-action-buttons">
                  <a
                    href={paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="visit-link-btn"
                    title={`Visit ${displayName}`}
                  >
                    <span>{lang === 'bn' ? 'পত্রিকায় যান' : 'Visit Website'}</span>
                    <ExternalLink size={14} />
                  </a>

                  {paper.epaperUrl && (
                    <a
                      href={paper.epaperUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="epaper-btn"
                      title="Open E-Paper edition"
                    >
                      <FileText size={14} />
                      <span>{lang === 'bn' ? 'ই-পেপার' : 'E-Paper'}</span>
                    </a>
                  )}

                  <button 
                    className="small-icon-btn"
                    onClick={() => onShare(paper)}
                    title="Share link"
                  >
                    <Share2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
