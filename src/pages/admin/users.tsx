import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

export default function UsersPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    fetch("/api/admin/session").then(r => r.json()).then(d => {
      if (d.isAdmin) setAuthChecked(true); else router.replace("/admin/login");
    }).catch(() => router.replace("/admin/login"));
  }, [router]);

  if (!authChecked) return <div style={{ background: "#0a0a0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontFamily: "system-ui" }}>Checking access…</div>;

  return (
    <>
      <Head><title>User Management — TruthDrop Admin</title></Head>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } body { background: #0a0a0f; color: #e2e8f0; font-family: system-ui; } .wrap { max-width: 900px; margin: 0 auto; padding: 2rem; } .back { color: #64748b; text-decoration: none; font-size: 0.875rem; display: inline-flex; align-items: center; gap: 0.4rem; margin-bottom: 1.5rem; } .back:hover { color: #94a3b8; } h1 { font-size: 1.5rem; font-weight: 700; color: #f1f5f9; margin-bottom: 0.5rem; } table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; } th { text-align: left; font-size: 0.75rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; padding: 0.75rem 1rem; border-bottom: 1px solid #1e293b; } td { padding: 0.9rem 1rem; border-bottom: 1px solid #0f172a; font-size: 0.9rem; } tr:hover td { background: #12121a; } .badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; } .badge-admin { background: #3b0000; color: #fc8181; } .badge-researcher { background: #0a1628; color: #63b3ed; } .badge-custodian { background: #0a1a0a; color: #68d391; }`}</style>
      <div className="wrap">
        <Link href="/admin" className="back">← Back to Dashboard</Link>
        <h1>👥 User Management</h1>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Papi Rican Blue</td>
              <td>tainorican2n@gmail.com</td>
              <td><span className="badge badge-admin">Admin</span></td>
              <td>Dec 1, 2025</td>
            </tr>
            <tr>
              <td>Test Admin</td>
              <td>—</td>
              <td><span className="badge badge-researcher">Researcher</span></td>
              <td>Dec 9, 2025</td>
            </tr>
            <tr>
              <td>Jerry B. Marchant</td>
              <td>—</td>
              <td><span className="badge badge-custodian">Custodian</span></td>
              <td>Dec 14, 2025</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
