import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

interface VettingApplication {
  id: string;
  fullName: string;
  email: string;
  organization?: string;
  role?: string;
  reasonForAccess: string;
  intendedUse: string;
  status: "pending" | "approved" | "rejected";
  reviewNotes?: string;
  scoreIdentity?: number;
  scoreOrg?: number;
  scorePurpose?: number;
  scoreSupport?: number;
  scoreRisk?: number;
  scoreTotal?: number;
  createdAt: string;
  reviewedAt?: string;
}

const SCORE_LABELS: Record<string, { label: string; desc: [string, string, string] }> = {
  scoreIdentity: {
    label: "1. Identity & Email",
    desc: [
      "0 — Free/disposable email, no verifiable footprint",
      "1 — Mixed signals",
      "2 — Institutional or professional email matching a verifiable person",
    ],
  },
  scoreOrg: {
    label: "2. Organization Legitimacy",
    desc: [
      "0 — Cannot verify organization or it looks fake",
      "1 — Unclear or very small organization",
      "2 — Clearly verifiable institution, newsroom, NGO, or academic body",
    ],
  },
  scorePurpose: {
    label: "3. Purpose & Intended Use",
    desc: [
      "0 — Vague, commercial, or potentially harmful",
      "1 — Partially aligned but fuzzy",
      "2 — Specific investigative/academic/public-interest purpose",
    ],
  },
  scoreSupport: {
    label: "4. Support / Reciprocity",
    desc: [
      "0 — No indication of support or attribution",
      "1 — Promises attribution but no support yet",
      "2 — Existing/pledged support via Substack, Ko-fi, or Gumroad + agrees to credit TruthDrop",
    ],
  },
  scoreRisk: {
    label: "5. Risk / Red Flags (reverse-scored)",
    desc: [
      "0 — Clear red flags (vendetta, commercial data-mining, unethical use)",
      "1 — Minor concerns",
      "2 — No red flags",
    ],
  },
};

function getDecision(total: number): { label: string; color: string } {
  if (total <= 3) return { label: "Reject", color: "#e53e3e" };
  if (total <= 6) return { label: "Request More Info / Conditional", color: "#d69e2e" };
  return { label: "Approve", color: "#38a169" };
}

