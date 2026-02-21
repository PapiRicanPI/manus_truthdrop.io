import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>TruthDrop – The Vault Investigates</title>
        <meta
          name="description"
          content="Secure tip and feedback system documenting case files on poverty grifters and the aid industry."
        />
        <meta property="og:title" content="TruthDrop – The Vault Investigates" />
        <meta
          property="og:description"
          content="Secure tip and feedback system documenting case files on poverty grifters and the aid industry."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://truthdrop.io" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TruthDrop – The Vault Investigates" />
        <meta
          name="twitter:description"
          content="Secure tip and feedback system documenting case files on poverty grifters and the aid industry."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #0d0f14;
          color: #e2e8f0;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          line-height: 1.6;
          min-height: 100vh;
        }

        a { color: #4F7FFF; text-decoration: none; }
        a:hover { text-decoration: underline; }

        .page {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 2rem;
          border-bottom: 1px solid #1e2330;
          background: #0d0f14;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-weight: 700;
          font-size: 1.1rem;
          color: #e2e8f0;
          letter-spacing: 0.02em;
        }

        .nav-brand .shield {
          width: 28px;
          height: 28px;
          background: #4F7FFF;
          clip-path: polygon(50% 0%, 100% 15%, 100% 60%, 50% 100%, 0% 60%, 0% 15%);
          flex-shrink: 0;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          font-size: 0.9rem;
        }

        .nav-links a { color: #94a3b8; }
        .nav-links a:hover { color: #e2e8f0; text-decoration: none; }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 1.1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.1s;
          border: none;
          text-decoration: none !important;
        }
        .btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .btn-primary { background: #4F7FFF; color: #fff; }
        .btn-outline { background: transparent; color: #4F7FFF; border: 1.5px solid #4F7FFF; }
        .btn-lg { padding: 0.75rem 1.6rem; font-size: 1rem; }

        .hero {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 5rem 1.5rem 4rem;
          max-width: 760px;
          margin: 0 auto;
          width: 100%;
        }

        .hero-badge {
          display: inline-block;
          background: rgba(79,127,255,0.12);
          color: #4F7FFF;
          border: 1px solid rgba(79,127,255,0.3);
          border-radius: 999px;
          padding: 0.3rem 0.9rem;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
        }

        .hero h1 {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 800;
          line-height: 1.15;
          color: #f1f5f9;
          margin-bottom: 1.25rem;
          letter-spacing: -0.02em;
        }

        .hero h1 span { color: #4F7FFF; }

        .hero p {
          font-size: 1.1rem;
          color: #94a3b8;
          max-width: 580px;
          margin: 0 auto 2.5rem;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .divider {
          width: 100%;
          max-width: 860px;
          margin: 0 auto;
          border: none;
          border-top: 1px solid #1e2330;
        }

        .section {
          padding: 4rem 1.5rem;
          max-width: 860px;
          margin: 0 auto;
          width: 100%;
        }

        .section-label {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #4F7FFF;
          margin-bottom: 0.6rem;
        }

        .section h2 {
          font-size: clamp(1.4rem, 3vw, 1.9rem);
          font-weight: 700;
          color: #f1f5f9;
          margin-bottom: 1rem;
        }

        .section p {
          color: #94a3b8;
          font-size: 1rem;
          max-width: 640px;
        }

        .cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.25rem;
          margin-top: 2.5rem;
        }

        .card {
          background: #131720;
          border: 1px solid #1e2330;
          border-radius: 10px;
          padding: 1.5rem;
        }

        .card-icon {
          width: 38px;
          height: 38px;
          background: rgba(79,127,255,0.12);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          font-size: 1.2rem;
        }

        .card h3 {
          font-size: 0.95rem;
          font-weight: 700;
          color: #e2e8f0;
          margin-bottom: 0.4rem;
        }

        .card p {
          font-size: 0.875rem;
          color: #64748b;
          line-height: 1.5;
        }

        .steps {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .step {
          display: flex;
          gap: 1.25rem;
          align-items: flex-start;
        }

        .step-num {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(79,127,255,0.15);
          border: 1.5px solid rgba(79,127,255,0.4);
          color: #4F7FFF;
          font-size: 0.8rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .step-body h3 {
          font-size: 0.95rem;
          font-weight: 700;
          color: #e2e8f0;
          margin-bottom: 0.25rem;
        }

        .step-body p {
          font-size: 0.875rem;
          color: #64748b;
        }

        .cta-banner {
          background: linear-gradient(135deg, #131a2e 0%, #0d1220 100%);
          border: 1px solid rgba(79,127,255,0.2);
          border-radius: 12px;
          padding: 2.5rem 2rem;
          text-align: center;
          margin: 2rem auto 4rem;
          max-width: 860px;
          width: calc(100% - 3rem);
        }

        .cta-banner h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #f1f5f9;
          margin-bottom: 0.75rem;
        }

        .cta-banner p {
          color: #94a3b8;
          font-size: 0.95rem;
          margin-bottom: 1.75rem;
          max-width: 520px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        footer {
          border-top: 1px solid #1e2330;
          padding: 1.5rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
          font-size: 0.8rem;
          color: #475569;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #64748b;
        }

        .footer-shield {
          width: 16px;
          height: 16px;
          background: #4F7FFF;
          clip-path: polygon(50% 0%, 100% 15%, 100% 60%, 50% 100%, 0% 60%, 0% 15%);
          opacity: 0.7;
        }

        .footer-links {
          display: flex;
          gap: 1.25rem;
        }

        .footer-links a { color: #475569; }
        .footer-links a:hover { color: #94a3b8; text-decoration: none; }

        @media (max-width: 600px) {
          nav { padding: 0.75rem 1rem; }
          .nav-links { gap: 0.75rem; }
          footer { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="page">
        <nav>
          <div className="nav-brand">
            <div className="shield" aria-hidden="true" />
            TruthDrop
          </div>
          <div className="nav-links">
            <a href="https://vault.povertypimpslayerthevault.io/gate.html">The Vault</a>
            <a href="https://vault.povertypimpslayerthevault.io/home.html">Evidence Drop</a>
            <a href="https://vet.thevault.watch/" className="btn btn-primary">
              Apply for Access
            </a>
          </div>
        </nav>

        <section className="hero">
          <div className="hero-badge">Investigative Research Platform</div>
          <h1>
            Follow the money.<br />
            <span>Expose the grift.</span>
          </h1>
          <p>
            TruthDrop is a vetted investigative platform documenting case files on poverty
            grifters and the aid industry — across the Philippines, Puerto Rico, and the
            United States.
          </p>
          <div className="hero-actions">
            <a
              href="https://vault.povertypimpslayerthevault.io/home.html"
              className="btn btn-primary btn-lg"
            >
              Submit a Tip
            </a>
            <a
              href="https://vault.povertypimpslayerthevault.io/gate.html"
              className="btn btn-outline btn-lg"
            >
              Enter The Vault
            </a>
          </div>
        </section>

        <hr className="divider" />

        <section className="section">
          <div className="section-label">What is TruthDrop</div>
          <h2>An independent archive of accountability</h2>
          <p>
            TruthDrop is built for journalists, researchers, archivists, and community members
            who follow government spending, disaster aid, and nonprofit abuse. It is independent,
            non-partisan, and funded by no NGO or corporate money.
          </p>
          <div className="cards">
            <div className="card">
              <div className="card-icon">🗄️</div>
              <h3>Case Files</h3>
              <p>
                Structured case files on poverty scams, aid fraud, and nonprofit misconduct —
                cross-referenced with public records.
              </p>
            </div>
            <div className="card">
              <div className="card-icon">🔒</div>
              <h3>Secure Intake</h3>
              <p>
                Anonymous tip submission with end-to-end encryption. No names required.
                Your safety comes first.
              </p>
            </div>
            <div className="card">
              <div className="card-icon">🌐</div>
              <h3>Three Regions</h3>
              <p>
                Focused on the Philippines, Puerto Rico, and the United States — where
                disaster aid and poverty programs are most vulnerable to capture.
              </p>
            </div>
            <div className="card">
              <div className="card-icon">🧪</div>
              <h3>Vetted Access</h3>
              <p>
                Internal tools and case workspaces are restricted to vetted researchers.
                All access is reviewed for safety and fit.
              </p>
            </div>
          </div>
        </section>

        <hr className="divider" />

        <section className="section">
          <div className="section-label">How It Works</div>
          <h2>From tip to case file</h2>
          <div className="steps">
            <div className="step">
              <div className="step-num">1</div>
              <div className="step-body">
                <h3>Submit a tip or document</h3>
                <p>
                  Anyone can submit a confidential tip through the public Evidence Drop page.
                  No account required. Remove personal details before submitting if you need
                  to stay anonymous.
                </p>
              </div>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <div className="step-body">
                <h3>Vetted researchers review and cross-reference</h3>
                <p>
                  Approved researchers access the internal TruthDrop workspace to review tips,
                  link evidence to case files, and cross-check with public procurement and
                  award data.
                </p>
              </div>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <div className="step-body">
                <h3>Case files are published to The Vault</h3>
                <p>
                  Verified case files are published to The Vault — a public archive of
                  documented poverty scams, searchable by region, program, and actor.
                </p>
              </div>
            </div>
            <div className="step">
              <div className="step-num">4</div>
              <div className="step-body">
                <h3>Apply for investigative access</h3>
                <p>
                  Journalists, researchers, and community investigators can apply for vetted
                  access to the internal workspace. All applications are reviewed manually.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="cta-banner">
          <h2>Ready to contribute?</h2>
          <p>
            Submit a tip anonymously, explore The Vault's public case files, or apply for
            vetted investigative access.
          </p>
          <div className="cta-actions">
            <a
              href="https://vault.povertypimpslayerthevault.io/home.html"
              className="btn btn-primary btn-lg"
            >
              Submit a Tip
            </a>
            <a
              href="https://vault.povertypimpslayerthevault.io/resources.html"
              className="btn btn-outline btn-lg"
            >
              Investigator Resources
            </a>
            <a
              href="https://vet.thevault.watch/"
              className="btn btn-outline btn-lg"
            >
              Apply for Access
            </a>
          </div>
        </div>

        <footer>
          <div className="footer-brand">
            <div className="footer-shield" aria-hidden="true" />
            © 2026 TruthDrop.io – Investigative Research Platform
          </div>
          <div className="footer-links">
            <a href="https://vault.povertypimpslayerthevault.io/gate.html">The Vault</a>
            <a href="https://vault.povertypimpslayerthevault.io/home.html">Evidence Drop</a>
            <a href="https://vault.povertypimpslayerthevault.io/resources.html">Resources</a>
            <a href="https://vet.thevault.watch/">Apply</a>
          </div>
        </footer>
      </div>
    </>
  );
}
