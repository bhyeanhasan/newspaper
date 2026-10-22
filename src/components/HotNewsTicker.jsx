import React from 'react';
import { Flame } from 'lucide-react';
import { TICKER_HEADLINES } from '../data/newspapersData';

export default function HotNewsTicker({ lang, onSelectHeadline, headlines }) {
  // Use dynamically supplied live headlines or fallback to default ticker headlines
  const baseItems = (headlines && headlines.length > 0) ? headlines : TICKER_HEADLINES;
  
  // Duplicate array to make seamless continuous marquee loop
  const tickerItems = [...baseItems, ...baseItems];

  return (
    <div className="breaking-ticker">
      <div className="ticker-label">
        <span className="pulse-dot" />
        <Flame size={15} />
        <span>{lang === 'bn' ? 'তাজা খবর' : 'LIVE TICKER'}</span>
      </div>

      <div className="ticker-track">
        <div className="ticker-marquee">
          {tickerItems.map((item, idx) => (
            <div 
              key={idx} 
              className="ticker-item"
              onClick={() => onSelectHeadline && onSelectHeadline(item)}
              title="Click to view news"
            >
              <span className="ticker-tag">{item.category || item.source || 'ব্রেকিং'}</span>
              <span>{item.text || item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
