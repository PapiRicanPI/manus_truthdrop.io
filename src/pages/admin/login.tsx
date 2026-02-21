import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("tainorican2n@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        const data = await res.json();
        setError(data.error || "Login failed.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Admin Login — TruthDrop</title>
      </Head>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0f; color: #e2e8f0; font-family: 'Inter', system-ui, sans-serif; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
        .login-wrap { width: 100%; max-width: 400px; padding: 2rem; }
        .shield { font-size: 2.5rem; text-align: center; margin-bottom: 0.5rem; }
        h1 { text-align: center; font-size: 1.5rem; font-weight: 700; color: #f1f5f9; margin-bottom: 0.25rem; }
        .subtitle { text-align: center; font-size: 0.875rem; color: #64748b; margin-bottom: 2rem; }
        .card { background: #12121a; border: 1px solid #1e293b; border-radius: 12px; padding: 2rem; }
        label { display: block; font-size: 0.8rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.4rem; }
        input { width: 100%; background: #0a0a0f; border: 1px solid #1e293b; border-radius: 8px; padding: 0.75rem 1rem; color: #f1f5f9; font-size: 0.95rem; outline: none; transition: border-color 0.2s; margin-bottom: 1.25rem; }
        input:focus { border-color: #e53e3e; }
        .btn { width: 100%; background: #e53e3e; color: #fff; border: none; border-radius: 8px; padding: 0.85rem; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .btn:hover { background: #c53030; }
        .btn:disabled { background: #4a1515; cursor: not-allowed; }
        .error { background: #1a0505; border: 1px solid #c53030; border-radius: 8px; padding: 0.75rem 1rem; color: #fc8181; font-size: 0.875rem; margin-bottom: 1rem; }
        .back { text-align: center; margin-top: 1.5rem; font-size: 0.875rem; color: #475569; }
        .back a { color: #94a3b8; text-decoration: none; }
        .back a:hover { color: #e2e8f0; }
      `}</style>
      <div className="login-wrap">
        <div className="shield">🛡️</div>
        <h1>TruthDrop Admin</h1>
        <p className="subtitle">Restricted access — authorized personnel only</p>
        <div className="card">
          {error && <div className="error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Enter admin password"
            />
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
        <p className="back"><a href="/">← Back to TruthDrop</a></p>
      </div>
    </>
  );
}
