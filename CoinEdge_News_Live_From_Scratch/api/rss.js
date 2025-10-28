import Parser from "rss-parser";

export default async function handler(req, res) {
  const parser = new Parser();
  const feeds = [
    "https://www.coindesk.com/arc/outboundfeeds/rss/",
    "https://cointelegraph.com/rss",
    "https://decrypt.co/feed",
    "https://bitcoinmagazine.com/feed",
    "https://www.newsbtc.com/feed/"
  ];

  try {
    const results = await Promise.all(
      feeds.map(async (url) => {
        const feed = await parser.parseURL(url);
        return feed.items.slice(0, 8);
      })
    );

    const merged = results.flat().sort(
      (a, b) => new Date(b.pubDate) - new Date(a.pubDate)
    );

    res.status(200).json(merged);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
