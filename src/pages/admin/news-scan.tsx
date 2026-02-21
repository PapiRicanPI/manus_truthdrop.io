import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

interface NewsArticle {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  snippet: string;
}

interface ScanResult {
  ok: boolean;
  articlesFound: number;
  keywordsScanned: number;
  articles: NewsArticle[];
  scannedAt: string;
  error?: string;
}

export default function NewsScanPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [scanLoading, setScanLoading] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanError, setScanError] = useState("");

  useEffect(() => {
    fetch("/api/admin/session")
      .then(r => r.json())
      .then(data => {
        if (data.isAdmin) setAuthChecked(true);
        else router.replace("/admin/login");
      })
      .catch(() => router.replace("/admin/login"));
  }, [router]);

  async function handleNewsScan() {
    setScanLoading(true);
    setScanError("");
    setScanResult(null);
    try {
      const res = await fetch("/api/admin/news-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setScanResult(data);
      } else {
        setScanError(data.error || "Scan failed. Please try again.");
      }
    } catch {
      setScanError("Network error. Please try again.");
    } finally {
      setScanLoading(false);
    }
  }

  if (!authChecked) {
    return <div style={{ background: "#0a0a0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontFamily: "system-ui" }}>Checking access…</div>;
  }

  return (
    <>
      <Head><title>News Scan — TruthDrop Admin</title></Head>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0f; color: #e2e8f0; font-family: 'Inter', system-ui, sans-serif; }
        .wrap { max-width: 900px; margin: 0 auto; padding: 2rem; }
        .back { color: #64748b; text-decoration: none; font-size: 0.875rem; display: inline-flex; align-items: center; gap: 0.4rem; margin-bottom: 1.5rem; }
        .back:hover { color: #94a3b8; }
        h1 { font-size: 1.5rem; font-weight: 700; color: #f1f5f9; margin-bottom: 0.5rem; }
        .desc { color: #64748b; font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.5rem; }
        .scan-btn { background: #e53e3e; color: #fff; border: none; border-radius: 8px; padding: 0.85rem 2rem; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.2s; display: inline-flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; }
        .scan-btn:hover { background: #c53030; }
        .scan-btn:disabled { background: #4a1515; cursor: not-allowed; }
        .error { background: #1a0505; border: 1px solid #c53030; border-radius: 8px; padding: 0.75rem 1rem; color: #fc8181; font-size: 0.875rem; margin-bottom: 1rem; }
        .success-bar { background: #051a0a; border: 1px solid #22543d; border-radius: 8px; padding: 0.75rem 1rem; color: #68d391; font-size: 0.875rem; margin-bottom: 1.5rem; }
        .articles { display: flex; flex-direction: column; gap: 1rem; }
        .article { background: #12121a; border: 1px solid #1e293b; border-radius: 10px; padding: 1.25rem; }
        .article-title a { color: #f1f5f9; font-weight: 600; font-size: 0.95rem; text-decoration: none; }
        .article-title a:hover { color: #e53e3e; }
        .article-meta { font-size: 0.75rem; color: #475569; margin: 0.3rem 0 0.5rem; }
        .article-snippet { font-size: 0.85rem; color: #64748b; line-height: 1.6; }
        .keywords { background: #12121a; border: 1px solid #1e293b; border-radius: 10px; padding: 1.25rem; margin-bottom: 1.5rem; }
        .keywords h3 { font-size: 0.875rem; font-weight: 600; color: #94a3b8; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .kw-list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .kw { background: #0a0a0f; border: 1px solid #1e293b; border-radius: 6px; padding: 0.3rem 0.75rem; font-size: 0.8rem; color: #64748b; }
      `}</style>
      <div className="wrap">
        <Link href="/admin" className="back">← Back to Dashboard</Link>
        <h1>📰 News Scan</h1>
        <p className="desc">
          Scan Google News for articles about poverty fraud, charity scams, welfare abuse, and aid fraud.
          The scanner checks {4} keyword categories and returns the most recent articles.
        </p>

        <div className="keywords">
          <h3>Keywords Being Scanned</h3>
          <div className="kw-list">
            {["poverty fraud","charity fraud","welfare fraud","nonprofit fraud","aid fraud","food stamp fraud","SNAP fraud","embezzlement charity","social services fraud","disaster relief fraud","pandemic relief fraud","housing assistance fraud"].slice(0,4).map(k => (
              <span className="kw" key={k}>{k}</span>
            ))}
          </div>
        </div>

        <button className="scan-btn" onClick={handleNewsScan} disabled={scanLoading}>
          {scanLoading ? "⏳ Scanning Google News…" : "🔍 Run News Scan"}
        </button>

        {scanError && <div className="error">❌ {scanError}</div>}

        {scanResult && (
          <>
            <div className="success-bar">
              ✅ Scan complete — <strong>{scanResult.articlesFound} articles</strong> found across {scanResult.keywordsScanned} keywords
              &nbsp;·&nbsp; {new Date(scanResult.scannedAt).toLocaleString()}
            </div>
            {scanResult.articles.length === 0 ? (
              <p style={{ color: "#64748b" }}>No new articles found at this time. Try again later.</p>
            ) : (
              <div className="articles">
                {scanResult.articles.map((a, i) => (
                  <div className="article" key={i}>
                    <div className="article-title">
                      <a href={a.link} target="_blank" rel="noopener noreferrer">{a.title}</a>
                    </div>
                    <div className="article-meta">
                      {a.source && <span>{a.source}</span>}
                      {a.source && a.pubDate && <span> · </span>}
                      {a.pubDate && <span>{new Date(a.pubDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>}
                    </div>
                    {a.snippet && <div className="article-snippet">{a.snippet}</div>}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
