// Live dynamic news fetching and parsing service

import { HOT_NEWS_BANGLADESH, HOT_NEWS_INTERNATIONAL } from '../data/newspapersData';

// High-quality contextual image fallback pool by category
const CATEGORY_IMAGES = {
  economy: [
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop&q=80'
  ],
  tech: [
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80'
  ],
  sports: [
    'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80'
  ],
  politics: [
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&auto=format&fit=crop&q=80'
  ],
  environment: [
    'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80'
  ],
  general: [
    'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=80'
  ]
};

// Helper: detect category from title & description
function detectCategory(text = '') {
  const lower = text.toLowerCase();
  if (/খেলা|ক্রিকেট|ফুটবল|বিশ্বকাপ|উইকেট|রান|ম্যাচ|sports|football|cricket|fifa|league/i.test(lower)) {
    return { tag: 'sports', labelBn: 'খেলাধুলা (Sports)', labelEn: 'Sports' };
  }
  if (/অর্থ|টাকা|ডলার|ব্যাংক|বাণিজ্য|রফতানি|বাজার|শেয়ার|রেমিট্যান্স|মুদ্রা|economy|trade|business|market|inflation|bank|stock/i.test(lower)) {
    return { tag: 'economy', labelBn: 'অর্থনীতি ও বাণিজ্য (Economy)', labelEn: 'Economy & Business' };
  }
  if (/প্রযুক্তি|সফটওয়্যার|এআই|কম্পিউটার|সাইবার|নাসা|বিজ্ঞান|মহাকাশ|tech|ai|software|cyber|science|space|robot/i.test(lower)) {
    return { tag: 'tech', labelBn: 'বিজ্ঞান ও প্রযুক্তি (Tech)', labelEn: 'Tech & Science' };
  }
  if (/পরিবেশ|জলবায়ু|বৃষ্টি|বন্যা|ঝড়|আবহাওয়া|climate|environment|weather|flood/i.test(lower)) {
    return { tag: 'environment', labelBn: 'পরিবেশ ও জলবায়ু (Climate)', labelEn: 'Climate & Environment' };
  }
  if (/সরকার|প্রধানমন্ত্রী|উপদেষ্টা|মন্ত্রী|সংসদ|নির্বাচন|রাজনীতি|শান্তি|যুদ্ধ|politics|government|election|minister|diplomacy|accord/i.test(lower)) {
    return { tag: 'politics', labelBn: 'রাজনীতি ও বিশ্ব (Politics)', labelEn: 'Politics & World' };
  }
  return { tag: 'national', labelBn: 'জাতীয় ও সাধারণ (General)', labelEn: 'General News' };
}

// Helper: relative time formatter
export function formatTimeAgo(dateString, lang = 'bn') {
  if (!dateString) return lang === 'bn' ? 'সম্প্রতি' : 'Recently';
  const pubDate = new Date(dateString);
  if (isNaN(pubDate.getTime())) return lang === 'bn' ? 'সম্প্রতি' : 'Recently';

  const diffMs = Date.now() - pubDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (lang === 'bn') {
    if (diffMins < 1) return 'এইমাত্র';
    if (diffMins < 60) return `${diffMins} মিনিট আগে`;
    if (diffHours < 24) return `${diffHours} ঘণ্টা আগে`;
    return `${diffDays} দিন আগে`;
  } else {
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  }
}

