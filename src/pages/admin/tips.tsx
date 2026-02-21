import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

export default function TipsPage() {
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
      <Head><title>Tips — TruthDrop Admin</title></Head>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } body { background: #0a0a0f; color: #e2e8f0; font-family: system-ui; } .wrap { max-width: 900px; margin: 0 auto; padding: 2rem; } .back { color: #64748b; text-decoration: none; font-size: 0.875rem; display: inline-flex; align-items: center; gap: 0.4rem; margin-bottom: 1.5rem; } .back:hover { color: #94a3b8; } h1 { font-size: 1.5rem; font-weight: 700; color: #f1f5f9; margin-bottom: 0.5rem; } .note { background: #12121a; border: 1px solid #1e293b; border-radius: 10px; padding: 1.5rem; color: #64748b; font-size: 0.9rem; line-height: 1.6; margin-top: 1.5rem; }`}</style>
      <div className="wrap">
        <Link href="/admin" className="back">← Back to Dashboard</Link>
        <h1>📥 Tips</h1>
        <div className="note">
          <p>Tip intake is handled via the public Evidence Drop page at <strong>vault.povertypimpslayerthevault.io/home.html</strong>.</p>
          <p style={{ marginTop: "1rem" }}>Full tip review interface (with redaction, case linking, and status tracking) will be available in the next update.</p>
        </div>
      </div>
    </>
  );
}
