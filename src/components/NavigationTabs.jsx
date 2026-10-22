import React from 'react';
import { Flame, Newspaper, Globe, Bookmark, BookOpen } from 'lucide-react';

export default function NavigationTabs({ 
  activeTab, 
  setActiveTab, 
  lang, 
  counts 
}) {
  const tabs = [
    {
      id: 'hot-news',
      labelBn: 'হট নিউজ (ব্রেকিং)',
      labelEn: 'Hot News & Breaking',
      icon: Flame,
      count: counts.hotNews,
      color: '#e11d48'
    },
    {
      id: 'bengali-papers',
      labelBn: 'বাংলা সংবাদপত্র',
      labelEn: 'Bengali Newspapers',
      icon: Newspaper,
      count: counts.bengali,
      color: '#059669'
    },
    {
      id: 'english-papers',
      labelBn: 'ইংরেজি সংবাদপত্র',
      labelEn: 'English Newspapers',
      icon: BookOpen,
      count: counts.english,
      color: '#2563eb'
    },
    {
      id: 'international-papers',
      labelBn: 'আন্তর্জাতিক পত্রিকা',
      labelEn: 'International Press',
      icon: Globe,
      count: counts.international,
      color: '#7c3aed'
    },
    {
      id: 'bookmarks',
      labelBn: 'সংরক্ষিত',
      labelEn: 'My Bookmarks',
      icon: Bookmark,
      count: counts.bookmarks,
      color: '#d97706'
    }
  ];

  return (
    <div className="nav-tabs-bar">
      <div className="nav-tabs-container">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`nav-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={17} color={isActive ? 'var(--accent-red)' : undefined} />
              <span>{lang === 'bn' ? tab.labelBn : tab.labelEn}</span>
              <span className="tab-badge">{tab.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
