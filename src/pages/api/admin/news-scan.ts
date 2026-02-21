import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "../../../lib/session";

const SEARCH_KEYWORDS = [
  "poverty fraud",
  "charity fraud",
  "welfare fraud",
  "nonprofit fraud",
  "aid fraud",
  "food stamp fraud",
  "SNAP fraud",
  "embezzlement charity",
  "social services fraud",
  "disaster relief fraud",
  "pandemic relief fraud",
  "housing assistance fraud",
];

interface NewsArticle {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  snippet: string;
}

async function fetchGoogleNewsRSS(keyword: string): Promise<NewsArticle[]> {
  const encoded = encodeURIComponent(keyword);
  const url = `https://news.google.com/rss/search?q=${encoded}&hl=en-US&gl=US&ceid=US:en`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; TruthDrop/1.0)",
    },
  });

  if (!res.ok) return [];

  const xml = await res.text();
  const articles: NewsArticle[] = [];

  // Parse RSS XML manually (no external parser needed)
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1];
    const title = (/<title><!\[CDATA\[(.*?)\]\]><\/title>/.exec(item) || /<title>(.*?)<\/title>/.exec(item))?.[1] || "";
    const link = (/<link>(.*?)<\/link>/.exec(item))?.[1] || "";
    const pubDate = (/<pubDate>(.*?)<\/pubDate>/.exec(item))?.[1] || "";
    const source = (/<source[^>]*>(.*?)<\/source>/.exec(item))?.[1] || "";
    const description = (/<description><!\[CDATA\[(.*?)\]\]><\/description>/.exec(item) || /<description>(.*?)<\/description>/.exec(item))?.[1] || "";

    if (title && link) {
      articles.push({
        title: title.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"'),
        link,
        pubDate,
        source: source.replace(/&amp;/g, "&"),
        snippet: description.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").slice(0, 200),
      });
    }
  }

  return articles;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Auth check
  const session = await getSession(req, res);
  if (!session.isAdmin) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const allArticles: NewsArticle[] = [];
    const seen = new Set<string>();

    // Scan first 4 keywords to keep response fast (can expand later)
    const keywordsToScan = SEARCH_KEYWORDS.slice(0, 4);

    for (const keyword of keywordsToScan) {
      const articles = await fetchGoogleNewsRSS(keyword);
      for (const article of articles) {
        if (!seen.has(article.link)) {
          seen.add(article.link);
          allArticles.push(article);
        }
      }
    }

    // Sort by date (newest first)
    allArticles.sort((a, b) => {
      const da = a.pubDate ? new Date(a.pubDate).getTime() : 0;
      const db = b.pubDate ? new Date(b.pubDate).getTime() : 0;
      return db - da;
    });

    return res.status(200).json({
      ok: true,
      articlesFound: allArticles.length,
      keywordsScanned: keywordsToScan.length,
      articles: allArticles.slice(0, 50), // Return top 50
      scannedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ ok: false, error: message });
  }
}
