import Parser from "rss-parser";

export default async function handler(req, res) {
  const parser = new Parser({
    headers: { "User-Agent": "CoinEdgeNews/1.0" },
    timeout: 8000
  });

  // ✅ Updated feeds that return valid RSS
  const feeds = [
    "https://feeds.feedburner.com/CoinDesk",
    "https://cointelegraph.com/rss",
    "https://decrypt.co/feed",
    "https://bitcoinmagazine.com/feed",
    "https://newsbtc.com/feed/"
  ];

  try {
    const results = await Promise.all(
      feeds.map(async (url) => {
        try {
          const feed = await parser.parseURL(url);
          return feed.items.slice(0, 6);
        } catch (e) {
          console.warn(`⚠️ Skipped bad feed: ${url}`, e.message);
          return [];
        }
      })
    );

    const merged = results.flat().sort(
      (a, b) => new Date(b.pubDate) - new Date(a.pubDate)
    );

    res.status(200).json(merged.slice(0, 50)); // send top 50
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