// Parse standard RSS XML in browser
function parseRssXml(xmlText, region = 'bd') {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  const items = xmlDoc.querySelectorAll('item');
  const parsedNews = [];

  items.forEach((item, index) => {
    if (index >= 12) return; // limit to 12 top recent stories

    let rawTitle = item.querySelector('title')?.textContent || '';
    // Clean CDATA
    rawTitle = rawTitle.replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '').trim();

    // In Google News RSS, title often ends with " - Source Name"
    let title = rawTitle;
    let sourceName = region === 'bd' ? 'বাংলাদেশ সংবাদ' : 'International News';
    let sourceUrl = '';

    const lastHyphen = rawTitle.lastIndexOf(' - ');
    if (lastHyphen > -1 && lastHyphen > rawTitle.length - 35) {
      title = rawTitle.substring(0, lastHyphen).trim();
      sourceName = rawTitle.substring(lastHyphen + 3).trim();
    }

    const sourceEl = item.querySelector('source');
    if (sourceEl) {
      if (sourceEl.textContent) sourceName = sourceEl.textContent.trim();
      if (sourceEl.getAttribute('url')) sourceUrl = sourceEl.getAttribute('url');
    }

    const newsUrl = item.querySelector('link')?.textContent?.trim() || '';
    const pubDate = item.querySelector('pubDate')?.textContent?.trim() || '';
    
    // Description text cleanup
    let rawDesc = item.querySelector('description')?.textContent || '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = rawDesc;
    let cleanDesc = tempDiv.textContent || tempDiv.innerText || '';
    cleanDesc = cleanDesc.replace(/&nbsp;/g, ' ').trim();
    if (!cleanDesc || cleanDesc.length < 20) {
      cleanDesc = `${title}. সংবাদটির বিস্তারিত সরাসরি মূল প্রকাশনায় পড়ুন।`;
    }

    const categoryObj = detectCategory(`${title} ${cleanDesc}`);
    const imgList = CATEGORY_IMAGES[categoryObj.tag] || CATEGORY_IMAGES.general;
    const imageUrl = imgList[index % imgList.length];

    parsedNews.push({
      id: `dynamic-${region}-${index}-${Date.now().toString(36)}`,
      title: title,
      titleEn: title,
      source: sourceName,
      sourceEn: sourceName,
      sourceUrl: sourceUrl || newsUrl,
      newsUrl: newsUrl,
      time: formatTimeAgo(pubDate, 'bn'),
      timeEn: formatTimeAgo(pubDate, 'en'),
      pubDate: pubDate,
      category: categoryObj.labelBn,
      categoryEn: categoryObj.labelEn,
      categoryTag: categoryObj.tag,
      isBreaking: index < 2,
      readTime: '3 min read',
      summary: cleanDesc,
      summaryEn: cleanDesc,
      imageUrl: imageUrl,
      hotRank: index + 1,
      region: region,
      isLive: true
    });
  });

  return parsedNews;
}

// Fetch dynamic Bangladesh Hot News
export async function fetchLiveBangladeshNews() {
  try {
    // 1. Try local Vite proxy endpoint
    const response = await fetch('/api/news?type=bd');
    if (response.ok) {
      const xml = await response.text();
      const news = parseRssXml(xml, 'bd');
      if (news && news.length > 0) return news;
    }
  } catch (err) {
    console.warn('Local proxy failed, trying public CORS proxy...', err);
  }

  // 2. Try AllOrigins public proxy fallback
  try {
    const targetUrl = encodeURIComponent('https://news.google.com/rss/search?q=%E0%A6%AC%E0%A6%BE%E0%A6%82%E0%A6%B2%E0%A6%BE%E0%A6%A6%E0%A7%87%E0%A6%B6&hl=bn&gl=BD&ceid=BD:bn');
    const response = await fetch(`https://api.allorigins.win/raw?url=${targetUrl}`);
    if (response.ok) {
      const xml = await response.text();
      const news = parseRssXml(xml, 'bd');
      if (news && news.length > 0) return news;
    }
  } catch (err) {
    console.warn('CORS proxy failed, using curated cache fallback', err);
  }

  // 3. Fallback to curated hot news cache
  return HOT_NEWS_BANGLADESH.map(n => ({ ...n, isLive: false }));
}

// Fetch dynamic International Hot News
export async function fetchLiveInternationalNews() {
  try {
    // 1. Try local Vite proxy endpoint
    const response = await fetch('/api/news?type=int');
    if (response.ok) {
      const xml = await response.text();
      const news = parseRssXml(xml, 'int');
      if (news && news.length > 0) return news;
    }
  } catch (err) {
    console.warn('Local proxy failed, trying public CORS proxy...', err);
  }

  // 2. Try AllOrigins public proxy fallback
  try {
    const targetUrl = encodeURIComponent('https://feeds.bbci.co.uk/news/world/rss.xml');
    const response = await fetch(`https://api.allorigins.win/raw?url=${targetUrl}`);
    if (response.ok) {
      const xml = await response.text();
      const news = parseRssXml(xml, 'int');
      if (news && news.length > 0) return news;
    }
  } catch (err) {
    console.warn('CORS proxy failed, using curated cache fallback', err);
  }

  // 3. Fallback to curated cache
  return HOT_NEWS_INTERNATIONAL.map(n => ({ ...n, isLive: false }));
}
