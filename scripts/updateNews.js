// scripts/updateNews.js
// Node.js script to fetch live RSS headlines and save structured JSON for production static hosting

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, '../public/data');

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

function parseItems(xmlText, region = 'bd') {
  const items = [];
  const itemMatches = [...xmlText.matchAll(/<item>([\s\S]*?)<\/item>/g)];

  itemMatches.forEach((m, idx) => {
    const raw = m[1];
    const titleMatch = raw.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/);
    let title = titleMatch ? titleMatch[1].trim() : '';

    const linkMatch = raw.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/);
    let newsUrl = linkMatch ? linkMatch[1].trim() : '';

    const pubDateMatch = raw.match(/<pubDate>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/pubDate>/);
    let pubDate = pubDateMatch ? pubDateMatch[1].trim() : '';

    const sourceMatch = raw.match(/<source[^>]*url="([^"]*)"[^>]*>([\s\S]*?)<\/source>/);
    let sourceUrl = sourceMatch ? sourceMatch[1].trim() : '';
    let sourceName = sourceMatch ? sourceMatch[2].trim() : (region === 'bd' ? 'বাংলাদেশ সংবাদ' : 'BBC News');

    // Clean Google News title "- Source" suffix
    const lastHyphen = title.lastIndexOf(' - ');
    if (lastHyphen > -1 && lastHyphen > title.length - 35) {
      if (!sourceName || sourceName === 'বাংলাদেশ সংবাদ') {
        sourceName = title.substring(lastHyphen + 3).trim();
      }
      title = title.substring(0, lastHyphen).trim();
    }

    // Description
    const descMatch = raw.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/);
    let desc = descMatch ? descMatch[1].replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').trim() : '';
    if (!desc || desc.length < 20) {
      desc = `${title}. সংবাদটির বিস্তারিত সরাসরি মূল প্রকাশনায় পড়ুন।`;
    }

    // Thumbnail from media:thumbnail if available
    const mediaThumbMatch = raw.match(/<media:thumbnail[^>]*url="([^"]*)"/);
    const mediaThumb = mediaThumbMatch ? mediaThumbMatch[1] : null;

    const categoryObj = detectCategory(`${title} ${desc}`);
    const imgPool = CATEGORY_IMAGES[categoryObj.tag] || CATEGORY_IMAGES.general;
    const imageUrl = mediaThumb || imgPool[idx % imgPool.length];

    if (title && newsUrl) {
      items.push({
        id: `fresh-${region}-${idx}-${Date.now().toString(36)}`,
        title,
        titleEn: title,
        source: sourceName,
        sourceEn: sourceName,
        sourceUrl: sourceUrl || newsUrl,
        newsUrl,
        pubDate: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        category: categoryObj.labelBn,
        categoryEn: categoryObj.labelEn,
        categoryTag: categoryObj.tag,
        isBreaking: false,
        readTime: '3 min read',
        summary: desc,
        summaryEn: desc,
        imageUrl,
        hotRank: idx + 1,
        region,
        isLive: true
      });
    }
  });

  // Sort by pubDate descending (latest first)
  items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  // Mark top 2 as breaking and re-index ranks
  items.forEach((item, index) => {
    item.hotRank = index + 1;
    item.isBreaking = index < 2;
  });

  return items.slice(0, 15);
}

async function updateNews() {
  console.log('Fetching latest live news feeds for static bundle...');

  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  // 1. Bangladesh News (Google News Top Headlines BD)
  try {
    const resBd = await fetch('https://news.google.com/rss?hl=bn&gl=BD&ceid=BD:bn', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' }
    });
    if (resBd.ok) {
      const xmlBd = await resBd.text();
      const newsBd = parseItems(xmlBd, 'bd');
      if (newsBd.length > 0) {
        fs.writeFileSync(path.join(PUBLIC_DIR, 'latest-news-bd.json'), JSON.stringify(newsBd, null, 2));
        console.log(`Saved ${newsBd.length} fresh BD news items to public/data/latest-news-bd.json`);
      }
    }
  } catch (err) {
    console.warn('Failed to fetch BD news feed:', err.message);
  }

  // 2. International News (BBC World News)
  try {
    const resInt = await fetch('https://feeds.bbci.co.uk/news/world/rss.xml', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' }
    });
    if (resInt.ok) {
      const xmlInt = await resInt.text();
      const newsInt = parseItems(xmlInt, 'int');
      if (newsInt.length > 0) {
        fs.writeFileSync(path.join(PUBLIC_DIR, 'latest-news-int.json'), JSON.stringify(newsInt, null, 2));
        console.log(`Saved ${newsInt.length} fresh International news items to public/data/latest-news-int.json`);
      }
    }
  } catch (err) {
    console.warn('Failed to fetch International news feed:', err.message);
  }
}

updateNews();
