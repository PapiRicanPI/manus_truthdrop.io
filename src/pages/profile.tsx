import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string | null;
  alias: string | null;
  country: string | null;
  bio: string | null;
  foundingInvestigator: boolean;
  foundingInvestigatorYear: number | null;
  createdAt: string;
}

const ROLE_LABELS: Record<string, { label: string; color: string; desc: string }> = {
  admin: { label: "Admin", color: "#ef4444", desc: "Full platform access and management" },
  custodian: { label: "Custodian", color: "#10b981", desc: "Tip review, redaction, and case linking" },
  researcher: { label: "Researcher", color: "#63b3ed", desc: "Case work and evidence submission" },
  observer: { label: "Observer", color: "#94a3b8", desc: "Read-only access to published case files" },
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [alias, setAlias] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    fetch("/api/user/session")
      .then((r) => r.json())
      .then((d) => {
        if (!d.loggedIn) { router.replace("/login"); return; }
        setUser(d.user);
        setAlias(d.user.alias || "");
        setCountry(d.user.country || "");
        setBio(d.user.bio || "");
        setLoading(false);
      })
      .catch(() => router.replace("/login"));
  }, [router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alias: alias.trim(), country: country.trim(), bio: bio.trim() }),
    });
    const data = await res.json();
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setUser((prev) => prev ? { ...prev, alias: alias.trim() || null, country: country.trim() || null, bio: bio.trim() || null } : prev);
    } else {
      setError(data.error || "Failed to save profile.");
    }
    setSaving(false);
  }

  async function handleLogout() {
    await fetch("/api/user/logout", { method: "POST" });
    router.push("/login");
  }

  if (loading) {
    return <div style={{ background: "#0a0a0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontFamily: "system-ui" }}>Loading…</div>;
  }

  const roleInfo = ROLE_LABELS[user?.role || "observer"] || ROLE_LABELS.observer;

  return (
    <>
      <Head>
        <title>Profile — TruthDrop.io</title>
        <meta name="robots" content="noindex" />
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Courier+Prime:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0f; color: #e2e8f0; font-family: 'Courier Prime', monospace; }
        .topbar { background: #12121a; border-bottom: 1px solid #1e293b; padding: 0 2rem; height: 56px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
        .topbar-left { display: flex; align-items: center; gap: 1.5rem; }
        .site-name { font-family: 'Oswald', sans-serif; font-size: 1.1rem; font-weight: 700; color: #f59e0b; letter-spacing: 0.05em; text-decoration: none; }
        .nav-link { color: #64748b; text-decoration: none; font-size: 0.85rem; transition: color 0.15s; }
        .nav-link:hover { color: #94a3b8; }
        .topbar-right { display: flex; align-items: center; gap: 1rem; }
        .logout-btn { background: none; border: 1px solid #1e293b; border-radius: 4px; color: #64748b; font-size: 0.8rem; padding: 4px 10px; cursor: pointer; font-family: 'Courier Prime', monospace; transition: all 0.15s; }
        .logout-btn:hover { border-color: #475569; color: #94a3b8; }
        .wrap { max-width: 680px; margin: 0 auto; padding: 2rem; }
        .page-title { font-family: 'Oswald', sans-serif; font-size: 1.75rem; font-weight: 700; color: #f1f5f9; margin-bottom: 0.25rem; }
        .page-sub { color: #64748b; font-size: 0.875rem; margin-bottom: 2rem; }
        .card { background: #12121a; border: 1px solid #1e293b; border-radius: 10px; padding: 1.75rem; margin-bottom: 1.5rem; }
        .card-title { font-family: 'Oswald', sans-serif; font-size: 1rem; font-weight: 600; color: #f59e0b; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 1.25rem; }
        .field { margin-bottom: 1.25rem; }
        label { display: block; font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.4rem; }
        .field-hint { font-size: 0.75rem; color: #475569; margin-top: 0.3rem; }
        input, textarea { width: 100%; background: #0a0a0f; border: 1px solid #1e293b; border-radius: 6px; padding: 0.65rem 0.875rem; color: #e2e8f0; font-family: 'Courier Prime', monospace; font-size: 0.95rem; outline: none; transition: border-color 0.15s; }
        input:focus, textarea:focus { border-color: #f59e0b; }
        input[disabled], textarea[disabled] { opacity: 0.5; cursor: not-allowed; }
        textarea { resize: vertical; min-height: 80px; }
        .btn { padding: 0.65rem 1.5rem; background: #f59e0b; color: #0a0a0f; border: none; border-radius: 6px; font-family: 'Oswald', sans-serif; font-size: 0.95rem; font-weight: 700; letter-spacing: 0.05em; cursor: pointer; transition: background 0.15s; }
        .btn:hover:not(:disabled) { background: #fbbf24; }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .success { background: #0a1a0a; border: 1px solid #166534; border-radius: 6px; padding: 0.65rem 1rem; color: #86efac; font-size: 0.85rem; margin-bottom: 1rem; }
        .error { background: #1a0a0a; border: 1px solid #7f1d1d; border-radius: 6px; padding: 0.65rem 1rem; color: #fca5a5; font-size: 0.85rem; margin-bottom: 1rem; }
        .role-block { display: flex; align-items: flex-start; gap: 1rem; }
        .role-badge { padding: 4px 14px; border-radius: 4px; font-size: 0.85rem; font-weight: 700; font-family: 'Oswald', sans-serif; letter-spacing: 0.05em; white-space: nowrap; }
        .role-desc { color: #64748b; font-size: 0.85rem; line-height: 1.5; }
        .fi-banner { background: linear-gradient(135deg, #1a0e00, #2d1a00); border: 1px solid #f59e0b; border-radius: 10px; padding: 1.25rem 1.5rem; display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
        .fi-icon { font-size: 1.75rem; }
        .fi-text h3 { font-family: 'Oswald', sans-serif; font-size: 1rem; font-weight: 700; color: #fbbf24; letter-spacing: 0.05em; }
        .fi-text p { color: #92400e; font-size: 0.8rem; margin-top: 0.2rem; }
        .readonly-field { background: #0a0a0f; border: 1px solid #1e293b; border-radius: 6px; padding: 0.65rem 0.875rem; color: #64748b; font-size: 0.95rem; }
        .char-count { text-align: right; font-size: 0.7rem; color: #475569; margin-top: 0.2rem; }
        .back-link { color: #64748b; text-decoration: none; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.3rem; margin-bottom: 1.5rem; }
        .back-link:hover { color: #94a3b8; }
      `}</style>

      <div className="topbar">
        <div className="topbar-left">
          <a href="/" className="site-name">TruthDrop.io</a>
          <a href="/dashboard" className="nav-link">Workspace</a>
          <a href="/profile" className="nav-link" style={{ color: "#f59e0b" }}>Profile</a>
          <a href="/" className="nav-link">Case Files</a>
        </div>
        <div className="topbar-right">
          <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
        </div>
      </div>

      <div className="wrap">
        <a href="/dashboard" className="back-link">← Back to Workspace</a>
        <div className="page-title">Your Profile</div>
        <div className="page-sub">Manage your display name, bio, and public-facing information.</div>

        {/* Founding Investigator Banner */}
        {user?.foundingInvestigator && (
          <div className="fi-banner">
            <div className="fi-icon">★</div>
            <div className="fi-text">
              <h3>Founding Investigator {user.foundingInvestigatorYear ? `(${user.foundingInvestigatorYear})` : ""}</h3>
              <p>You are a founding supporter of The Vault Investigates. Thank you for your contribution to accountability journalism.</p>
            </div>
          </div>
        )}

        {/* Access Level */}
        <div className="card">
          <div className="card-title">Access Level</div>
          <div className="role-block">
            <span className="role-badge" style={{ background: `${roleInfo.color}22`, color: roleInfo.color, border: `1px solid ${roleInfo.color}44` }}>
              {roleInfo.label}
            </span>
            <div className="role-desc">{roleInfo.desc}</div>
          </div>
        </div>

        {/* Editable Profile */}
        <div className="card">
          <div className="card-title">Public Profile</div>
          {saved && <div className="success">Profile saved successfully.</div>}
          {error && <div className="error">{error}</div>}
          <form onSubmit={handleSave}>
            <div className="field">
              <label>Full Name (from account)</label>
              <div className="readonly-field">{user?.name}</div>
              <div className="field-hint">Name is set from your account. Contact admin to change it.</div>
            </div>
            <div className="field">
              <label>Alias / Pseudonym</label>
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="How you want to appear on the platform"
                maxLength={50}
              />
              <div className="char-count">{alias.length}/50</div>
              <div className="field-hint">Optional. If set, this is shown instead of your full name.</div>
            </div>
            <div className="field">
              <label>Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g., United States, Puerto Rico"
                maxLength={60}
              />
            </div>
            <div className="field">
              <label>Short Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brief description of your work or focus area (max 500 characters)"
                maxLength={500}
              />
              <div className="char-count">{bio.length}/500</div>
            </div>
            <button type="submit" className="btn" disabled={saving}>
              {saving ? "Saving…" : "Save Profile"}
            </button>
          </form>
        </div>

        {/* Account Info */}
        <div className="card">
          <div className="card-title">Account Information</div>
          <div className="field">
            <label>Email Address</label>
            <div className="readonly-field">{user?.email}</div>
          </div>
          {user?.organization && (
            <div className="field">
              <label>Organization</label>
              <div className="readonly-field">{user.organization}</div>
            </div>
          )}
          <div className="field">
            <label>Member Since</label>
            <div className="readonly-field">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"}</div>
          </div>
        </div>

        {/* Founding Investigator CTA (for non-FI users) */}
        {!user?.foundingInvestigator && (
          <div className="card" style={{ borderColor: "#78350f" }}>
            <div className="card-title" style={{ color: "#f59e0b" }}>Become a Founding Investigator</div>
            <p style={{ color: "#64748b", fontSize: "0.875rem", lineHeight: "1.6", marginBottom: "1rem" }}>
              Support The Vault Investigates and receive the <strong style={{ color: "#fbbf24" }}>★ Founding Investigator</strong> badge on your profile. Your contribution helps maintain this accountability database and keeps it independent.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <a href="https://ko-fi.com" target="_blank" rel="noopener noreferrer" style={{ background: "#f59e0b", color: "#0a0a0f", padding: "8px 18px", borderRadius: "6px", fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none", letterSpacing: "0.05em" }}>
                Support on Ko-fi
              </a>
              <a href="https://gofundme.com" target="_blank" rel="noopener noreferrer" style={{ background: "#0a0a0f", border: "1px solid #1e293b", color: "#94a3b8", padding: "8px 18px", borderRadius: "6px", fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none", letterSpacing: "0.05em" }}>
                GoFundMe
              </a>
            </div>
            <p style={{ color: "#475569", fontSize: "0.75rem", marginTop: "0.75rem" }}>
              After donating, contact the admin and your badge will be added manually.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
