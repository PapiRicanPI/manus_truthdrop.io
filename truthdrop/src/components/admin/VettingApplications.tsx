import { useState } from "react";
import { api } from "~/utils/api";

export default function VettingApplications() {
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Fetch applications
  const { data: applications, refetch } = api.vetting.getApplications.useQuery({
    status: filter,
  });

  // Fetch stats
  const { data: stats } = api.vetting.getStats.useQuery();

  // Mutations
  const approveMutation = api.vetting.approveApplication.useMutation({
    onSuccess: () => {
      refetch();
      setProcessingId(null);
      alert("Application approved successfully! Email sent to applicant.");
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
      setProcessingId(null);
    },
  });

  const rejectMutation = api.vetting.rejectApplication.useMutation({
    onSuccess: () => {
      refetch();
      setProcessingId(null);
      alert("Application rejected. Email sent to applicant.");
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
      setProcessingId(null);
    },
  });

  const handleApprove = (applicationId: string) => {
    const notes = reviewNotes[applicationId];
    if (!notes || notes.trim().length === 0) {
      alert("Please enter review notes before approving.");
      return;
    }

    if (confirm("Are you sure you want to approve this application?")) {
      setProcessingId(applicationId);
      approveMutation.mutate({
        applicationId,
        reviewNotes: notes,
      });
    }
  };

  const handleReject = (applicationId: string) => {
    const notes = reviewNotes[applicationId];
    if (!notes || notes.trim().length === 0) {
      alert("Please enter review notes before rejecting.");
      return;
    }

    if (confirm("Are you sure you want to reject this application?")) {
      setProcessingId(applicationId);
      rejectMutation.mutate({
        applicationId,
        reviewNotes: notes,
      });
    }
  };

  const updateReviewNotes = (applicationId: string, notes: string) => {
    setReviewNotes((prev) => ({
      ...prev,
      [applicationId]: notes,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Vetting Applications</h1>
        <p className="text-gray-400 mb-8">
          Review and approve/reject user access applications
        </p>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-gray-400 text-sm mb-2">Total Applications</h3>
            <p className="text-3xl font-bold">{stats?.total || 0}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-orange-500">
            <h3 className="text-gray-400 text-sm mb-2">Pending Review</h3>
            <p className="text-3xl font-bold text-orange-500">
              {stats?.pending || 0}
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-green-500">
            <h3 className="text-gray-400 text-sm mb-2">Approved</h3>
            <p className="text-3xl font-bold text-green-500">
              {stats?.approved || 0}
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-red-500">
            <h3 className="text-gray-400 text-sm mb-2">Rejected</h3>
            <p className="text-3xl font-bold text-red-500">
              {stats?.rejected || 0}
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded ${
              filter === "all"
                ? "bg-orange-500 text-black"
                : "bg-gray-800 text-white"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded ${
              filter === "pending"
                ? "bg-orange-500 text-black"
                : "bg-gray-800 text-white"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-4 py-2 rounded ${
              filter === "approved"
                ? "bg-orange-500 text-black"
                : "bg-gray-800 text-white"
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter("rejected")}
            className={`px-4 py-2 rounded ${
              filter === "rejected"
                ? "bg-orange-500 text-black"
                : "bg-gray-800 text-white"
            }`}
          >
            Rejected
          </button>
        </div>

        {/* Applications List */}
        <div className="space-y-6">
          {applications?.map((app) => (
            <div
              key={app.id}
              className="bg-gray-800 p-6 rounded-lg border border-gray-700"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    {app.fullName}
                    {app.status === "approved" && (
                      <span className="text-xs bg-green-500 text-black px-2 py-1 rounded">
                        Approved
                      </span>
                    )}
                    {app.status === "rejected" && (
                      <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">
                        Rejected
                      </span>
                    )}
                    {app.status === "pending" && (
                      <span className="text-xs bg-orange-500 text-black px-2 py-1 rounded">
                        Pending
                      </span>
                    )}
                  </h3>
                  <p className="text-gray-400">
                    <strong>Email:</strong> {app.email}
                  </p>
                  {app.organization && (
                    <p className="text-gray-400">
                      <strong>Organization:</strong> {app.organization}
                    </p>
                  )}
                  {app.role && (
                    <p className="text-gray-400">
                      <strong>Role:</strong> {app.role}
                    </p>
                  )}
                  <p className="text-gray-400">
                    <strong>Applied:</strong>{" "}
                    {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-bold mb-2">Reason for Access:</h4>
                <p className="text-gray-300">{app.reasonForAccess}</p>
              </div>

              <div className="mb-4">
                <h4 className="font-bold mb-2">Intended Use:</h4>
                <p className="text-gray-300">{app.intendedUse}</p>
              </div>

              {app.status !== "pending" && (
                <div className="mb-4 bg-gray-900 p-4 rounded">
                  <h4 className="font-bold mb-2">Review Notes:</h4>
                  <p className="text-gray-300">{app.reviewNotes}</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Reviewed on {new Date(app.reviewedAt!).toLocaleString()}
                  </p>
                </div>
              )}

              {app.status === "approved" && app.generatedPassword && (
                <div className="mb-4 bg-green-900 p-4 rounded border border-green-500">
                  <h4 className="font-bold mb-2">Generated Password:</h4>
                  <code className="text-lg font-mono bg-black p-2 rounded block">
                    {app.generatedPassword}
                  </code>
                </div>
              )}

              {app.status === "pending" && (
                <div className="border-t border-gray-700 pt-4 mt-4">
                  <h4 className="font-bold mb-2">Review Notes:</h4>
                  <textarea
                    value={reviewNotes[app.id] || ""}
                    onChange={(e) => updateReviewNotes(app.id, e.target.value)}
                    placeholder="Enter your review notes here (required)..."
                    className="w-full bg-gray-900 text-white p-3 rounded border border-gray-600 mb-4"
                    rows={3}
                  />

                  <div className="flex gap-4">
                    <button
                      onClick={() => handleApprove(app.id)}
                      disabled={processingId === app.id}
                      className="bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded font-bold disabled:opacity-50"
                    >
                      {processingId === app.id ? "Processing..." : "✓ Approve"}
                    </button>
                    <button
                      onClick={() => handleReject(app.id)}
                      disabled={processingId === app.id}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded font-bold disabled:opacity-50"
                    >
                      {processingId === app.id ? "Processing..." : "✗ Reject"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {applications?.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              No applications found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
