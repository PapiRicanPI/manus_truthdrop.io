import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

type AppStatus = "pending" | "approved" | "rejected" | "needs_info";

interface VettingApplication {
  id: string;
  fullName: string;
  email: string;
  organization?: string;
  role?: string;
  reasonForAccess: string;
  intendedUse: string;
  status: AppStatus;
  reviewNotes?: string;
  assignedRole?: string;
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

const USER_ROLES = [
  { value: "observer", label: "Observer", desc: "Read-only access to published case files" },
  { value: "researcher", label: "Researcher", desc: "Can perform case and evidence work" },
  { value: "custodian", label: "Custodian / Moderator", desc: "Tip review, redaction, and case linking" },
  { value: "admin", label: "Admin", desc: "Full settings and role management" },
];

function getDecision(total: number): { label: string; color: string; bg: string } {
  if (total <= 3) return { label: "Recommend: Reject", color: "#ef4444", bg: "rgba(239,68,68,0.08)" };
  if (total <= 6) return { label: "Recommend: Request More Info", color: "#f59e0b", bg: "rgba(245,158,11,0.08)" };
  return { label: "Recommend: Approve", color: "#22c55e", bg: "rgba(34,197,94,0.08)" };
}

function StatusBadge({ status }: { status: AppStatus }) {
  const map: Record<AppStatus, { label: string; color: string }> = {
    pending: { label: "Pending", color: "#a78bfa" },
    approved: { label: "Approved", color: "#22c55e" },
    rejected: { label: "Rejected", color: "#ef4444" },
    needs_info: { label: "Needs More Info", color: "#f59e0b" },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{
      background: s.color + "22",
      color: s.color,
      border: `1px solid ${s.color}55`,
      borderRadius: "999px",
      padding: "2px 12px",
      fontSize: "0.75rem",
      fontWeight: 600,
      letterSpacing: "0.03em",
      whiteSpace: "nowrap",
    }}>{s.label}</span>
  );
}