export default function VettingPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [applications, setApplications] = useState<VettingApplication[]>([]);
  const [selected, setSelected] = useState<VettingApplication | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newApp, setNewApp] = useState({
    fullName: "", email: "", organization: "", role: "", reasonForAccess: "", intendedUse: ""
  });

  useEffect(() => {
    fetch("/api/admin/session")
      .then(r => r.json())
      .then(d => {
        if (d.isAdmin) {
          setAuthChecked(true);
          loadApplications();
        } else {
          router.replace("/admin/login");
        }
      })
      .catch(() => router.replace("/admin/login"));
  }, [router]);

  async function loadApplications() {
    try {
      const res = await fetch("/api/admin/vetting");
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
      }
    } catch {}
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  function openApplication(app: VettingApplication) {
    setSelected(app);
    setScores({
      scoreIdentity: app.scoreIdentity ?? -1,
      scoreOrg: app.scoreOrg ?? -1,
      scorePurpose: app.scorePurpose ?? -1,
      scoreSupport: app.scoreSupport ?? -1,
      scoreRisk: app.scoreRisk ?? -1,
    });
    setNotes(app.reviewNotes || "");
    setMsg("");
  }

  function calcTotal(): number | null {
    const vals = Object.values(scores);
    if (vals.some(v => v < 0)) return null;
    return vals.reduce((a, b) => a + b, 0);
  }

  async function submitDecision(decision: "approved" | "rejected") {
    if (!selected) return;
    const total = calcTotal();
    if (total === null) {
      setMsg("Please score all 5 criteria before making a decision.");
      return;
    }
    if (!notes.trim()) {
      setMsg("Please add admin notes before making a decision.");
      return;
    }
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/vetting", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selected.id,
          status: decision,
          reviewNotes: notes,
          ...scores,
          scoreTotal: total,
        }),
      });
      if (res.ok) {
        setMsg(decision === "approved" ? "Application approved." : "Application rejected.");
        await loadApplications();
        setSelected(null);
      } else {
        setMsg("Error saving decision. Please try again.");
      }
    } catch {
      setMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddApplication() {
    if (!newApp.fullName || !newApp.email || !newApp.reasonForAccess || !newApp.intendedUse) {
      setMsg("Full name, email, reason for access, and intended use are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/vetting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newApp),
      });
      if (res.ok) {
        setShowAdd(false);
        setNewApp({ fullName: "", email: "", organization: "", role: "", reasonForAccess: "", intendedUse: "" });
        setMsg("Application added successfully.");
        await loadApplications();
      } else {
        setMsg("Error adding application.");
      }
    } catch {
      setMsg("Network error.");
    } finally {
      setLoading(false);
    }
  }

  const filtered = applications.filter(a => filter === "all" || a.status === filter);

  if (!authChecked) {
    return (
      <div style={{ background: "#0a0a0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontFamily: "system-ui" }}>
        Checking access...
      </div>
    );
  }

  return (
    <>
      <Head><title>Vetting Applications - TruthDrop Admin</title></Head>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0f; color: #e2e8f0; font-family: 'Inter', system-ui, sans-serif; }
        .layout { display: flex; min-height: 100vh; }
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
        .main { flex: 1; padding: 2rem; overflow-y: auto; }
        .page-header { margin-bottom: 1.5rem; display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
        .page-header h1 { font-size: 1.5rem; font-weight: 700; color: #f1f5f9; }
        .page-header p { color: #64748b; font-size: 0.9rem; margin-top: 0.25rem; }
        .add-btn { background: #2563eb; color: #fff; border: none; border-radius: 8px; padding: 0.6rem 1.2rem; font-size: 0.9rem; font-weight: 600; cursor: pointer; white-space: nowrap; }
        .add-btn:hover { background: #1d4ed8; }
        .filters { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
        .filter-btn { padding: 0.4rem 1rem; border-radius: 20px; border: 1px solid #1e293b; background: transparent; color: #64748b; font-size: 0.85rem; cursor: pointer; transition: all 0.15s; }
        .filter-btn.active { background: #1e293b; color: #f1f5f9; border-color: #334155; }
        .app-list { display: flex; flex-direction: column; gap: 1rem; }
        .app-card { background: #12121a; border: 1px solid #1e293b; border-radius: 10px; padding: 1.25rem; cursor: pointer; transition: border-color 0.15s; }
        .app-card:hover { border-color: #334155; }
        .app-card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 0.75rem; }
        .app-name { font-size: 1rem; font-weight: 600; color: #f1f5f9; }
        .app-email { font-size: 0.8rem; color: #64748b; margin-top: 0.2rem; }
        .app-meta { display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.8rem; color: #64748b; }
        .status-badge { font-size: 0.75rem; font-weight: 600; padding: 0.25rem 0.75rem; border-radius: 20px; white-space: nowrap; }
        .status-pending { background: #7c3aed22; color: #a78bfa; border: 1px solid #7c3aed44; }
        .status-approved { background: #16a34a22; color: #4ade80; border: 1px solid #16a34a44; }
        .status-rejected { background: #dc262622; color: #f87171; border: 1px solid #dc262644; }
        .score-chip { font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 12px; background: #1e293b; color: #94a3b8; }
        .empty { color: #475569; text-align: center; padding: 3rem; background: #12121a; border: 1px solid #1e293b; border-radius: 10px; }
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 100; display: flex; align-items: flex-start; justify-content: center; padding: 2rem 1rem; overflow-y: auto; }
        .modal { background: #0d0d14; border: 1px solid #1e293b; border-radius: 14px; width: 100%; max-width: 720px; padding: 2rem; position: relative; margin: auto; }
        .modal-close { position: absolute; top: 1rem; right: 1rem; background: transparent; border: none; color: #64748b; font-size: 1.25rem; cursor: pointer; }
        .modal-close:hover { color: #f1f5f9; }
        .modal h2 { font-size: 1.25rem; font-weight: 700; color: #f1f5f9; margin-bottom: 0.25rem; }
        .modal-email { font-size: 0.85rem; color: #64748b; margin-bottom: 1.5rem; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
        .info-block { background: #12121a; border: 1px solid #1e293b; border-radius: 8px; padding: 1rem; }
        .info-label { font-size: 0.7rem; font-weight: 600; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.4rem; }
        .info-value { font-size: 0.875rem; color: #e2e8f0; line-height: 1.5; }
        .info-block.full { grid-column: 1 / -1; }
        .section-title { font-size: 0.85rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #1e293b; }
        .score-row { margin-bottom: 1.25rem; }
        .score-label { font-size: 0.9rem; font-weight: 600; color: #e2e8f0; margin-bottom: 0.5rem; }
        .score-options { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .score-opt { padding: 0.5rem 1.1rem; border-radius: 6px; border: 1px solid #1e293b; background: #12121a; color: #64748b; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.15s; }
        .score-opt:hover { border-color: #334155; color: #94a3b8; }
        .score-opt.selected { background: #2563eb; border-color: #2563eb; color: #fff; }
        .score-desc { font-size: 0.78rem; color: #94a3b8; margin-top: 0.4rem; line-height: 1.4; font-style: italic; }
        .total-box { background: #12121a; border: 1px solid #1e293b; border-radius: 10px; padding: 1rem 1.25rem; margin: 1.5rem 0; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; }
        .total-label { font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem; }
        .total-score { font-size: 2rem; font-weight: 800; }
        .total-decision { font-size: 0.9rem; font-weight: 600; }
        .notes-area { width: 100%; background: #12121a; border: 1px solid #1e293b; border-radius: 8px; color: #e2e8f0; font-size: 0.875rem; padding: 0.75rem; resize: vertical; min-height: 100px; font-family: inherit; margin-bottom: 1.5rem; }
        .notes-area:focus { outline: none; border-color: #2563eb; }
        .action-row { display: flex; gap: 1rem; }
        .btn-approve { flex: 1; background: #16a34a; color: #fff; border: none; border-radius: 8px; padding: 0.85rem; font-size: 0.95rem; font-weight: 700; cursor: pointer; transition: background 0.15s; }
        .btn-approve:hover:not(:disabled) { background: #15803d; }
        .btn-reject { flex: 1; background: #dc2626; color: #fff; border: none; border-radius: 8px; padding: 0.85rem; font-size: 0.95rem; font-weight: 700; cursor: pointer; transition: background 0.15s; }
        .btn-reject:hover:not(:disabled) { background: #b91c1c; }
        .btn-approve:disabled, .btn-reject:disabled { opacity: 0.5; cursor: not-allowed; }
        .msg { margin-top: 1rem; font-size: 0.875rem; color: #94a3b8; padding: 0.75rem; background: #12121a; border-radius: 6px; border: 1px solid #1e293b; }
        .add-form { background: #12121a; border: 1px solid #1e293b; border-radius: 10px; padding: 1.5rem; margin-bottom: 1.5rem; }
        .add-form h3 { font-size: 1rem; font-weight: 700; color: #f1f5f9; margin-bottom: 1rem; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
        .form-field { display: flex; flex-direction: column; gap: 0.4rem; }
        .form-field.full { grid-column: 1 / -1; }
        .form-field label { font-size: 0.75rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
        .form-field input, .form-field textarea { background: #0a0a0f; border: 1px solid #1e293b; border-radius: 6px; color: #e2e8f0; font-size: 0.875rem; padding: 0.6rem 0.75rem; font-family: inherit; }
        .form-field input:focus, .form-field textarea:focus { outline: none; border-color: #2563eb; }
        .form-field textarea { resize: vertical; min-height: 80px; }
        .form-actions { display: flex; gap: 0.75rem; }
        .btn-save { background: #2563eb; color: #fff; border: none; border-radius: 8px; padding: 0.65rem 1.5rem; font-size: 0.9rem; font-weight: 600; cursor: pointer; }
        .btn-save:hover { background: #1d4ed8; }
        .btn-cancel { background: transparent; color: #64748b; border: 1px solid #1e293b; border-radius: 8px; padding: 0.65rem 1.5rem; font-size: 0.9rem; cursor: pointer; }
        @media (max-width: 640px) {
          .info-grid, .form-grid { grid-template-columns: 1fr; }
          .action-row { flex-direction: column; }
          .sidebar { display: none; }
        }
      `}</style>

      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-brand">
            <div className="logo">TruthDrop <span className="badge">Admin</span></div>
          </div>
          <Link href="/admin" className="nav-item"><span className="icon">📊</span> Dashboard</Link>
          <div className="nav-section">Content</div>
          <Link href="/admin/cases" className="nav-item"><span className="icon">🗄️</span> Case Files</Link>
          <Link href="/admin/tips" className="nav-item"><span className="icon">📥</span> Tips</Link>
          <Link href="/admin/news-scan" className="nav-item"><span className="icon">📰</span> News Scan</Link>
          <div className="nav-section">Access</div>
          <Link href="/admin/vetting" className="nav-item active"><span className="icon">✅</span> Vetting Applications</Link>
          <Link href="/admin/users" className="nav-item"><span className="icon">👥</span> Users</Link>
          <div className="sidebar-footer">
            <div className="user-info">Admin — The Vault Archivist</div>
            <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
          </div>
        </aside>

        <main className="main">
          <div className="page-header">
            <div>
              <h1>✅ Vetting Applications</h1>
              <p>Review, score, and approve or reject database access requests</p>
            </div>
            <button className="add-btn" onClick={() => { setShowAdd(!showAdd); setMsg(""); }}>
              {showAdd ? "Cancel" : "+ Add Application"}
            </button>
          </div>

          {msg && !selected && <div className="msg">{msg}</div>}

          {showAdd && (
            <div className="add-form">
              <h3>Add Application Manually</h3>
              <div className="form-grid">
                <div className="form-field">
                  <label>Full Name *</label>
                  <input value={newApp.fullName} onChange={e => setNewApp({...newApp, fullName: e.target.value})} placeholder="John Doe" />
                </div>
                <div className="form-field">
                  <label>Email *</label>
                  <input value={newApp.email} onChange={e => setNewApp({...newApp, email: e.target.value})} placeholder="john@example.com" />
                </div>
                <div className="form-field">
                  <label>Organization</label>
                  <input value={newApp.organization} onChange={e => setNewApp({...newApp, organization: e.target.value})} placeholder="Research University, News Org, etc." />
                </div>
                <div className="form-field">
                  <label>Role / Title</label>
                  <input value={newApp.role} onChange={e => setNewApp({...newApp, role: e.target.value})} placeholder="PhD Researcher, Journalist, etc." />
                </div>
                <div className="form-field full">
                  <label>Reason for Access *</label>
                  <textarea value={newApp.reasonForAccess} onChange={e => setNewApp({...newApp, reasonForAccess: e.target.value})} placeholder="Why do they need access to the database?" />
                </div>
                <div className="form-field full">
                  <label>Intended Use *</label>
                  <textarea value={newApp.intendedUse} onChange={e => setNewApp({...newApp, intendedUse: e.target.value})} placeholder="How will they use the data?" />
                </div>
              </div>
              <div className="form-actions">
                <button className="btn-save" onClick={handleAddApplication} disabled={loading}>{loading ? "Saving..." : "Save Application"}</button>
                <button className="btn-cancel" onClick={() => setShowAdd(false)}>Cancel</button>
              </div>
            </div>
          )}

          <div className="filters">
            {(["pending", "all", "approved", "rejected"] as const).map(f => (
              <button key={f} className={`filter-btn${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>
                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                {" "}({f === "all" ? applications.length : applications.filter(a => a.status === f).length})
              </button>
            ))}
          </div>

          <div className="app-list">
            {filtered.length === 0 ? (
              <div className="empty">
                No {filter === "all" ? "" : filter} applications found.<br />
                <span style={{ fontSize: "0.8rem", marginTop: "0.5rem", display: "block" }}>
                  Applications submitted at vet.thevault.watch can be added manually using the button above.
                </span>
              </div>
            ) : (
              filtered.map(app => (
                <div key={app.id} className="app-card" onClick={() => openApplication(app)}>
                  <div className="app-card-header">
                    <div>
                      <div className="app-name">{app.fullName}</div>
                      <div className="app-email">{app.email}</div>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      {app.scoreTotal !== undefined && (
                        <span className="score-chip">{app.scoreTotal}/10</span>
                      )}
                      <span className={`status-badge status-${app.status}`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="app-meta">
                    {app.organization && <span>🏢 {app.organization}</span>}
                    {app.role && <span>👤 {app.role}</span>}
                    <span>📅 {new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>
                  {app.intendedUse && (
                    <div style={{ marginTop: "0.75rem", fontSize: "0.8rem", color: "#475569", lineHeight: 1.5 }}>
                      <strong style={{ color: "#64748b" }}>Intended Use:</strong> {app.intendedUse.slice(0, 120)}{app.intendedUse.length > 120 ? "..." : ""}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {selected && (
        <div className="overlay" onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div className="modal">
            <button className="modal-close" onClick={() => setSelected(null)}>x</button>
            <h2>{selected.fullName}</h2>
            <div className="modal-email">{selected.email} · Applied {new Date(selected.createdAt).toLocaleDateString()}</div>

            <div className="section-title">Application Details</div>
            <div className="info-grid">
              {selected.organization && (
                <div className="info-block">
                  <div className="info-label">Organization</div>
                  <div className="info-value">{selected.organization}</div>
                </div>
              )}
              {selected.role && (
                <div className="info-block">
                  <div className="info-label">Role / Title</div>
                  <div className="info-value">{selected.role}</div>
                </div>
              )}
              <div className="info-block full">
                <div className="info-label">Reason for Access</div>
                <div className="info-value">{selected.reasonForAccess}</div>
              </div>
              <div className="info-block full">
                <div className="info-label">Intended Use</div>
                <div className="info-value">{selected.intendedUse}</div>
              </div>
            </div>

            <div className="section-title" style={{ marginTop: "1.5rem" }}>Vetting Scorecard (0-2 per criterion, max 10)</div>
            {Object.entries(SCORE_LABELS).map(([key, { label, desc }]) => (
              <div className="score-row" key={key}>
                <div className="score-label">{label}</div>
                <div className="score-options">
                  {[0, 1, 2].map(v => (
                    <button
                      key={v}
                      className={`score-opt${scores[key] === v ? " selected" : ""}`}
                      onClick={() => setScores(s => ({ ...s, [key]: v }))}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                {scores[key] >= 0 && (
                  <div className="score-desc">{desc[scores[key]]}</div>
                )}
              </div>
            ))}

            <div className="total-box">
              <div>
                <div className="total-label">Total Score</div>
                {calcTotal() !== null ? (
                  <div className="total-score" style={{ color: getDecision(calcTotal()!).color }}>
                    {calcTotal()} / 10
                  </div>
                ) : (
                  <div style={{ color: "#475569", fontSize: "0.9rem" }}>Score all 5 criteria to see total</div>
                )}
              </div>
              {calcTotal() !== null && (
                <div className="total-decision" style={{ color: getDecision(calcTotal()!).color }}>
                  Recommendation: {getDecision(calcTotal()!).label}
                </div>
              )}
            </div>

            <div className="section-title">Admin Notes (Private)</div>
            <textarea
              className="notes-area"
              placeholder="Record your vetting thoughts, scoring rationale, and any concerns here..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />

            {selected.status === "pending" ? (
              <div className="action-row">
                <button className="btn-approve" onClick={() => submitDecision("approved")} disabled={loading}>
                  {loading ? "Saving..." : "✅ Approve"}
                </button>
                <button className="btn-reject" onClick={() => submitDecision("rejected")} disabled={loading}>
                  {loading ? "Saving..." : "❌ Reject"}
                </button>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "1rem", color: selected.status === "approved" ? "#4ade80" : "#f87171", fontWeight: 600 }}>
                This application was {selected.status}.
                {selected.reviewedAt && <span style={{ color: "#64748b", fontWeight: 400 }}> ({new Date(selected.reviewedAt).toLocaleDateString()})</span>}
              </div>
            )}

            {msg && <div className="msg">{msg}</div>}
          </div>
        </div>
      )}
    </>
  );
}
