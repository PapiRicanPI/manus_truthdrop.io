import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

const COUNTDOWN_SECONDS = 7;
const REDIRECT_PATH = "https://truthdrop-5buxndbh.manus.space/tips";

export default function SplashPage() {
  const router = useRouter();
  const [count, setCount] = useState(COUNTDOWN_SECONDS);
  const [cancelled, setCancelled] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          if (!cancelled) { window.location.href = REDIRECT_PATH; }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cancel = () => {
    setCancelled(true);
    clearInterval(intervalRef.current!);
  };

  return (
    <>
      <Head>
        <title>TruthDrop – The Vault Investigates</title>
        <meta name="description" content="An independent archive documenting how resources are misused — across the United States, Puerto Rico, and the Philippines." />
        <meta property="og:title" content="TruthDrop – The Vault Investigates" />
        <meta property="og:description" content="An independent archive documenting how resources are misused — across the United States, Puerto Rico, and the Philippines." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://truthdrop.io" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@PovertyVault" />
        <meta name="twitter:title" content="TruthDrop – The Vault Investigates" />
        <meta name="twitter:description" content="An independent archive documenting how resources are misused." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Courier+Prime:wght@400;700&display=swap" rel="stylesheet" />
        {/* Privacy-friendly analytics by Plausible */}
        <script async src="https://plausible.io/js/pa-c9DR3lWAwJko8umb5bm2C.js"></script>
        <script dangerouslySetInnerHTML={{ __html: `window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()` }}></script>
        <link rel="canonical" href="https://truthdrop.io/" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "TruthDrop – The Vault Investigates",
            "url": "https://truthdrop.io",
            "description": "Independent investigative archive documenting how resources are misused across the United States, Puerto Rico, and the Philippines.",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://thevaultinvestigates.cloud/?s={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "NewsMediaOrganization",
            "name": "The Vault Investigates",
            "alternateName": "TruthDrop.io",
            "url": "https://truthdrop.io",
            "description": "Independent investigative archive tracking how resources are misused in the US, Puerto Rico, and the Philippines.",
            "foundingDate": "2024",
            "founder": { "@type": "Person", "name": "TheVaultArchivist" },
            "publishingPrinciples": "https://thevaultinvestigates.cloud/about",
            "sameAs": [
              "https://x.com/PovertyVault",
              "https://thevaultinvestigates.cloud",
              "https://www.facebook.com/vaultarchivist",
              "https://www.instagram.com/povertyvault"
            ]
          }
        ])}} />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #070707;
          --gold: #c8973a;
          --gold-dim: rgba(200,151,58,0.15);
          --white: #f5f5f0;
          --grey: #8a8a8a;
          --ticker-h: 36px;
        }

        html, body {
          width: 100%; height: 100%;
          background: var(--bg);
          color: var(--white);
          font-family: 'Courier Prime', 'Courier New', monospace;
          overflow-x: hidden;
        }

        /* Grain overlay */
        body::before {
          content: '';
          position: fixed; inset: 0; z-index: 0;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.055'/%3E%3C/svg%3E");
          background-repeat: repeat;
          opacity: 0.6;
        }

        /* Ticker */
        .ticker-wrap {
          position: fixed; top: 0; left: 0; right: 0;
          height: var(--ticker-h);
          background: #0d0d0d;
          border-bottom: 1px solid rgba(200,151,58,0.22);
          overflow: hidden;
          z-index: 100;
          display: flex; align-items: center;
        }
        .ticker-label {
          flex-shrink: 0;
          padding: 0 14px;
          font-family: 'Courier Prime', monospace;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--gold);
          border-right: 1px solid rgba(200,151,58,0.28);
          white-space: nowrap;
        }
        .ticker-track { flex: 1; overflow: hidden; }
        .ticker-inner {
          display: inline-flex;
          white-space: nowrap;
          animation: ticker-scroll 24s linear infinite;
        }
        .ticker-inner span {
          font-family: 'Courier Prime', monospace;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--grey);
          padding: 0 26px;
        }
        .ticker-inner span.sep {
          color: var(--gold);
          padding: 0 4px;
          font-size: 10px;
        }
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* Layout */
        .page {
          position: relative; z-index: 1;
          min-height: 100vh;
          padding-top: var(--ticker-h);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
        }

        /* Logo */
        .logo {
          font-family: 'Oswald', sans-serif;
          font-size: clamp(2.4rem, 6vw, 4rem);
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          line-height: 1;
          margin-bottom: 6px;
        }
        .logo .truth { color: var(--white); }
        .logo .drop  { color: var(--gold); }

        .logo-sub {
          font-family: 'Courier Prime', monospace;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--grey);
          margin-bottom: 48px;
        }

        .divider {
          width: 48px; height: 2px;
          background: var(--gold);
          margin: 0 auto 38px;
          opacity: 0.65;
        }

        /* Headline */
        .headline {
          font-family: 'Oswald', sans-serif;
          font-size: clamp(1.55rem, 4vw, 2.5rem);
          font-weight: 600;
          line-height: 1.25;
          text-align: center;
          max-width: 680px;
          padding: 0 24px;
          color: var(--white);
          margin-bottom: 16px;
        }
        .headline em {
          font-style: normal;
          color: var(--gold);
        }

        .sub {
          font-family: 'Courier Prime', monospace;
          font-size: clamp(0.85rem, 2vw, 1rem);
          color: var(--grey);
          text-align: center;
          max-width: 520px;
          padding: 0 24px;
          line-height: 1.65;
          margin-bottom: 48px;
        }

        /* Buttons */
        .btn-group {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          justify-content: center;
          padding: 0 24px;
          margin-bottom: 52px;
        }

        .btn {
          display: inline-flex; align-items: center; justify-content: center;
          font-family: 'Courier Prime', monospace;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-decoration: none !important;
          padding: 13px 28px;
          border-radius: 2px;
          cursor: pointer;
          transition: background 0.18s, color 0.18s, border-color 0.18s;
          white-space: nowrap;
          border: none;
        }
        .btn-primary {
          background: var(--gold);
          color: #070707;
          border: 1px solid var(--gold);
        }
        .btn-primary:hover { background: #dba94a; }

        .btn-outline {
          background: transparent;
          color: var(--gold);
          border: 1px solid rgba(200,151,58,0.5);
        }
        .btn-outline:hover { background: var(--gold-dim); border-color: var(--gold); }

        .btn-ghost {
          background: transparent;
          color: var(--grey);
          border: 1px solid rgba(138,138,138,0.28);
        }
        .btn-ghost:hover { color: var(--white); border-color: rgba(245,245,240,0.38); }

        /* Countdown */
        .countdown-wrap {
          display: flex; flex-direction: column; align-items: center;
          gap: 10px;
          margin-bottom: 56px;
          width: 100%;
          max-width: 340px;
          padding: 0 24px;
        }

        .countdown-label {
          font-family: 'Courier Prime', monospace;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--grey);
        }
        .countdown-label .num { color: var(--gold); font-weight: 700; }

        .progress-track {
          width: 100%;
          height: 3px;
          background: rgba(200,151,58,0.13);
          border-radius: 2px;
          overflow: hidden;
        }
        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--gold) 0%, #e8b050 100%);
          border-radius: 2px;
          transform-origin: left;
          transition: transform 1s linear;
        }

        .skip-link {
          font-family: 'Courier Prime', monospace;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--grey);
          text-decoration: none !important;
          opacity: 0.55;
          cursor: pointer;
          background: none; border: none;
          transition: opacity 0.18s;
        }
        .skip-link:hover { opacity: 1; color: var(--white); }

        /* Footer */
        footer {
          position: relative; z-index: 1;
          width: 100%;
          border-top: 1px solid rgba(200,151,58,0.1);
          padding: 18px 24px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 5px 18px;
        }

        .footer-link {
          font-family: 'Courier Prime', monospace;
          font-size: 11px;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: var(--grey);
          text-decoration: none !important;
          transition: color 0.18s;
        }
        .footer-link:hover { color: var(--gold); }

        .footer-sep { color: rgba(200,151,58,0.28); font-size: 10px; }

        .footer-copy {
          width: 100%;
          text-align: center;
          font-family: 'Courier Prime', monospace;
          font-size: 10px;
          letter-spacing: 0.11em;
          color: rgba(138,138,138,0.38);
          margin-top: 8px;
        }

        @media (max-width: 480px) {
          .btn-group { flex-direction: column; align-items: stretch; }
          .btn { text-align: center; }
        }
      `}</style>

      {/* Ticker */}
      <div className="ticker-wrap" aria-hidden="true">
        <div className="ticker-label">Live</div>
        <div className="ticker-track">
          <div className="ticker-inner">
            {["Independent","Disabled U.S. Veteran","United States","Puerto Rico","Philippines","No institutional funding","Follow the money","Expose the grift",
              "Independent","Disabled U.S. Veteran","United States","Puerto Rico","Philippines","No institutional funding","Follow the money","Expose the grift"
            ].map((item, i) => (
              item === "·" ? <span key={i} className="sep">·</span> : (
                <span key={i}>{item}</span>
              )
            ))}
          </div>
        </div>
      </div>

      <main className="page">
        {/* Logo */}
        <div className="logo" aria-label="TruthDrop">
          <span className="truth">Truth</span><span className="drop">Drop</span>
        </div>
        <div className="logo-sub">The Vault Investigates</div>

        <div className="divider" />

        {/* Headline */}
        <h1 className="headline">
          Every headline you see is just the{" "}
          <em>tip of the iceberg.</em>
          <br />
          We follow the money.
        </h1>

        <p className="sub">
          An independent archive documenting how resources are misused —
          across the United States, Puerto Rico, and the Philippines.
        </p>

        {/* Buttons */}
        <div className="btn-group">
          <a href="https://truthdrop-5buxndbh.manus.space/tips" target="_blank" rel="noopener noreferrer" className="btn btn-primary" onClick={cancel}>
            Submit a Tip
          </a>
          <a
            href="https://thevaultinvestigates.cloud/p/support-independent-investigative"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            onClick={cancel}
          >
            Fund the Archive
          </a>
          <a
            href="https://thevaultinvestigates.cloud/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
            onClick={cancel}
          >
            Read Investigations
          </a>
        </div>

        {/* Countdown */}
        <div className="countdown-wrap">
          {cancelled ? (
            <div className="countdown-label">Redirect cancelled</div>
          ) : (
            <>
              <div className="countdown-label">
                Redirecting to tip intake in{" "}
                <span className="num">{count}</span>s
              </div>
              <div className="progress-track">
                <div
                  className="progress-bar"
                  style={{
                    transform: `scaleX(${count / COUNTDOWN_SECONDS})`,
                  }}
                />
              </div>
              <button className="skip-link" onClick={() => { cancel(); window.location.href = REDIRECT_PATH; }}>
                Skip →
              </button>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer>
        <a href="https://x.com/PovertyVault" target="_blank" rel="noopener noreferrer" className="footer-link">X · @PovertyVault</a>
        <span className="footer-sep">·</span>
        <a href="https://www.facebook.com/vaultarchivist" target="_blank" rel="noopener noreferrer" className="footer-link">Facebook</a>
        <span className="footer-sep">·</span>
        <a href="https://www.instagram.com/povertyvault" target="_blank" rel="noopener noreferrer" className="footer-link">Instagram</a>
        <span className="footer-sep">·</span>
        <a href="https://ko-fi.com/thevaultinvestigates" target="_blank" rel="noopener noreferrer" className="footer-link">Ko-fi</a>
        <span className="footer-sep">·</span>
        <a href="https://www.paypal.com/ncp/payment/JH4X7243NJMRE" target="_blank" rel="noopener noreferrer" className="footer-link">PayPal</a>
        <span className="footer-sep">·</span>
        <a href="https://gofund.me/524735536" target="_blank" rel="noopener noreferrer" className="footer-link">GoFundMe</a>
        <div className="footer-copy">© 2026 TruthDrop.io – Investigative Research Platform</div>
      </footer>
    </>
  );
}
