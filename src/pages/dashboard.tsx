import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

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

interface RecentItem {
  caseId: string;
  caseTitle: string;
  viewedAt: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  caseIds: string[];
  createdAt: string;
  updatedAt: string;
}

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  admin: { label: "Admin", color: "#ef4444" },
  custodian: { label: "Custodian", color: "#10b981" },
  researcher: { label: "Researcher", color: "#63b3ed" },
  observer: { label: "Observer", color: "#94a3b8" },
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<RecentItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [showNewProject, setShowNewProject] = useState(false);
  const [creatingProject, setCreatingProject] = useState(false);

  useEffect(() => {
    async function load() {
      const sessionRes = await fetch("/api/user/session");
      if (!sessionRes.ok) { router.replace("/login"); return; }
      const sessionData = await sessionRes.json();
      if (!sessionData.loggedIn) { router.replace("/login"); return; }
      setUser(sessionData.user);

      const [bmRes, rvRes, prRes] = await Promise.all([
        fetch("/api/user/bookmarks"),
        fetch("/api/user/recently-viewed"),
        fetch("/api/user/projects"),
      ]);
      if (bmRes.ok) { const d = await bmRes.json(); setBookmarks(d.bookmarks || []); }
      if (rvRes.ok) { const d = await rvRes.json(); setRecentlyViewed(d.recentlyViewed || []); }
      if (prRes.ok) { const d = await prRes.json(); setProjects(d.projects || []); }
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleLogout() {
    await fetch("/api/user/logout", { method: "POST" });
    router.push("/login");
  }

  async function createProject() {
    if (!newProjectName.trim()) return;
    setCreatingProject(true);
    const res = await fetch("/api/user/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newProjectName.trim(), description: newProjectDesc.trim() }),
    });
    if (res.ok) {
      const d = await res.json();
      setProjects((prev) => [...prev, d.project]);
      setNewProjectName("");
      setNewProjectDesc("");
      setShowNewProject(false);
    }
    setCreatingProject(false);
  }

  async function deleteProject(projectId: string) {
    if (!confirm("Delete this project?")) return;
    await fetch("/api/user/projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId }),
    });
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  }

  if (loading) {
    return (
      <div style={{ background: "#0a0a0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontFamily: "system-ui" }}>
        Loading workspace…
      </div>
    );
  }

  const roleInfo = ROLE_LABELS[user?.role || "observer"] || ROLE_LABELS.observer;

  return (
    <>
      <Head>
        <title>Workspace — TruthDrop.io</title>
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
        .role-badge { padding: 2px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; font-family: 'Oswald', sans-serif; letter-spacing: 0.05em; }
        .user-name { color: #94a3b8; font-size: 0.85rem; }
        .logout-btn { background: none; border: 1px solid #1e293b; border-radius: 4px; color: #64748b; font-size: 0.8rem; padding: 4px 10px; cursor: pointer; font-family: 'Courier Prime', monospace; transition: all 0.15s; }
        .logout-btn:hover { border-color: #475569; color: #94a3b8; }
        .wrap { max-width: 1100px; margin: 0 auto; padding: 2rem; }
        .page-title { font-family: 'Oswald', sans-serif; font-size: 1.75rem; font-weight: 700; color: #f1f5f9; margin-bottom: 0.25rem; }
        .page-sub { color: #64748b; font-size: 0.875rem; margin-bottom: 2rem; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        @media (max-width: 768px) { .grid { grid-template-columns: 1fr; } .topbar { padding: 0 1rem; } .wrap { padding: 1rem; } }
        .card { background: #12121a; border: 1px solid #1e293b; border-radius: 10px; padding: 1.5rem; }
        .card-title { font-family: 'Oswald', sans-serif; font-size: 1rem; font-weight: 600; color: #f59e0b; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 1rem; display: flex; align-items: center; justify-content: space-between; }
        .card-title span { font-size: 0.75rem; color: #475569; font-family: 'Courier Prime', monospace; text-transform: none; font-weight: 400; }
        .empty { color: #475569; font-size: 0.85rem; padding: 1rem 0; text-align: center; }
        .item { display: flex; align-items: flex-start; justify-content: space-between; padding: 0.6rem 0; border-bottom: 1px solid #1e293b; gap: 0.75rem; }
        .item:last-child { border-bottom: none; }
        .item-title { color: #e2e8f0; font-size: 0.875rem; line-height: 1.4; }
        .item-meta { color: #475569; font-size: 0.75rem; margin-top: 0.2rem; }
        .item-link { color: #e2e8f0; text-decoration: none; }
        .item-link:hover { color: #f59e0b; }
        .profile-card { grid-column: 1 / -1; }
        .profile-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; margin-top: 0.5rem; }
        .profile-field label { font-size: 0.7rem; color: #475569; text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 0.2rem; }
        .profile-field .val { color: #e2e8f0; font-size: 0.875rem; }
        .fi-badge { display: inline-flex; align-items: center; gap: 0.4rem; background: linear-gradient(135deg, #78350f, #92400e); border: 1px solid #f59e0b; border-radius: 4px; padding: 3px 10px; font-size: 0.75rem; font-weight: 700; color: #fbbf24; font-family: 'Oswald', sans-serif; letter-spacing: 0.05em; }
        .action-btn { background: #0a0a0f; border: 1px solid #1e293b; border-radius: 6px; color: #94a3b8; font-size: 0.8rem; padding: 6px 14px; cursor: pointer; font-family: 'Courier Prime', monospace; text-decoration: none; display: inline-block; transition: all 0.15s; }
        .action-btn:hover { border-color: #f59e0b; color: #f59e0b; }
        .action-btn.primary { background: #f59e0b; border-color: #f59e0b; color: #0a0a0f; font-weight: 700; }
        .action-btn.primary:hover { background: #fbbf24; }
        .action-btn.danger { border-color: #7f1d1d; color: #ef4444; }
        .action-btn.danger:hover { background: #1a0a0a; }
        .new-project-form { margin-top: 1rem; background: #0a0a0f; border: 1px solid #1e293b; border-radius: 8px; padding: 1rem; }
        .new-project-form input, .new-project-form textarea { width: 100%; background: #12121a; border: 1px solid #1e293b; border-radius: 4px; padding: 0.5rem 0.75rem; color: #e2e8f0; font-family: 'Courier Prime', monospace; font-size: 0.875rem; outline: none; margin-bottom: 0.75rem; }
        .new-project-form input:focus, .new-project-form textarea:focus { border-color: #f59e0b; }
        .new-project-form textarea { resize: vertical; min-height: 60px; }
        .form-actions { display: flex; gap: 0.5rem; }
        .count-badge { background: #1e293b; color: #94a3b8; border-radius: 4px; padding: 1px 7px; font-size: 0.75rem; font-family: 'Courier Prime', monospace; }
        .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
        @media (max-width: 600px) { .stats-row { grid-template-columns: repeat(2, 1fr); } }
        .stat-card { background: #12121a; border: 1px solid #1e293b; border-radius: 8px; padding: 1rem 1.25rem; }
        .stat-num { font-family: 'Oswald', sans-serif; font-size: 1.75rem; font-weight: 700; color: #f59e0b; }
        .stat-label { color: #475569; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 0.25rem; }
        .project-item { padding: 0.75rem 0; border-bottom: 1px solid #1e293b; }
        .project-item:last-child { border-bottom: none; }
        .project-header { display: flex; align-items: center; justify-content: space-between; }
        .project-name { color: #e2e8f0; font-size: 0.9rem; font-weight: 700; }
        .project-desc { color: #64748b; font-size: 0.8rem; margin-top: 0.2rem; }
        .project-meta { color: #475569; font-size: 0.75rem; margin-top: 0.3rem; }
        .project-actions { display: flex; gap: 0.5rem; }
      `}</style>

      {/* Top Navigation Bar */}
      <div className="topbar">
        <div className="topbar-left">
          <a href="/" className="site-name">TruthDrop.io</a>
          <a href="/dashboard" className="nav-link">Workspace</a>
          <a href="/profile" className="nav-link">Profile</a>
          <a href="/" className="nav-link">Case Files</a>
        </div>
        <div className="topbar-right">
          {user?.foundingInvestigator && (
            <span className="fi-badge">★ Founding Investigator</span>
          )}
          <span className="role-badge" style={{ background: `${roleInfo.color}22`, color: roleInfo.color, border: `1px solid ${roleInfo.color}44` }}>
            {roleInfo.label}
          </span>
          <span className="user-name">{user?.alias || user?.name}</span>
          <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
        </div>
      </div>

      <div className="wrap">
        <div className="page-title">Your Workspace</div>
        <div className="page-sub">
          Welcome back, {user?.alias || user?.name}. Your personal investigative workspace.
        </div>

        {/* Stats Row */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-num">{bookmarks.length}</div>
            <div className="stat-label">Saved Cases</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{projects.length}</div>
            <div className="stat-label">Projects</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{recentlyViewed.length}</div>
            <div className="stat-label">Recently Viewed</div>
          </div>
          <div className="stat-card">
            <div className="stat-num" style={{ color: roleInfo.color }}>{roleInfo.label}</div>
            <div className="stat-label">Access Level</div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid">
          {/* Recently Viewed */}
          <div className="card">
            <div className="card-title">
              Recently Viewed
              <span>{recentlyViewed.length} cases</span>
            </div>
            {recentlyViewed.length === 0 ? (
              <div className="empty">No cases viewed yet. <a href="/" style={{ color: "#f59e0b" }}>Browse case files →</a></div>
            ) : (
              recentlyViewed.slice(0, 8).map((item) => (
                <div className="item" key={item.caseId}>
                  <div>
                    <div className="item-title">
                      <a href={`/cases/${item.caseId}`} className="item-link">{item.caseTitle}</a>
                    </div>
                    <div className="item-meta">{timeAgo(item.viewedAt)}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Saved Cases */}
          <div className="card">
            <div className="card-title">
              Saved Cases
              <span>{bookmarks.length} bookmarks</span>
            </div>
            {bookmarks.length === 0 ? (
              <div className="empty">No saved cases yet. Click the bookmark icon on any case file to save it here.</div>
            ) : (
              bookmarks.slice(0, 8).map((caseId) => (
                <div className="item" key={caseId}>
                  <div>
                    <div className="item-title">
                      <a href={`/cases/${caseId}`} className="item-link">Case #{caseId}</a>
                    </div>
                  </div>
                </div>
              ))
            )}
            {bookmarks.length > 0 && (
              <div style={{ marginTop: "0.75rem" }}>
                <a href="/saved" className="action-btn">View all saved cases →</a>
              </div>
            )}
          </div>

          {/* Projects */}
          <div className="card" style={{ gridColumn: "1 / -1" }}>
            <div className="card-title">
              Research Projects
              <button className="action-btn primary" onClick={() => setShowNewProject(!showNewProject)}>
                {showNewProject ? "Cancel" : "+ New Project"}
              </button>
            </div>

            {showNewProject && (
              <div className="new-project-form">
                <input
                  type="text"
                  placeholder="Project name (e.g., 'Housing Authority Fraud 2024')"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  maxLength={100}
                />
                <textarea
                  placeholder="Brief description (optional)"
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  maxLength={300}
                />
                <div className="form-actions">
                  <button className="action-btn primary" onClick={createProject} disabled={creatingProject || !newProjectName.trim()}>
                    {creatingProject ? "Creating…" : "Create Project"}
                  </button>
                  <button className="action-btn" onClick={() => setShowNewProject(false)}>Cancel</button>
                </div>
              </div>
            )}

            {projects.length === 0 && !showNewProject ? (
              <div className="empty">No projects yet. Create a project to group related case files together.</div>
            ) : (
              projects.map((project) => (
                <div className="project-item" key={project.id}>
                  <div className="project-header">
                    <div className="project-name">{project.name}</div>
                    <div className="project-actions">
                      <span className="count-badge">{project.caseIds.length} cases</span>
                      <button className="action-btn danger" onClick={() => deleteProject(project.id)}>Delete</button>
                    </div>
                  </div>
                  {project.description && <div className="project-desc">{project.description}</div>}
                  <div className="project-meta">Created {timeAgo(project.createdAt)} · Updated {timeAgo(project.updatedAt)}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <a href="/profile" className="action-btn">Edit Profile</a>
          <a href="/" className="action-btn">Browse Case Files</a>
          <a href="/tips" className="action-btn">Submit a Tip</a>
          {(user?.role === "admin" || user?.role === "custodian") && (
            <a href="/admin" className="action-btn" style={{ borderColor: "#f59e0b", color: "#f59e0b" }}>Admin Panel</a>
          )}
        </div>
      </div>
    </>
  );
}
