import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  organization: string | null;
  role: string;
  alias: string | null;
  country: string | null;
  foundingInvestigator: boolean;
  foundingInvestigatorYear: number | null;
  createdAt: string;
  hasLogin?: boolean;
}

const ROLE_OPTIONS = [
  { value: "observer", label: "Observer", color: "#94a3b8", bg: "#0f172a" },
  { value: "researcher", label: "Researcher", color: "#63b3ed", bg: "#0a1628" },
  { value: "custodian", label: "Custodian", color: "#68d391", bg: "#0a1a0a" },
  { value: "admin", label: "Admin", color: "#fc8181", bg: "#3b0000" },
];

function roleMeta(role: string) {
  return ROLE_OPTIONS.find((r) => r.value === role) || ROLE_OPTIONS[0];
}

function formatDate(iso: string) {
  try { return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }
  catch { return "—"; }
}

export default function UsersPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((d) => {
        if (d.isAdmin) { setAuthChecked(true); fetchUsers(); }
        else router.replace("/admin/login");
      })
      .catch(() => router.replace("/admin/login"));
  }, [router]);

  function fetchUsers() {
    setLoading(true);
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => { setUsers(d.users || []); setLoading(false); })
      .catch(() => { setError("Failed to load users."); setLoading(false); });
  }

  function flash(msg: string) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  }

  async function changeRole(userId: string, newRole: string) {
    setSaving(userId + "_role");
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userId, role: newRole }),
    });
    if (res.ok) {
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u));
      flash("Role updated.");
    } else { setError("Failed to update role."); }
    setSaving(null);
  }

  async function toggleFI(userId: string, current: boolean) {
    setSaving(userId + "_fi");
    const year = !current ? new Date().getFullYear() : null;
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userId, foundingInvestigator: !current, foundingInvestigatorYear: year }),
    });
    if (res.ok) {
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, foundingInvestigator: !current, foundingInvestigatorYear: year } : u));
      flash(!current ? "★ Founding Investigator badge granted." : "Badge removed.");
    } else { setError("Failed to update badge."); }
    setSaving(null);
  }

  if (!authChecked) return (
    <div style={{ background: "#0a0a0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontFamily: "system-ui" }}>
      Checking access…
    </div>
  );

  const fiCount = users.filter((u) => u.foundingInvestigator).length;
  const researcherCount = users.filter((u) => u.role === "researcher").length;
  const custodianCount = users.filter((u) => u.role === "custodian").length;

  return (
    <>
      <Head><title>User Management — TruthDrop Admin</title></Head>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0f; color: #e2e8f0; font-family: system-ui, -apple-system, sans-serif; }
        .wrap { max-width: 1040px; margin: 0 auto; padding: 2rem 1.5rem; }
        .back { color: #64748b; text-decoration: none; font-size: 0.875rem; display: inline-flex; align-items: center; gap: 0.4rem; margin-bottom: 1.5rem; }
        .back:hover { color: #94a3b8; }
        h1 { font-size: 1.5rem; font-weight: 700; color: #f1f5f9; }
        .subtitle { color: #64748b; font-size: 0.875rem; margin-top: 0.25rem; margin-bottom: 1.5rem; }
        .stats { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
        .stat { background: #12121a; border: 1px solid #1e293b; border-radius: 8px; padding: 0.75rem 1.25rem; min-width: 110px; }
        .stat-num { font-size: 1.5rem; font-weight: 700; color: #f59e0b; }
        .stat-label { font-size: 0.7rem; color: #475569; text-transform: uppercase; letter-spacing: 0.08em; }
        .legend { display: flex; gap: 1.25rem; flex-wrap: wrap; margin-bottom: 1.5rem; padding: 0.875rem 1rem; background: #0d0d17; border: 1px solid #1e293b; border-radius: 8px; }
        .legend-item { display: flex; align-items: center; gap: 0.4rem; font-size: 0.78rem; }
        .legend-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; font-size: 0.7rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; padding: 0.75rem 1rem; border-bottom: 1px solid #1e293b; }
        td { padding: 0.9rem 1rem; border-bottom: 1px solid #0f172a; font-size: 0.875rem; vertical-align: middle; }
        tr:hover td { background: #0d0d17; }
        .badge { display: inline-block; padding: 0.2rem 0.65rem; border-radius: 4px; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; }
        .fi-badge { display: inline-flex; align-items: center; gap: 0.25rem; background: linear-gradient(135deg, #78350f, #92400e); border: 1px solid #f59e0b; border-radius: 4px; padding: 2px 8px; font-size: 0.7rem; font-weight: 700; color: #fbbf24; }
        .role-select { background: #0f172a; color: #e2e8f0; border: 1px solid #1e293b; border-radius: 6px; padding: 0.3rem 0.6rem; font-size: 0.8rem; cursor: pointer; }
        .role-select:disabled { opacity: 0.5; cursor: not-allowed; }
        .role-select:focus { outline: 1px solid #f59e0b; }
        .btn-sm { background: none; border: 1px solid #1e293b; border-radius: 4px; color: #64748b; font-size: 0.75rem; padding: 3px 10px; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
        .btn-sm:hover:not(:disabled) { border-color: #f59e0b; color: #f59e0b; }
        .btn-sm.active { background: linear-gradient(135deg, #78350f, #92400e); border-color: #f59e0b; color: #fbbf24; }
        .btn-sm:disabled { opacity: 0.5; cursor: not-allowed; }
        .org { color: #94a3b8; font-size: 0.8rem; }
        .email { color: #64748b; font-size: 0.8rem; }
        .success { background: #14532d22; border: 1px solid #16a34a44; color: #4ade80; padding: 0.6rem 1rem; border-radius: 6px; font-size: 0.85rem; margin-bottom: 1rem; }
        .err { background: #7f1d1d22; border: 1px solid #99182244; color: #f87171; padding: 0.6rem 1rem; border-radius: 6px; font-size: 0.85rem; margin-bottom: 1rem; }
        .empty { text-align: center; padding: 3rem; color: #475569; font-size: 0.9rem; }
        .count { background: #1e293b; color: #94a3b8; font-size: 0.75rem; padding: 0.2rem 0.6rem; border-radius: 999px; margin-left: 0.5rem; }
      `}</style>
      <div className="wrap">
        <Link href="/admin" className="back">← Back to Dashboard</Link>
        <h1>👥 User Management <span className="count">{users.length}</span></h1>
        <p className="subtitle">Manage approved users, roles, and Founding Investigator badges.</p>

        <div className="stats">
          <div className="stat"><div className="stat-num">{users.length}</div><div className="stat-label">Total Users</div></div>
          <div className="stat"><div className="stat-num">{researcherCount}</div><div className="stat-label">Researchers</div></div>
          <div className="stat"><div className="stat-num">{custodianCount}</div><div className="stat-label">Custodians</div></div>
          <div className="stat"><div className="stat-num">{fiCount}</div><div className="stat-label">Founding Investigators</div></div>
        </div>

        <div className="legend">
          {ROLE_OPTIONS.map((r) => (
            <div key={r.value} className="legend-item">
              <div className="legend-dot" style={{ background: r.color }} />
              <span style={{ color: r.color, fontWeight: 700 }}>{r.label}</span>
              <span style={{ color: "#64748b" }}>—
                {r.value === "observer" && " Read-only access"}
                {r.value === "researcher" && " Case & evidence work"}
                {r.value === "custodian" && " Tip review, redaction, case linking"}
                {r.value === "admin" && " Full platform management"}
              </span>
            </div>
          ))}
        </div>

        {successMsg && <div className="success">✓ {successMsg}</div>}
        {error && <div className="err">⚠ {error}</div>}

        {loading ? (
          <div className="empty">Loading users…</div>
        ) : users.length === 0 ? (
          <div className="empty">
            No approved users yet. Approve applications in the{" "}
            <Link href="/admin/vetting" style={{ color: "#f59e0b" }}>Vetting Dashboard</Link>.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Organization</th>
                <th>Role</th>
                <th>★ Founding Investigator</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const meta = roleMeta(u.role);
                return (
                  <tr key={u.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: "#f1f5f9" }}>{u.alias || u.name}</div>
                      {u.alias && <div className="email">{u.name}</div>}
                      <div className="email">{u.email}</div>
                      {u.country && <div className="org">{u.country}</div>}
                      {u.hasLogin === false && (
                        <div style={{ marginTop: "0.3rem", fontSize: "0.7rem", color: "#f59e0b", background: "#1a120044", border: "1px solid #f59e0b55", borderRadius: "4px", padding: "0.1rem 0.5rem", display: "inline-block" }}>⚠ Approved — no login yet</div>
                      )}
                    </td>
                    <td className="org">{u.organization || "—"}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <select
                          className="role-select"
                          value={u.role}
                          disabled={saving === u.id + "_role"}
                          onChange={(e) => changeRole(u.id, e.target.value)}
                        >
                          {ROLE_OPTIONS.map((r) => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                          ))}
                        </select>
                        <span className="badge" style={{ background: meta.bg, color: meta.color }}>{meta.label}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                        {u.foundingInvestigator && (
                          <span className="fi-badge">★ {u.foundingInvestigatorYear || ""}</span>
                        )}
                        <button
                          className={`btn-sm ${u.foundingInvestigator ? "active" : ""}`}
                          onClick={() => toggleFI(u.id, u.foundingInvestigator)}
                          disabled={saving === u.id + "_fi"}
                        >
                          {saving === u.id + "_fi" ? "…" : u.foundingInvestigator ? "Remove Badge" : "Grant Badge"}
                        </button>
                      </div>
                    </td>
                    <td style={{ color: "#64748b", fontSize: "0.8rem" }}>{formatDate(u.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
