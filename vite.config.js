import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

function newsFeedPlugin() {
  return {
    name: 'news-feed-middleware',
    configureServer(server) {
      server.middlewares.use('/api/news', async (req, res) => {
        try {
          const urlObj = new URL(req.url, 'http://localhost');
          const type = urlObj.searchParams.get('type') || 'bd';
          let feedUrl = '';

          if (type === 'bd') {
            // Google News RSS for Bangladesh with Bengali headlines from Prothom Alo, Daily Star, BDNews24, etc.
            feedUrl = 'https://news.google.com/rss/search?q=%E0%A6%AC%E0%A6%BE%E0%A6%82%E0%A6%B2%E0%A6%BE%E0%A6%A6%E0%A7%87%E0%A6%B6&hl=bn&gl=BD&ceid=BD:bn';
          } else if (type === 'bd-en') {
            // English language news from Bangladesh
            feedUrl = 'https://news.google.com/rss/search?q=Bangladesh+news&hl=en-US&gl=US&ceid=US:en';
          } else {
            // BBC World News / Global International headlines
            feedUrl = 'https://feeds.bbci.co.uk/news/world/rss.xml';
          }

          const response = await fetch(feedUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'application/rss+xml, application/xml, text/xml, */*'
            }
          });

          if (!response.ok) {
            res.statusCode = response.status;
            res.end(JSON.stringify({ error: `Feed responded with ${response.status}` }));
            return;
          }

          const xml = await response.text();
          res.setHeader('Content-Type', 'application/xml; charset=utf-8');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(xml);
        } catch (error) {
          console.error('Error proxying news feed:', error);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: error.message }));
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), newsFeedPlugin()],
})
