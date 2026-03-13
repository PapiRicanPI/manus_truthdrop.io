import { useState } from "react";
import { api } from "~/utils/api";

type Role = "observer" | "researcher" | "custodian" | "admin";
type FilterStatus = "all" | "pending" | "approved" | "rejected" | "needs_info";

const ROLE_LABELS: Record<Role, string> = {
  observer: "Observer (read-only)",
  researcher: "Researcher (case/evidence work)",
  custodian: "Custodian / Moderator (tip review, redaction)",
  admin: "Admin (full access)",
};

const SCORE_BANDS = [
  { min: 75, max: 100, label: "Recommend Approve", color: "#22c55e" },
  { min: 40, max: 74, label: "Manual Review", color: "#f59e0b" },
  { min: 0, max: 39, label: "Recommend Deny", color: "#ef4444" },
];

function getScoreBand(score: number) {
  return SCORE_BANDS.find((b) => score >= b.min && score <= b.max) ?? SCORE_BANDS[2];
}

export default function VettingApplications() {
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Modal states
  const [approveModal, setApproveModal] = useState<{ id: string; name: string } | null>(null);
  const [rejectModal, setRejectModal] = useState<{ id: string; name: string } | null>(null);
  const [infoModal, setInfoModal] = useState<{ id: string; name: string } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ id: string; name: string } | null>(null);

  // Modal form values
  const [approveNotes, setApproveNotes] = useState("");
  const [approveRole, setApproveRole] = useState<Role>("observer");
  const [rejectNotes, setRejectNotes] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const { data: applications, refetch } = api.vetting.getApplications.useQuery({ status: filter });
  const { data: stats } = api.vetting.getStats.useQuery();

  const approveMutation = api.vetting.approveApplication.useMutation({
    onSuccess: () => { refetch(); setApproveModal(null); setApproveNotes(""); setApproveRole("observer"); alert("Application approved! Approval email sent."); },
    onError: (e) => alert(`Error: ${e.message}`),
  });
  const rejectMutation = api.vetting.rejectApplication.useMutation({
    onSuccess: () => { refetch(); setRejectModal(null); setRejectNotes(""); alert("Application rejected. Rejection email sent."); },
    onError: (e) => alert(`Error: ${e.message}`),
  });
  const infoMutation = api.vetting.requestMoreInfo.useMutation({
    onSuccess: () => { refetch(); setInfoModal(null); setInfoMessage(""); alert("More-info request sent to applicant."); },
    onError: (e) => alert(`Error: ${e.message}`),
  });
  const deleteMutation = api.vetting.deleteApplication.useMutation({
    onSuccess: () => { refetch(); setDeleteModal(null); },
    onError: (e) => alert(`Error: ${e.message}`),
  });

  const filterButtons: { key: FilterStatus; label: string }[] = [
    { key: "all", label: "ALL" },
    { key: "pending", label: "PENDING" },
    { key: "approved", label: "APPROVED" },
    { key: "rejected", label: "REJECTED" },
    { key: "needs_info", label: "NEEDS INFO" },
  ];

  return (
    <div style={{ color: "#e5e7eb", fontFamily: "monospace" }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Vetting Applications</h2>
        <p style={{ color: "#9ca3af", margin: "4px 0 0", fontSize: 13 }}>
          {stats?.total ?? 0} total · {stats?.pending ?? 0} pending · {stats?.needs_info ?? 0} needs info
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {filterButtons.map((btn) => (
          <button key={btn.key} onClick={() => setFilter(btn.key)}
            style={{ padding: "6px 14px", border: "1px solid", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "monospace",
              background: filter === btn.key ? "#f59e0b" : "transparent",
              color: filter === btn.key ? "#000" : "#9ca3af",
              borderColor: filter === btn.key ? "#f59e0b" : "#374151" }}>
            {btn.label}
          </button>
        ))}
      </div>

      {/* Score Bands Legend */}
      <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 6, padding: "10px 16px", marginBottom: 20, display: "flex", gap: 24, flexWrap: "wrap", fontSize: 12 }}>
        <span style={{ color: "#6b7280", fontWeight: 600 }}>AI SCORE BANDS:</span>
        {SCORE_BANDS.map((b) => (
          <span key={b.label} style={{ color: b.color }}>● {b.min}–{b.max} {b.label}</span>
        ))}
      </div>

      {/* Application List */}
      {!applications || applications.length === 0 ? (
        <div style={{ textAlign: "center", color: "#6b7280", padding: 40 }}>No applications found.</div>
      ) : (
        applications.map((app: any) => {
          const score = app.aiScore ?? null;
          const band = score !== null ? getScoreBand(score) : null;
          const isExpanded = expandedId === app.id;
          const statusColors: Record<string, string> = { pending: "#f59e0b", approved: "#22c55e", rejected: "#ef4444", needs_info: "#a78bfa" };
          const statusColor = statusColors[app.status] ?? "#6b7280";

          return (
            <div key={app.id} style={{ background: "#111827", border: `1px solid ${app.status === "rejected" ? "#7f1d1d" : "#1f2937"}`, borderRadius: 8, marginBottom: 12, overflow: "hidden" }}>
              {/* Application Header Row */}
              <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }} onClick={() => setExpandedId(isExpanded ? null : app.id)}>
                {/* Score Circle */}
                {score !== null ? (
                  <div style={{ width: 52, height: 52, borderRadius: "50%", border: `3px solid ${band?.color}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: band?.color, lineHeight: 1 }}>{score}</span>
                    <span style={{ fontSize: 9, color: "#6b7280" }}>/100</span>
                  </div>
                ) : (
                  <div style={{ width: 52, height: 52, borderRadius: "50%", border: "3px solid #374151", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 10, color: "#6b7280" }}>N/A</span>
                  </div>
                )}

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{app.fullName}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>{app.email} · {app.organization ?? "—"} · {app.role ?? "—"}</div>
                  {app.aiRationale && <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 500 }}>{app.aiRationale}</div>}
                </div>

                {/* Status + Date */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <span style={{ background: statusColor + "22", color: statusColor, border: `1px solid ${statusColor}`, borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>
                    {app.status.toUpperCase().replace("_", " ")}
                  </span>
                  {band && (
                    <div style={{ marginTop: 4 }}>
                      <span style={{ background: band.color + "22", color: band.color, border: `1px solid ${band.color}`, borderRadius: 4, padding: "2px 6px", fontSize: 10 }}>
                        AI: {score >= 75 ? "APPROVE" : score >= 40 ? "REVIEW" : "DENY"}
                      </span>
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>{new Date(app.createdAt).toLocaleDateString()}</div>
                </div>
                <span style={{ color: "#6b7280", fontSize: 16 }}>{isExpanded ? "▲" : "▼"}</span>
              </div>

              {/* Expanded Detail */}
              {isExpanded && (
                <div style={{ borderTop: "1px solid #1f2937", padding: "16px 18px" }}>
                  {/* Score Breakdown */}
                  {app.scoreBreakdown && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", marginBottom: 10, letterSpacing: 1 }}>SCORE BREAKDOWN</div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
                        {Object.entries(app.scoreBreakdown as Record<string, { score: number; max: number }>).map(([key, val]) => (
                          <div key={key}>
                            <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1 }}>{key}</div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: "#f59e0b" }}>{val.score}<span style={{ fontSize: 11, color: "#6b7280" }}>/{val.max}</span></div>
                            <div style={{ height: 3, background: "#1f2937", borderRadius: 2, marginTop: 4 }}>
                              <div style={{ height: "100%", background: "#f59e0b", borderRadius: 2, width: `${(val.score / val.max) * 100}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reason + Intended Use */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                    <div style={{ background: "#0f172a", border: "1px solid #1f2937", borderRadius: 6, padding: 12 }}>
                      <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 700, marginBottom: 6, letterSpacing: 1 }}>REASON FOR ACCESS</div>
                      <div style={{ fontSize: 13 }}>{app.reasonForAccess}</div>
                    </div>
                    <div style={{ background: "#0f172a", border: "1px solid #1f2937", borderRadius: 6, padding: 12 }}>
                      <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 700, marginBottom: 6, letterSpacing: 1 }}>INTENDED USE</div>
                      <div style={{ fontSize: 13 }}>{app.intendedUse}</div>
                    </div>
                  </div>

                  {/* AI Rationale */}
                  {app.aiRationale && (
                    <div style={{ background: "#0f172a", border: "1px solid #1f2937", borderRadius: 6, padding: 12, marginBottom: 12 }}>
                      <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 700, marginBottom: 6, letterSpacing: 1 }}>AI RATIONALE</div>
                      <div style={{ fontSize: 13, color: "#d1d5db", fontStyle: "italic" }}>{app.aiRationale}</div>
                    </div>
                  )}

                  {/* Review Notes (if already reviewed) */}
                  {app.reviewNotes && (
                    <div style={{ background: "#0f172a", border: "1px solid #374151", borderRadius: 6, padding: 12, marginBottom: 12 }}>
                      <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 700, marginBottom: 6, letterSpacing: 1 }}>REVIEW NOTES</div>
                      <div style={{ fontSize: 13 }}>{app.reviewNotes}</div>
                      {app.reviewedAt && <div style={{ fontSize: 11, color: "#6b7280", marginTop: 6 }}>Reviewed on {new Date(app.reviewedAt).toLocaleString()}</div>}
                    </div>
                  )}

                  {/* Decision recorded */}
                  {app.status !== "pending" && app.status !== "needs_info" && (
                    <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>
                      Decision recorded: {app.status === "approved" ? "✓ Approved" : "✗ Denied"}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {(app.status === "pending" || app.status === "needs_info") && (
                      <>
                        <button onClick={() => { setApproveModal({ id: app.id, name: app.fullName }); setApproveNotes(""); setApproveRole("observer"); }}
                          style={{ flex: 1, minWidth: 120, padding: "10px 16px", background: "#166534", border: "1px solid #22c55e", color: "#22c55e", borderRadius: 6, cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "monospace" }}>
                          ✓ APPROVE
                        </button>
                        <button onClick={() => { setInfoModal({ id: app.id, name: app.fullName }); setInfoMessage(""); }}
                          style={{ flex: 1, minWidth: 120, padding: "10px 16px", background: "#312e81", border: "1px solid #a78bfa", color: "#a78bfa", borderRadius: 6, cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "monospace" }}>
                          ? REQUEST INFO
                        </button>
                        <button onClick={() => { setRejectModal({ id: app.id, name: app.fullName }); setRejectNotes(""); }}
                          style={{ flex: 1, minWidth: 120, padding: "10px 16px", background: "#7f1d1d", border: "1px solid #ef4444", color: "#ef4444", borderRadius: 6, cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "monospace" }}>
                          ✗ REJECT
                        </button>
                      </>
                    )}
                    <button onClick={() => setDeleteModal({ id: app.id, name: app.fullName })}
                      style={{ padding: "10px 16px", background: "transparent", border: "1px solid #374151", color: "#6b7280", borderRadius: 6, cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "monospace" }}>
                      🗑 DELETE
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}

      {/* ── APPROVE MODAL ── */}
      {approveModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
          <div style={{ background: "#111827", border: "1px solid #22c55e", borderRadius: 10, padding: 28, width: "100%", maxWidth: 500 }}>
            <h3 style={{ margin: "0 0 6px", color: "#22c55e", fontSize: 18 }}>✓ Approve Application</h3>
            <p style={{ color: "#9ca3af", fontSize: 13, margin: "0 0 20px" }}>Approving: <strong style={{ color: "#e5e7eb" }}>{approveModal.name}</strong></p>

            <label style={{ display: "block", fontSize: 12, color: "#9ca3af", marginBottom: 6, fontWeight: 600 }}>ASSIGN ROLE</label>
            <select value={approveRole} onChange={(e) => setApproveRole(e.target.value as Role)}
              style={{ width: "100%", padding: "10px 12px", background: "#0f172a", border: "1px solid #374151", color: "#e5e7eb", borderRadius: 6, marginBottom: 16, fontSize: 13, fontFamily: "monospace" }}>
              {(Object.entries(ROLE_LABELS) as [Role, string][]).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>

            <label style={{ display: "block", fontSize: 12, color: "#9ca3af", marginBottom: 6, fontWeight: 600 }}>REVIEW NOTES (included in approval email)</label>
            <textarea value={approveNotes} onChange={(e) => setApproveNotes(e.target.value)} rows={4} placeholder="e.g. Strong journalistic credentials, clear research purpose, verified organization..."
              style={{ width: "100%", padding: "10px 12px", background: "#0f172a", border: "1px solid #374151", color: "#e5e7eb", borderRadius: 6, marginBottom: 20, fontSize: 13, fontFamily: "monospace", resize: "vertical", boxSizing: "border-box" }} />

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { if (!approveNotes.trim()) { alert("Please add review notes."); return; } approveMutation.mutate({ applicationId: approveModal.id, reviewNotes: approveNotes, assignedRole: approveRole }); }}
                disabled={approveMutation.isLoading}
                style={{ flex: 1, padding: "10px 0", background: "#166534", border: "1px solid #22c55e", color: "#22c55e", borderRadius: 6, cursor: "pointer", fontWeight: 700, fontSize: 14, fontFamily: "monospace" }}>
                {approveMutation.isLoading ? "Approving..." : "Confirm Approval + Send Email"}
              </button>
              <button onClick={() => setApproveModal(null)}
                style={{ padding: "10px 20px", background: "transparent", border: "1px solid #374151", color: "#9ca3af", borderRadius: 6, cursor: "pointer", fontFamily: "monospace" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── REQUEST MORE INFO MODAL ── */}
      {infoModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
          <div style={{ background: "#111827", border: "1px solid #a78bfa", borderRadius: 10, padding: 28, width: "100%", maxWidth: 500 }}>
            <h3 style={{ margin: "0 0 6px", color: "#a78bfa", fontSize: 18 }}>? Request More Information</h3>
            <p style={{ color: "#9ca3af", fontSize: 13, margin: "0 0 20px" }}>From: <strong style={{ color: "#e5e7eb" }}>{infoModal.name}</strong></p>

            <label style={{ display: "block", fontSize: 12, color: "#9ca3af", marginBottom: 6, fontWeight: 600 }}>WHAT INFORMATION IS NEEDED? (sent directly to applicant)</label>
            <textarea value={infoMessage} onChange={(e) => setInfoMessage(e.target.value)} rows={5}
              placeholder="e.g. Please provide: 1) A verifiable link to your published work, 2) Your organization's official website, 3) A more specific description of how you will use the data..."
              style={{ width: "100%", padding: "10px 12px", background: "#0f172a", border: "1px solid #374151", color: "#e5e7eb", borderRadius: 6, marginBottom: 20, fontSize: 13, fontFamily: "monospace", resize: "vertical", boxSizing: "border-box" }} />

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { if (!infoMessage.trim() || infoMessage.length < 10) { alert("Please provide a detailed message."); return; } infoMutation.mutate({ applicationId: infoModal.id, infoMessage }); }}
                disabled={infoMutation.isLoading}
                style={{ flex: 1, padding: "10px 0", background: "#312e81", border: "1px solid #a78bfa", color: "#a78bfa", borderRadius: 6, cursor: "pointer", fontWeight: 700, fontSize: 14, fontFamily: "monospace" }}>
                {infoMutation.isLoading ? "Sending..." : "Send Request to Applicant"}
              </button>
              <button onClick={() => setInfoModal(null)}
                style={{ padding: "10px 20px", background: "transparent", border: "1px solid #374151", color: "#9ca3af", borderRadius: 6, cursor: "pointer", fontFamily: "monospace" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── REJECT MODAL ── */}
      {rejectModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
          <div style={{ background: "#111827", border: "1px solid #ef4444", borderRadius: 10, padding: 28, width: "100%", maxWidth: 500 }}>
            <h3 style={{ margin: "0 0 6px", color: "#ef4444", fontSize: 18 }}>✗ Reject Application</h3>
            <p style={{ color: "#9ca3af", fontSize: 13, margin: "0 0 20px" }}>Rejecting: <strong style={{ color: "#e5e7eb" }}>{rejectModal.name}</strong></p>

            <label style={{ display: "block", fontSize: 12, color: "#9ca3af", marginBottom: 6, fontWeight: 600 }}>REJECTION REASON (included in rejection email)</label>
            <textarea value={rejectNotes} onChange={(e) => setRejectNotes(e.target.value)} rows={4}
              placeholder="e.g. Unable to verify organizational affiliation. Stated purpose is too vague for access to sensitive case files..."
              style={{ width: "100%", padding: "10px 12px", background: "#0f172a", border: "1px solid #374151", color: "#e5e7eb", borderRadius: 6, marginBottom: 20, fontSize: 13, fontFamily: "monospace", resize: "vertical", boxSizing: "border-box" }} />

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { if (!rejectNotes.trim()) { alert("Please add rejection reason."); return; } rejectMutation.mutate({ applicationId: rejectModal.id, reviewNotes: rejectNotes }); }}
                disabled={rejectMutation.isLoading}
                style={{ flex: 1, padding: "10px 0", background: "#7f1d1d", border: "1px solid #ef4444", color: "#ef4444", borderRadius: 6, cursor: "pointer", fontWeight: 700, fontSize: 14, fontFamily: "monospace" }}>
                {rejectMutation.isLoading ? "Rejecting..." : "Confirm Rejection + Send Email"}
              </button>
              <button onClick={() => setRejectModal(null)}
                style={{ padding: "10px 20px", background: "transparent", border: "1px solid #374151", color: "#9ca3af", borderRadius: 6, cursor: "pointer", fontFamily: "monospace" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE MODAL ── */}
      {deleteModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
          <div style={{ background: "#111827", border: "1px solid #374151", borderRadius: 10, padding: 28, width: "100%", maxWidth: 420 }}>
            <h3 style={{ margin: "0 0 6px", color: "#e5e7eb", fontSize: 18 }}>🗑 Delete Application</h3>
            <p style={{ color: "#9ca3af", fontSize: 13, margin: "0 0 20px" }}>
              Permanently delete the application from <strong style={{ color: "#e5e7eb" }}>{deleteModal.name}</strong>? This cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => deleteMutation.mutate({ applicationId: deleteModal.id })}
                disabled={deleteMutation.isLoading}
                style={{ flex: 1, padding: "10px 0", background: "#1f2937", border: "1px solid #ef4444", color: "#ef4444", borderRadius: 6, cursor: "pointer", fontWeight: 700, fontSize: 14, fontFamily: "monospace" }}>
                {deleteMutation.isLoading ? "Deleting..." : "Yes, Delete Permanently"}
              </button>
              <button onClick={() => setDeleteModal(null)}
                style={{ padding: "10px 20px", background: "transparent", border: "1px solid #374151", color: "#9ca3af", borderRadius: 6, cursor: "pointer", fontFamily: "monospace" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
