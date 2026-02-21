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

export default function AdminDashboard() {
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const [scanLoading, setScanLoading] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanError, setScanError] = useState("");

  useEffect(() => {
    fetch("/api/admin/session")
      .then(r => r.json())
      .then(data => {
        if (data.isAdmin) {
          setAdminEmail(data.email || "");
          setAuthChecked(true);
        } else {
          router.replace("/admin/login");
        }
      })
      .catch(() => router.replace("/admin/login"));
  }, [router]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

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
    return (
      <div style={{ background: "#0a0a0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontFamily: "system-ui" }}>
        Checking access…
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard — TruthDrop</title>
      </Head>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0f; color: #e2e8f0; font-family: 'Inter', system-ui, sans-serif; }
        .layout { display: flex; min-height: 100vh; }
        /* Sidebar */
        .sidebar { width: 240px; background: #0d0d14; border-right: 1px solid #1e293b; padding: 1.5rem 0; flex-shrink: 0; display: flex; flex-direction: column; }
        .sidebar-brand { padding: 0 1.5rem 1.5rem; border-bottom: 1px solid #1e293b; margin-bottom: 1rem; }
        .sidebar-brand .logo { font-size: 1.1rem; font-weight: 700; color: #f1f5f9; display: flex; align-items: center; gap: 0.5rem; }
        .sidebar-brand .badge { font-size: 0.65rem; background: #e53e3e; color: #fff; padding: 0.1rem 0.4rem; border-radius: 4px; font-weight: 600; text-transform: uppercase; }
        .nav-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.65rem 1.5rem; color: #64748b; text-decoration: none; font-size: 0.9rem; transition: all 0.15s; cursor: pointer; border: none; background: none; width: 100%; text-align: left; }
        .nav-item:hover, .nav-item.active { color: #f1f5f9; background: #12121a; }
        .nav-item .icon { font-size: 1rem; width: 1.25rem; text-align: center; }
        .nav-section { font-size: 0.7rem; font-weight: 600; color: #334155; text-transform: uppercase; letter-spacing: 0.08em; padding: 1rem 1.5rem 0.4rem; }
        .sidebar-footer { margin-top: auto; padding: 1rem 1.5rem; border-top: 1px solid #1e293b; }
        .user-info { font-size: 0.8rem; color: #475569; margin-bottom: 0.75rem; word-break: break-all; }
        .logout-btn { width: 100%; background: transparent; border: 1px solid #1e293b; color: #64748b; padding: 0.5rem; border-radius: 6px; font-size: 0.85rem; cursor: pointer; transition: all 0.15s; }
        .logout-btn:hover { border-color: #e53e3e; color: #fc8181; }
        /* Main */
        .main { flex: 1; padding: 2rem; overflow-y: auto; }
        .page-header { margin-bottom: 2rem; }
        .page-header h1 { font-size: 1.5rem; font-weight: 700; color: #f1f5f9; }
        .page-header p { color: #64748b; font-size: 0.9rem; margin-top: 0.25rem; }
        /* Stats */
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .stat-card { background: #12121a; border: 1px solid #1e293b; border-radius: 10px; padding: 1.25rem; }
        .stat-label { font-size: 0.75rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
        .stat-value { font-size: 2rem; font-weight: 700; color: #f1f5f9; }
        .stat-sub { font-size: 0.75rem; color: #475569; margin-top: 0.25rem; }
        /* Sections */
        .section { background: #12121a; border: 1px solid #1e293b; border-radius: 10px; padding: 1.5rem; margin-bottom: 1.5rem; }
        .section-title { font-size: 1rem; font-weight: 600; color: #f1f5f9; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; }
        /* Scan */
        .scan-btn { background: #e53e3e; color: #fff; border: none; border-radius: 8px; padding: 0.75rem 1.5rem; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: background 0.2s; display: inline-flex; align-items: center; gap: 0.5rem; }
        .scan-btn:hover { background: #c53030; }
        .scan-btn:disabled { background: #4a1515; cursor: not-allowed; }
        .scan-desc { color: #64748b; font-size: 0.875rem; margin-bottom: 1rem; line-height: 1.6; }
        .scan-error { background: #1a0505; border: 1px solid #c53030; border-radius: 8px; padding: 0.75rem 1rem; color: #fc8181; font-size: 0.875rem; margin-top: 1rem; }
        .scan-success { background: #051a0a; border: 1px solid #22543d; border-radius: 8px; padding: 0.75rem 1rem; color: #68d391; font-size: 0.875rem; margin-top: 1rem; }
        .articles-list { margin-top: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; }
        .article-card { background: #0a0a0f; border: 1px solid #1e293b; border-radius: 8px; padding: 1rem; }
        .article-title { font-size: 0.9rem; font-weight: 600; color: #f1f5f9; margin-bottom: 0.25rem; }
        .article-title a { color: #f1f5f9; text-decoration: none; }
        .article-title a:hover { color: #e53e3e; }
        .article-meta { font-size: 0.75rem; color: #475569; margin-bottom: 0.4rem; }
        .article-snippet { font-size: 0.8rem; color: #64748b; line-height: 1.5; }
        /* Quick actions */
        .quick-actions { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 0.75rem; }
        .qa-btn { background: #0a0a0f; border: 1px solid #1e293b; border-radius: 8px; padding: 1rem; color: #94a3b8; font-size: 0.85rem; cursor: pointer; transition: all 0.15s; text-align: left; text-decoration: none; display: block; }
        .qa-btn:hover { border-color: #e53e3e; color: #f1f5f9; }
        .qa-icon { font-size: 1.25rem; margin-bottom: 0.5rem; display: block; }
        @media (max-width: 768px) {
          .sidebar { display: none; }
          .main { padding: 1rem; }
        }
      `}</style>
      <div className="layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-brand">
            <div className="logo">🛡️ TruthDrop <span className="badge">Admin</span></div>
          </div>
          <Link href="/admin" className="nav-item active">
            <span className="icon">📊</span> Dashboard
          </Link>
          <div className="nav-section">Content</div>
          <Link href="/admin/cases" className="nav-item">
            <span className="icon">🗄️</span> Case Files
          </Link>
          <Link href="/admin/tips" className="nav-item">
            <span className="icon">📥</span> Tips
          </Link>
          <Link href="/admin/news-scan" className="nav-item">
            <span className="icon">📰</span> News Scan
          </Link>
          <div className="nav-section">Access</div>
          <Link href="/admin/vetting" className="nav-item">
            <span className="icon">✅</span> Vetting Applications
          </Link>
          <Link href="/admin/users" className="nav-item">
            <span className="icon">👥</span> Users
          </Link>
          <div className="sidebar-footer">
            <div className="user-info">{adminEmail}</div>
            <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
          </div>
        </aside>

        {/* Main content */}
        <main className="main">
          <div className="page-header">
            <h1>Dashboard</h1>
            <p>Welcome back, Papi Rican Blue — TruthDrop Admin</p>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total Cases</div>
              <div className="stat-value">40</div>
              <div className="stat-sub">37 published, 3 drafts</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Users</div>
              <div className="stat-value">3</div>
              <div className="stat-sub">1 admin</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Published</div>
              <div className="stat-value">37</div>
              <div className="stat-sub">Live case files</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Admins</div>
              <div className="stat-value">1</div>
              <div className="stat-sub">Platform administrators</div>
            </div>
          </div>

          {/* News Scan */}
          <div className="section">
            <div className="section-title">📰 News Scan</div>
            <p className="scan-desc">
              Scan Google News for new articles about poverty fraud, charity scams, and aid abuse.
              Results are returned live — review and add relevant articles as case files.
            </p>
            <button
              className="scan-btn"
              onClick={handleNewsScan}
              disabled={scanLoading}
            >
              {scanLoading ? "⏳ Scanning…" : "🔍 Scan News Now"}
            </button>

            {scanError && <div className="scan-error">❌ {scanError}</div>}

            {scanResult && (
              <>
                <div className="scan-success">
                  ✅ Scan complete — {scanResult.articlesFound} articles found across {scanResult.keywordsScanned} keywords
                  &nbsp;·&nbsp; {new Date(scanResult.scannedAt).toLocaleString()}
                </div>
                {scanResult.articles.length > 0 && (
                  <div className="articles-list">
                    {scanResult.articles.map((a, i) => (
                      <div className="article-card" key={i}>
                        <div className="article-title">
                          <a href={a.link} target="_blank" rel="noopener noreferrer">{a.title}</a>
                        </div>
                        <div className="article-meta">
                          {a.source && <span>{a.source} · </span>}
                          {a.pubDate && <span>{new Date(a.pubDate).toLocaleDateString()}</span>}
                        </div>
                        {a.snippet && <div className="article-snippet">{a.snippet}</div>}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Quick Actions */}
          <div className="section">
            <div className="section-title">⚡ Quick Actions</div>
            <div className="quick-actions">
              <Link href="/admin/cases/new" className="qa-btn">
                <span className="qa-icon">➕</span>Create New Case File
              </Link>
              <Link href="/admin/cases" className="qa-btn">
                <span className="qa-icon">🗄️</span>Manage Case Files
              </Link>
              <Link href="/admin/vetting" className="qa-btn">
                <span className="qa-icon">✅</span>Review Vetting Applications
              </Link>
              <Link href="/admin/tips" className="qa-btn">
                <span className="qa-icon">📥</span>Review Tips
              </Link>
              <Link href="/admin/news-scan" className="qa-btn">
                <span className="qa-icon">📰</span>News Scan Results
              </Link>
              <Link href="/admin/users" className="qa-btn">
                <span className="qa-icon">👥</span>User Management
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
