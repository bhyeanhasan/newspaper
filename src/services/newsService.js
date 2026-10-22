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

// Helper: accurate calendar relative time formatter
export function formatTimeAgo(dateString, lang = 'bn') {
  if (!dateString) return lang === 'bn' ? 'সম্প্রতি' : 'Recently';
  const pubDate = new Date(dateString);
  if (isNaN(pubDate.getTime())) return lang === 'bn' ? 'সম্প্রতি' : 'Recently';

  const now = new Date();
  const diffMs = Math.max(0, now.getTime() - pubDate.getTime());
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);

  // Exact calendar day difference based on local dates
  const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const pubDateOnly = new Date(pubDate.getFullYear(), pubDate.getMonth(), pubDate.getDate());
  const dayDiff = Math.round((nowDateOnly - pubDateOnly) / (1000 * 60 * 60 * 24));

  const toBnNum = (n) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[d]);

  if (lang === 'bn') {
    if (diffMins < 1) return 'এইমাত্র';
    if (diffMins < 60) return `${toBnNum(diffMins)} মিনিট আগে`;
    if (dayDiff === 0) return `${toBnNum(diffHours)} ঘণ্টা আগে`;
    if (dayDiff === 1) return 'গতকাল';
    if (dayDiff > 1) return `${toBnNum(dayDiff)} দিন আগে`;
    return `${toBnNum(Math.max(1, Math.floor(diffHours / 24)))} দিন আগে`;
  } else {
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (dayDiff === 0) return `${diffHours}h ago`;
    if (dayDiff === 1) return 'Yesterday';
    if (dayDiff > 1) return `${dayDiff}d ago`;
    return `${Math.max(1, Math.floor(diffHours / 24))}d ago`;
  }
}

// Parse standard RSS XML in browser
function parseRssXml(xmlText, region = 'bd') {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  const items = xmlDoc.querySelectorAll('item');
  const rawList = [];

  items.forEach((item, index) => {
    let rawTitle = item.querySelector('title')?.textContent || '';
    rawTitle = rawTitle.replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '').trim();

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
    const pubDateStr = item.querySelector('pubDate')?.textContent?.trim() || '';
    const pubDate = pubDateStr ? new Date(pubDateStr).toISOString() : new Date().toISOString();

    // Description text cleanup
    let rawDesc = item.querySelector('description')?.textContent || '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = rawDesc;
    let cleanDesc = tempDiv.textContent || tempDiv.innerText || '';
    cleanDesc = cleanDesc.replace(/&nbsp;/g, ' ').trim();
    if (!cleanDesc || cleanDesc.length < 20) {
      cleanDesc = `${title}. সংবাদটির বিস্তারিত সরাসরি মূল প্রকাশনায় পড়ুন।`;
    }

    // Media thumbnail if present
    const mediaThumb = item.getElementsByTagNameNS('*', 'thumbnail')?.[0]?.getAttribute('url');

    const categoryObj = detectCategory(`${title} ${cleanDesc}`);
    const imgList = CATEGORY_IMAGES[categoryObj.tag] || CATEGORY_IMAGES.general;
    const imageUrl = mediaThumb || imgList[index % imgList.length];

    if (title && newsUrl) {
      rawList.push({
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
        isBreaking: false,
        readTime: '3 min read',
        summary: cleanDesc,
        summaryEn: cleanDesc,
        imageUrl: imageUrl,
        hotRank: index + 1,
        region: region,
        isLive: true
      });
    }
  });

  // Sort chronologically descending (newest first)
  rawList.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  // Mark top stories and assign ranks
  const topList = rawList.slice(0, 15);
  topList.forEach((item, idx) => {
    item.hotRank = idx + 1;
    item.isBreaking = idx < 2;
  });

  return topList;
}

// Fetch dynamic Bangladesh Hot News
export async function fetchLiveBangladeshNews() {
  // 1. Try local Vite proxy endpoint (dev mode)
  try {
    const response = await fetch('/api/news?type=bd');
    if (response.ok) {
      const xml = await response.text();
      const news = parseRssXml(xml, 'bd');
      if (news && news.length > 0) return news;
    }
  } catch {
    // Continue
  }

  // 2. Try static pre-built JSON (production GitHub Pages)
  try {
    const basePath = import.meta.env.BASE_URL || './';
    const jsonUrl = `${basePath.replace(/\/$/, '')}/data/latest-news-bd.json?t=${Date.now()}`;
    const response = await fetch(jsonUrl);
    if (response.ok) {
      const news = await response.json();
      if (Array.isArray(news) && news.length > 0) {
        return news.map(item => ({
          ...item,
          time: formatTimeAgo(item.pubDate, 'bn'),
          timeEn: formatTimeAgo(item.pubDate, 'en')
        }));
      }
    }
  } catch (err) {
    console.warn('Could not load static BD news:', err);
  }

  // 3. Fallback to curated hot news cache with dynamic timestamps
  return HOT_NEWS_BANGLADESH.map((n, i) => {
    const pubDate = n.pubDate || new Date(Date.now() - (i + 1) * 3600000).toISOString();
    return {
      ...n,
      pubDate,
      time: formatTimeAgo(pubDate, 'bn'),
      timeEn: formatTimeAgo(pubDate, 'en'),
      isLive: false
    };
  });
}

// Fetch dynamic International Hot News
export async function fetchLiveInternationalNews() {
  // 1. Try local Vite proxy endpoint (dev mode)
  try {
    const response = await fetch('/api/news?type=int');
    if (response.ok) {
      const xml = await response.text();
      const news = parseRssXml(xml, 'int');
      if (news && news.length > 0) return news;
    }
  } catch {
    // Continue
  }

  // 2. Try static pre-built JSON (production GitHub Pages)
  try {
    const basePath = import.meta.env.BASE_URL || './';
    const jsonUrl = `${basePath.replace(/\/$/, '')}/data/latest-news-int.json?t=${Date.now()}`;
    const response = await fetch(jsonUrl);
    if (response.ok) {
      const news = await response.json();
      if (Array.isArray(news) && news.length > 0) {
        return news.map(item => ({
          ...item,
          time: formatTimeAgo(item.pubDate, 'bn'),
          timeEn: formatTimeAgo(item.pubDate, 'en')
        }));
      }
    }
  } catch (err) {
    console.warn('Could not load static International news:', err);
  }

  // 3. Fallback to curated cache with dynamic timestamps
  return HOT_NEWS_INTERNATIONAL.map((n, i) => {
    const pubDate = n.pubDate || new Date(Date.now() - (i + 1) * 3600000).toISOString();
    return {
      ...n,
      pubDate,
      time: formatTimeAgo(pubDate, 'bn'),
      timeEn: formatTimeAgo(pubDate, 'en'),
      isLive: false
    };
  });
}