export default function VettingPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [applications, setApplications] = useState<VettingApplication[]>([]);
  const [selected, setSelected] = useState<VettingApplication | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected" | "needs_info">("pending");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState<"ok" | "err">("ok");
  const [showAdd, setShowAdd] = useState(false);
  const [newApp, setNewApp] = useState({ fullName: "", email: "", organization: "", role: "", reasonForAccess: "", intendedUse: "" });
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [assignedRole, setAssignedRole] = useState("observer");
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);

  useEffect(() => {
    fetch("/api/admin/session")
      .then(r => r.json())
      .then(d => {
        if (d.isAdmin) { setAuthChecked(true); loadApplications(); }
        else { router.replace("/admin/login"); }
      })
      .catch(() => router.replace("/admin/login"));
  }, [router]);

  async function loadApplications() {
    try {
      const res = await fetch("/api/admin/vetting");
      if (res.ok) { const data = await res.json(); setApplications(data.applications || []); }
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
    setMsg(""); setShowApproveModal(false); setShowInfoModal(false); setShowRejectConfirm(false);
    setInfoMessage(""); setAssignedRole("observer");
  }

  function calcTotal(): number | null {
    const vals = Object.values(scores);
    if (vals.some(v => v < 0)) return null;
    return vals.reduce((a, b) => a + b, 0);
  }

  function showErr(m: string) { setMsg(m); setMsgType("err"); }
  function showOk(m: string) { setMsg(m); setMsgType("ok"); }

  function handleApproveClick() {
    if (calcTotal() === null) { showErr("Please score all 5 criteria before approving."); return; }
    if (!notes.trim()) { showErr("Please add admin notes before approving."); return; }
    setShowApproveModal(true);
  }
  function handleInfoClick() {
    if (calcTotal() === null) { showErr("Please score all 5 criteria before requesting more info."); return; }
    if (!notes.trim()) { showErr("Please add admin notes before requesting more info."); return; }
    setShowInfoModal(true);
  }
  function handleRejectClick() {
    if (calcTotal() === null) { showErr("Please score all 5 criteria before rejecting."); return; }
    if (!notes.trim()) { showErr("Please add admin notes before rejecting."); return; }
    setShowRejectConfirm(true);
  }

  async function submitDecision(decision: "approved" | "rejected" | "needs_info", extra?: { assignedRole?: string; infoMessage?: string }) {
    if (!selected) return;
    const total = calcTotal();
    setLoading(true); setMsg("");
    try {
      const res = await fetch("/api/admin/vetting", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selected.id, status: decision, reviewNotes: notes, assignedRole: extra?.assignedRole, infoMessage: extra?.infoMessage, ...scores, scoreTotal: total }),
      });
      if (res.ok) {
        const labels: Record<string, string> = {
          approved: "Application approved. Approval email sent to applicant.",
          rejected: "Application rejected. Rejection email sent to applicant.",
          needs_info: "More info requested. Email sent to applicant.",
        };
        showOk(labels[decision] || "Decision saved.");
        setShowApproveModal(false); setShowInfoModal(false); setShowRejectConfirm(false);
        await loadApplications(); setSelected(null);
      } else {
        const err = await res.json().catch(() => ({}));
        showErr(err.error || "Error saving decision. Please try again.");
      }
    } catch { showErr("Network error. Please try again."); }
    finally { setLoading(false); }
  }

  async function handleAddApplication() {
    if (!newApp.fullName || !newApp.email || !newApp.reasonForAccess || !newApp.intendedUse) {
      showErr("Full name, email, reason for access, and intended use are required."); return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/vetting", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newApp) });
      if (res.ok) {
        setShowAdd(false);
        setNewApp({ fullName: "", email: "", organization: "", role: "", reasonForAccess: "", intendedUse: "" });
        showOk("Application added successfully."); await loadApplications();
      } else { showErr("Error adding application."); }
    } catch { showErr("Network error."); }
    finally { setLoading(false); }
  }

  const filtered = applications.filter(a => filter === "all" ? true : a.status === filter);
  const counts = {
    all: applications.length,
    pending: applications.filter(a => a.status === "pending").length,
    needs_info: applications.filter(a => a.status === "needs_info").length,
    approved: applications.filter(a => a.status === "approved").length,
    rejected: applications.filter(a => a.status === "rejected").length,
  };

  if (!authChecked) return (
    <div style={{ background: "#0a0a0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontFamily: "system-ui" }}>
      Checking access...
    </div>
  );

  const total = calcTotal();
  const decision = total !== null ? getDecision(total) : null;
  const isReviewed = selected && selected.status !== "pending" && selected.status !== "needs_info";

  const S: Record<string, React.CSSProperties> = {
    layout: { display: "flex", minHeight: "100vh", background: "#0a0a0f", color: "#e2e8f0", fontFamily: "system-ui, -apple-system, sans-serif" },
    sidebar: { width: 240, background: "#0f0f1a", borderRight: "1px solid #1e293b", padding: "1.5rem 0", flexShrink: 0, display: "flex", flexDirection: "column" },
    sidebarLogo: { padding: "0 1.5rem 1.25rem", borderBottom: "1px solid #1e293b", marginBottom: "0.75rem" },
    main: { flex: 1, padding: "2rem", overflowY: "auto" as const },
    card: { background: "#0f0f1a", border: "1px solid #1e293b", borderRadius: 10, padding: "1rem 1.25rem", cursor: "pointer", marginBottom: "0.75rem", transition: "border-color 0.15s" },
    infoBlock: { background: "#1a1a2e", borderRadius: 8, padding: "0.75rem" },
    scoreRow: { background: "#1a1a2e", borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "0.5rem" },
    totalBox: { background: "#1a1a2e", borderRadius: 10, padding: "1rem 1.25rem", margin: "1rem 0", display: "flex", alignItems: "center", justifyContent: "space-between" },
    overlay: { position: "fixed" as const, inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "1rem" },
    modal: { background: "#0f0f1a", border: "1px solid #334155", borderRadius: 14, padding: "1.75rem", maxWidth: 480, width: "100%" },
  };

  return (
    <>
      <Head><title>Vetting Applications — TruthDrop Admin</title></Head>
      <div style={S.layout}>
        {/* Sidebar */}
        <div style={S.sidebar}>
          <div style={S.sidebarLogo}>
            <div style={{ color: "#f59e0b", fontWeight: 700, fontSize: "1.05rem" }}>🛡️ TruthDrop</div>
            <div style={{ color: "#475569", fontSize: "0.72rem", marginTop: 2 }}>Admin Dashboard</div>
          </div>
          <nav>
            {[
              { href: "/admin", icon: "📊", label: "Overview" },
              { href: "/admin/vetting", icon: "✅", label: "Vetting Applications", active: true },
              { href: "/admin/users", icon: "👥", label: "User Management" },
              { href: "/admin/cases", icon: "📁", label: "Cases" },
              { href: "/admin/tips", icon: "📬", label: "Tips" },
            ].map(item => (
              <Link key={item.href} href={item.href} style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.6rem 1.5rem", color: item.active ? "#f1f5f9" : "#64748b", textDecoration: "none", fontSize: "0.875rem", background: item.active ? "#1e293b" : "none", borderLeft: item.active ? "3px solid #f59e0b" : "3px solid transparent" }}>
                <span>{item.icon}</span>{item.label}
              </Link>
            ))}
          </nav>
          <div style={{ marginTop: "auto", padding: "1rem 1.5rem", borderTop: "1px solid #1e293b" }}>
            <button onClick={handleLogout} style={{ width: "100%", background: "none", border: "1px solid #334155", color: "#94a3b8", padding: "0.5rem", borderRadius: 6, cursor: "pointer", fontSize: "0.8rem" }}>
              Sign Out
            </button>
          </div>
        </div>

        {/* Main */}
        <div style={S.main}>
          {!selected ? (
            <>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#f1f5f9" }}>✅ Vetting Applications</h1>
                  <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: 3 }}>Review, score, and manage database access requests</p>
                </div>
                <button onClick={() => setShowAdd(v => !v)} style={{ background: "#f59e0b", color: "#0a0a0f", border: "none", padding: "0.5rem 1.2rem", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.875rem" }}>
                  {showAdd ? "Cancel" : "+ Add Application"}
                </button>
              </div>

              {msg && <div style={{ marginBottom: "1rem", padding: "0.6rem 1rem", borderRadius: 6, fontSize: "0.85rem", fontWeight: 500, background: msgType === "ok" ? "#14532d22" : "#7f1d1d22", color: msgType === "ok" ? "#4ade80" : "#f87171", border: `1px solid ${msgType === "ok" ? "#16a34a44" : "#99182244"}` }}>{msg}</div>}

              {/* Add Form */}
              {showAdd && (
                <div style={{ background: "#0f0f1a", border: "1px solid #1e293b", borderRadius: 12, padding: "1.5rem", marginBottom: "1.5rem" }}>
                  <div style={{ color: "#94a3b8", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: "1rem" }}>Add Application Manually</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    {[
                      { key: "fullName", label: "Full Name *", full: false },
                      { key: "email", label: "Email Address *", full: false },
                      { key: "organization", label: "Organization / Institution", full: false },
                      { key: "role", label: "Role / Title", full: false },
                      { key: "reasonForAccess", label: "Reason for Access *", full: true },
                      { key: "intendedUse", label: "Intended Use *", full: true },
                    ].map(f => (
                      <div key={f.key} style={{ gridColumn: f.full ? "1 / -1" : undefined, display: "flex", flexDirection: "column", gap: 4 }}>
                        <label style={{ color: "#94a3b8", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{f.label}</label>
                        <input value={(newApp as any)[f.key]} onChange={e => setNewApp(a => ({ ...a, [f.key]: e.target.value }))}
                          style={{ background: "#1a1a2e", border: "1px solid #334155", borderRadius: 6, color: "#e2e8f0", padding: "0.5rem 0.75rem", fontSize: "0.875rem", outline: "none", fontFamily: "inherit" }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                    <button onClick={handleAddApplication} disabled={loading} style={{ background: "#f59e0b", color: "#0a0a0f", border: "none", padding: "0.5rem 1.25rem", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.875rem" }}>
                      {loading ? "Saving..." : "Save Application"}
                    </button>
                    <button onClick={() => setShowAdd(false)} style={{ background: "none", border: "1px solid #334155", color: "#94a3b8", padding: "0.5rem 1.25rem", borderRadius: 6, cursor: "pointer", fontSize: "0.875rem" }}>Cancel</button>
                  </div>
                </div>
              )}

              {/* Filter Tabs */}
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                {(["pending", "needs_info", "all", "approved", "rejected"] as const).map(f => (
                  <button key={f} onClick={() => setFilter(f)} style={{ padding: "0.4rem 1rem", borderRadius: 6, border: "1px solid", borderColor: filter === f ? "#334155" : "#1e293b", background: filter === f ? "#1e293b" : "none", color: filter === f ? "#f1f5f9" : "#64748b", cursor: "pointer", fontSize: "0.8rem", fontWeight: 500 }}>
                    {f === "needs_info" ? "Needs Info" : f.charAt(0).toUpperCase() + f.slice(1)}
                    <span style={{ background: "#334155", color: "#94a3b8", borderRadius: 999, padding: "0 6px", fontSize: "0.7rem", marginLeft: 4 }}>{counts[f]}</span>
                  </button>
                ))}
              </div>

              {/* App List */}
              {filtered.length === 0 ? (
                <div style={{ textAlign: "center", color: "#475569", padding: "3rem" }}>No {filter === "all" ? "" : filter.replace("_", " ")} applications found.</div>
              ) : (
                filtered.map(app => (
                  <div key={app.id} style={S.card} onClick={() => openApplication(app)}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                      <div>
                        <div style={{ fontWeight: 600, color: "#f1f5f9", fontSize: "0.95rem" }}>{app.fullName}</div>
                        <div style={{ color: "#64748b", fontSize: "0.8rem", marginTop: 2 }}>{app.email}</div>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>
                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", fontSize: "0.78rem", color: "#64748b" }}>
                      {app.organization && <span>🏢 {app.organization}</span>}
                      {app.role && <span>👤 {app.role}</span>}
                      <span>📅 {new Date(app.createdAt).toLocaleDateString()}</span>
                      {app.scoreTotal != null && <span style={{ color: getDecision(app.scoreTotal).color }}>Score: {app.scoreTotal}/10</span>}
                      {app.assignedRole && <span style={{ color: "#a78bfa" }}>Role: {app.assignedRole}</span>}
                    </div>
                  </div>
                ))
              )}
            </>
          ) : (
            /* Detail View */
            <div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "1px solid #334155", color: "#94a3b8", padding: "0.4rem 0.9rem", borderRadius: 6, cursor: "pointer", fontSize: "0.8rem", marginBottom: "1rem" }}>
                ← Back to List
              </button>
              <div style={{ background: "#0f0f1a", border: "1px solid #1e293b", borderRadius: 12, padding: "1.5rem" }}>
                {/* Detail Header */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                  <div>
                    <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#f1f5f9" }}>{selected.fullName}</div>
                    <div style={{ color: "#64748b", fontSize: "0.85rem", marginTop: 3 }}>✉️ {selected.email}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.4rem" }}>
                    <StatusBadge status={selected.status} />
                    <span style={{ color: "#64748b", fontSize: "0.72rem" }}>Applied {new Date(selected.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Info Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.25rem" }}>
                  {selected.organization && (
                    <div style={S.infoBlock}>
                      <div style={{ color: "#64748b", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Organization</div>
                      <div style={{ color: "#e2e8f0", fontSize: "0.875rem" }}>{selected.organization}</div>
                    </div>
                  )}
                  {selected.role && (
                    <div style={S.infoBlock}>
                      <div style={{ color: "#64748b", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Role / Title</div>
                      <div style={{ color: "#e2e8f0", fontSize: "0.875rem" }}>{selected.role}</div>
                    </div>
                  )}
                  <div style={{ ...S.infoBlock, gridColumn: "1 / -1" }}>
                    <div style={{ color: "#64748b", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Reason for Access</div>
                    <div style={{ color: "#e2e8f0", fontSize: "0.875rem", lineHeight: 1.6 }}>{selected.reasonForAccess}</div>
                  </div>
                  <div style={{ ...S.infoBlock, gridColumn: "1 / -1" }}>
                    <div style={{ color: "#64748b", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Intended Use</div>
                    <div style={{ color: "#e2e8f0", fontSize: "0.875rem", lineHeight: 1.6 }}>{selected.intendedUse}</div>
                  </div>
                </div>

                {/* Scorecard */}
                <div style={{ color: "#94a3b8", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, margin: "1.25rem 0 0.75rem" }}>
                  Vetting Scorecard — Score 0, 1, or 2 for each criterion (max 10)
                </div>
                {Object.entries(SCORE_LABELS).map(([key, { label, desc }]) => (
                  <div key={key} style={S.scoreRow}>
                    <div style={{ color: "#cbd5e1", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.5rem" }}>{label}</div>
                    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.4rem" }}>
                      {[0, 1, 2].map(v => (
                        <button key={v} onClick={() => !isReviewed && setScores(s => ({ ...s, [key]: v }))}
                          disabled={!!isReviewed}
                          style={{ width: 40, height: 40, borderRadius: 8, border: `2px solid ${scores[key] === v ? "#f59e0b" : "#334155"}`, background: scores[key] === v ? "#f59e0b22" : "#0f0f1a", color: scores[key] === v ? "#f59e0b" : "#94a3b8", fontSize: "1rem", fontWeight: 700, cursor: isReviewed ? "default" : "pointer", transition: "all 0.15s" }}>
                          {v}
                        </button>
                      ))}
                    </div>
                    {scores[key] >= 0 && <div style={{ color: "#64748b", fontSize: "0.75rem", fontStyle: "italic" }}>{desc[scores[key]]}</div>}
                  </div>
                ))}

                {/* Score Total */}
                <div style={{ ...S.totalBox, borderLeft: decision ? `4px solid ${decision.color}` : "4px solid #334155", background: decision ? decision.bg : "#1a1a2e" }}>
                  <div>
                    <div style={{ color: "#64748b", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Score</div>
                    {total !== null ? (
                      <div style={{ fontSize: "2rem", fontWeight: 800, color: decision?.color, marginTop: 2 }}>{total} / 10</div>
                    ) : (
                      <div style={{ color: "#475569", fontSize: "0.875rem", marginTop: 4 }}>Score all 5 criteria to see total</div>
                    )}
                  </div>
                  {decision && (
                    <div style={{ color: decision.color, background: decision.bg, border: `1px solid ${decision.color}44`, borderRadius: 8, padding: "0.4rem 1rem", fontSize: "0.875rem", fontWeight: 700 }}>
                      {decision.label}
                    </div>
                  )}
                </div>

                {/* Admin Notes */}
                <div style={{ color: "#94a3b8", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, margin: "1.25rem 0 0.5rem" }}>
                  Admin Notes (Private — never shown to applicant)
                </div>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} disabled={!!isReviewed}
                  placeholder="Record your vetting thoughts, scoring rationale, and any concerns here..."
                  style={{ width: "100%", background: "#1a1a2e", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0", padding: "0.75rem", fontSize: "0.875rem", resize: "vertical", minHeight: 90, outline: "none", fontFamily: "inherit" }} />

                {/* Action Buttons */}
                {!isReviewed ? (
                  <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
                    <button onClick={handleApproveClick} disabled={loading} style={{ flex: 1, background: "#16a34a", color: "#fff", border: "none", padding: "0.75rem", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: "0.875rem", opacity: loading ? 0.5 : 1 }}>
                      ✅ Approve
                    </button>
                    <button onClick={handleInfoClick} disabled={loading} style={{ flex: 1, background: "#92400e", color: "#fef3c7", border: "none", padding: "0.75rem", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: "0.875rem", opacity: loading ? 0.5 : 1 }}>
                      🔄 Request More Info
                    </button>
                    <button onClick={handleRejectClick} disabled={loading} style={{ flex: 1, background: "#991b1b", color: "#fff", border: "none", padding: "0.75rem", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: "0.875rem", opacity: loading ? 0.5 : 1 }}>
                      ❌ Reject
                    </button>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "1rem", borderRadius: 8, fontWeight: 600, marginTop: "1rem", background: selected.status === "approved" ? "#14532d22" : selected.status === "rejected" ? "#7f1d1d22" : "#4c1d9522", color: selected.status === "approved" ? "#4ade80" : selected.status === "rejected" ? "#f87171" : "#a78bfa", border: `1px solid ${selected.status === "approved" ? "#16a34a44" : selected.status === "rejected" ? "#99182244" : "#7c3aed44"}` }}>
                    This application was <strong>{selected.status === "needs_info" ? "sent a request for more information" : selected.status}</strong>
                    {selected.assignedRole && selected.status === "approved" && <span> — Role: <strong>{selected.assignedRole}</strong></span>}
                    {selected.reviewedAt && <span style={{ color: "#64748b", fontWeight: 400 }}> on {new Date(selected.reviewedAt).toLocaleDateString()}</span>}
                  </div>
                )}

                {msg && <div style={{ marginTop: "0.75rem", padding: "0.6rem 1rem", borderRadius: 6, fontSize: "0.85rem", fontWeight: 500, background: msgType === "ok" ? "#14532d22" : "#7f1d1d22", color: msgType === "ok" ? "#4ade80" : "#f87171", border: `1px solid ${msgType === "ok" ? "#16a34a44" : "#99182244"}` }}>{msg}</div>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* APPROVE MODAL */}
      {showApproveModal && selected && (
        <div style={S.overlay} onClick={e => { if (e.target === e.currentTarget) setShowApproveModal(false); }}>
          <div style={S.modal}>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f1f5f9", marginBottom: "0.4rem" }}>✅ Approve Application</div>
            <div style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
              Approving <strong style={{ color: "#e2e8f0" }}>{selected.fullName}</strong> ({selected.email}). Select the role to assign:
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.25rem" }}>
              {USER_ROLES.map(r => (
                <div key={r.value} onClick={() => setAssignedRole(r.value)}
                  style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", background: "#1a1a2e", border: `2px solid ${assignedRole === r.value ? "#f59e0b" : "#1e293b"}`, borderRadius: 8, padding: "0.75rem 1rem", cursor: "pointer", background: assignedRole === r.value ? "#f59e0b0d" : "#1a1a2e" }}>
                  <input type="radio" name="role" value={r.value} checked={assignedRole === r.value} onChange={() => setAssignedRole(r.value)} style={{ marginTop: 3, accentColor: "#f59e0b" }} />
                  <div>
                    <div style={{ color: "#f1f5f9", fontWeight: 600, fontSize: "0.9rem" }}>{r.label}</div>
                    <div style={{ color: "#64748b", fontSize: "0.78rem", marginTop: 2 }}>{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: "#14532d22", border: "1px solid #16a34a44", borderRadius: 8, padding: "0.65rem 1rem", color: "#4ade80", fontSize: "0.8rem", marginBottom: "1.25rem" }}>
              An approval email with login credentials will be automatically sent to {selected.email}.
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={() => submitDecision("approved", { assignedRole })} disabled={loading}
                style={{ flex: 1, background: "#16a34a", color: "#fff", border: "none", padding: "0.65rem", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: "0.875rem", opacity: loading ? 0.5 : 1 }}>
                {loading ? "Processing..." : "Confirm Approval & Send Email"}
              </button>
              <button onClick={() => setShowApproveModal(false)} style={{ flex: 1, background: "none", border: "1px solid #334155", color: "#94a3b8", padding: "0.65rem", borderRadius: 8, cursor: "pointer", fontSize: "0.875rem" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* REQUEST MORE INFO MODAL */}
      {showInfoModal && selected && (
        <div style={S.overlay} onClick={e => { if (e.target === e.currentTarget) setShowInfoModal(false); }}>
          <div style={S.modal}>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f1f5f9", marginBottom: "0.4rem" }}>🔄 Request More Information</div>
            <div style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "1rem" }}>
              An email will be sent to <strong style={{ color: "#e2e8f0" }}>{selected.email}</strong> asking for the following:
            </div>
            <textarea value={infoMessage} onChange={e => setInfoMessage(e.target.value)}
              placeholder={"Describe exactly what information you need. For example:\n- Please provide your organization website\n- Please clarify your specific research purpose\n- Please provide a verifiable professional email"}
              style={{ width: "100%", background: "#1a1a2e", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0", padding: "0.75rem", fontSize: "0.875rem", resize: "vertical", minHeight: 110, outline: "none", fontFamily: "inherit", marginBottom: "1rem" }} />
            <div style={{ background: "#4c1d9522", border: "1px solid #7c3aed44", borderRadius: 8, padding: "0.65rem 1rem", color: "#a78bfa", fontSize: "0.8rem", marginBottom: "1.25rem" }}>
              The application status will be set to <strong>Needs More Info</strong>. You can review it again after they respond.
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={() => { if (!infoMessage.trim()) { showErr("Please describe what information you need."); return; } submitDecision("needs_info", { infoMessage }); }}
                disabled={loading}
                style={{ flex: 1, background: "#92400e", color: "#fef3c7", border: "none", padding: "0.65rem", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: "0.875rem", opacity: loading ? 0.5 : 1 }}>
                {loading ? "Sending..." : "Send Request Email"}
              </button>
              <button onClick={() => setShowInfoModal(false)} style={{ flex: 1, background: "none", border: "1px solid #334155", color: "#94a3b8", padding: "0.65rem", borderRadius: 8, cursor: "pointer", fontSize: "0.875rem" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT CONFIRM MODAL */}
      {showRejectConfirm && selected && (
        <div style={S.overlay} onClick={e => { if (e.target === e.currentTarget) setShowRejectConfirm(false); }}>
          <div style={S.modal}>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f1f5f9", marginBottom: "0.4rem" }}>❌ Confirm Rejection</div>
            <div style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "1rem" }}>
              You are about to reject <strong style={{ color: "#e2e8f0" }}>{selected.fullName}</strong> ({selected.email}).
            </div>
            <div style={{ background: "#7f1d1d22", border: "1px solid #99182244", borderRadius: 8, padding: "0.65rem 1rem", color: "#f87171", fontSize: "0.8rem", marginBottom: "1.25rem" }}>
              A rejection email will be sent automatically. Your admin notes will be included as the basis for the decision.
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={() => submitDecision("rejected")} disabled={loading}
                style={{ flex: 1, background: "#991b1b", color: "#fff", border: "none", padding: "0.65rem", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: "0.875rem", opacity: loading ? 0.5 : 1 }}>
                {loading ? "Processing..." : "Confirm Rejection & Send Email"}
              </button>
              <button onClick={() => setShowRejectConfirm(false)} style={{ flex: 1, background: "none", border: "1px solid #334155", color: "#94a3b8", padding: "0.65rem", borderRadius: 8, cursor: "pointer", fontSize: "0.875rem" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
