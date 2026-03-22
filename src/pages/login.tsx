import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/user/session")
      .then((r) => r.json())
      .then((d) => {
        if (d.loggedIn) router.replace("/dashboard");
        else setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/dashboard");
      } else {
        setError(data.error || "Login failed. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div style={{ background: "#0a0a0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontFamily: "system-ui" }}>
        Checking session…
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Sign In — TruthDrop.io</title>
        <meta name="robots" content="noindex" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Courier+Prime:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0f; color: #e2e8f0; font-family: 'Courier Prime', monospace; min-height: 100vh; }
        .page { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; }
        .card { background: #12121a; border: 1px solid #1e293b; border-radius: 12px; padding: 2.5rem; width: 100%; max-width: 420px; }
        .logo { text-align: center; margin-bottom: 2rem; }
        .logo-title { font-family: 'Oswald', sans-serif; font-size: 1.5rem; font-weight: 700; color: #f59e0b; letter-spacing: 0.05em; text-transform: uppercase; }
        .logo-sub { color: #64748b; font-size: 0.8rem; margin-top: 0.25rem; }
        h1 { font-family: 'Oswald', sans-serif; font-size: 1.25rem; font-weight: 600; color: #f1f5f9; margin-bottom: 0.5rem; }
        .subtitle { color: #64748b; font-size: 0.85rem; margin-bottom: 1.75rem; line-height: 1.5; }
        label { display: block; font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.4rem; }
        input { width: 100%; background: #0a0a0f; border: 1px solid #1e293b; border-radius: 6px; padding: 0.65rem 0.875rem; color: #e2e8f0; font-family: 'Courier Prime', monospace; font-size: 0.95rem; outline: none; transition: border-color 0.15s; }
        input:focus { border-color: #f59e0b; }
        .field { margin-bottom: 1.25rem; }
        .btn { width: 100%; padding: 0.75rem; background: #f59e0b; color: #0a0a0f; border: none; border-radius: 6px; font-family: 'Oswald', sans-serif; font-size: 1rem; font-weight: 700; letter-spacing: 0.05em; cursor: pointer; transition: background 0.15s; margin-top: 0.5rem; }
        .btn:hover:not(:disabled) { background: #fbbf24; }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .error { background: #1a0a0a; border: 1px solid #7f1d1d; border-radius: 6px; padding: 0.75rem 1rem; color: #fca5a5; font-size: 0.85rem; margin-bottom: 1rem; }
        .footer-links { text-align: center; margin-top: 1.5rem; font-size: 0.8rem; color: #475569; }
        .footer-links a { color: #64748b; text-decoration: none; }
        .footer-links a:hover { color: #94a3b8; }
        .divider { border: none; border-top: 1px solid #1e293b; margin: 1.5rem 0; }
        .access-note { background: #0a0a0f; border: 1px solid #1e293b; border-radius: 8px; padding: 1rem; font-size: 0.8rem; color: #475569; line-height: 1.6; }
        .access-note strong { color: #64748b; }
      `}</style>
      <div className="page">
        <div className="card">
          <div className="logo">
            <div className="logo-title">TruthDrop.io</div>
            <div className="logo-sub">The Vault Investigates</div>
          </div>
          <h1>Researcher Sign In</h1>
          <p className="subtitle">Access your workspace. Use the credentials sent to you when your application was approved.</p>
          {error && <div className="error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                autoComplete="email"
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
          <hr className="divider" />
          <div className="access-note">
            <strong>Don&apos;t have access yet?</strong> TruthDrop.io is a vetted research platform. Access is by invitation only. If you are a journalist, researcher, or investigator, you can <a href="/tips" style={{ color: "#f59e0b" }}>submit a tip</a> or reach out to request an invitation.
          </div>
        </div>
        <div className="footer-links">
          <Link href="/">← Back to TruthDrop.io</Link>
          {" · "}
          <Link href="/admin/login">Admin login</Link>
        </div>
      </div>
    </>
  );
}
