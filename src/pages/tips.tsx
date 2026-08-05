import Head from "next/head";
import Link from "next/link";

export default function TipsPage() {
  return (
    <>
      <Head>
        <title>Submit Information | TruthDrop.io</title>
        <meta
          name="description"
          content="TruthDrop.io information intake notice and safety guidance from The Vault Investigates."
        />
        <link rel="canonical" href="https://truthdrop.io/tips" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Submit Information | TruthDrop.io" />
        <meta
          property="og:description"
          content="Read the safety notice before sharing documents, links, or information with The Vault Investigates."
        />
        <meta property="og:url" content="https://truthdrop.io/tips" />
        <meta property="og:type" content="website" />
      </Head>

      <main className="page">
        <section className="card" aria-labelledby="page-title">
          <div className="eyebrow">TRUTHDROP.IO · THE VAULT INVESTIGATES</div>
          <h1 id="page-title">Information Intake</h1>
          <p className="lead">
            The public intake route is being rebuilt so that old TruthDrop links remain under TruthDrop control and no longer depend on legacy Manus pages.
          </p>

          <div className="notice" role="alert">
            <strong>Do not send sensitive or identifying information through ordinary email.</strong>
            <span>
              Do not include names, addresses, account credentials, private medical details, or anything that could place you or another person at risk.
            </span>
          </div>

          <div className="grid">
            <article>
              <h2>What may be useful later</h2>
              <p>
                Public records, official links, court documents, government reports, archived pages, transaction records, timelines, and a clear explanation of what should be reviewed.
              </p>
            </article>
            <article>
              <h2>What not to submit here</h2>
              <p>
                Emergencies, threats requiring immediate response, passwords, private account access, unredacted personal identifiers, or unsupported accusations.
              </p>
            </article>
          </div>

          <p className="status">
            No information is being collected on this page. A reviewed intake method will appear here only after the security and retention workflow is ready.
          </p>

          <div className="actions">
            <Link className="primary" href="/">Return to TruthDrop</Link>
            <a
              className="secondary"
              href="https://vault.povertypimpslayerthevault.io/warning.html"
              target="_blank"
              rel="noreferrer"
            >
              Read Safety Warning
            </a>
          </div>
        </section>
      </main>

      <style jsx>{`
        :global(*) { box-sizing: border-box; }
        :global(html), :global(body) { margin: 0; min-height: 100%; background: #070707; color: #f5f5f0; }
        :global(body) { font-family: "Courier New", Courier, monospace; }
        .page { min-height: 100vh; display: grid; place-items: center; padding: 32px 18px; background: radial-gradient(circle at top, rgba(200,151,58,.12), transparent 38%), #070707; }
        .card { width: min(900px, 100%); border: 1px solid rgba(200,151,58,.55); background: rgba(14,14,14,.96); padding: clamp(24px, 5vw, 52px); box-shadow: 0 24px 80px rgba(0,0,0,.45); }
        .eyebrow { color: #c8973a; letter-spacing: .16em; font-size: 12px; font-weight: 700; margin-bottom: 18px; }
        h1 { margin: 0 0 18px; font-family: Arial, Helvetica, sans-serif; font-size: clamp(2.1rem, 6vw, 4rem); line-height: 1; }
        .lead { color: #cfcfc9; font-size: clamp(1rem, 2vw, 1.18rem); line-height: 1.75; max-width: 760px; }
        .notice { margin: 28px 0; padding: 20px; border: 1px solid #c8973a; background: rgba(200,151,58,.09); display: grid; gap: 10px; line-height: 1.6; }
        .notice strong { color: #f2c66d; font-size: 1.05rem; }
        .grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 18px; margin: 28px 0; }
        article { border: 1px solid #2c2c2c; padding: 20px; background: #0b0b0b; }
        h2 { color: #c8973a; margin: 0 0 10px; font-family: Arial, Helvetica, sans-serif; font-size: 1.15rem; }
        article p, .status { color: #aaa; line-height: 1.7; margin: 0; }
        .status { border-top: 1px solid #292929; padding-top: 22px; }
        .actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }
        .actions :global(a) { min-height: 50px; display: inline-flex; align-items: center; justify-content: center; padding: 14px 20px; text-decoration: none; font-weight: 800; letter-spacing: .06em; }
        .primary { background: #c8973a; color: #070707; border: 1px solid #c8973a; }
        .secondary { background: transparent; color: #c8973a; border: 1px solid rgba(200,151,58,.65); }
        @media (max-width: 680px) { .grid { grid-template-columns: 1fr; } .actions { display: grid; } }
      `}</style>
    </>
  );
}
