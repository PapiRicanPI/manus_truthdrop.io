import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Primary Meta */}
        <meta charSet="utf-8" />
        <meta name="description" content="An independent archive documenting how resources are misused — across the United States, Puerto Rico, and the Philippines." />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://truthdrop.io" />
        <meta property="og:title" content="TruthDrop – The Vault Investigates" />
        <meta property="og:description" content="An independent archive documenting how resources are misused — across the United States, Puerto Rico, and the Philippines." />
        <meta property="og:image" content="https://files.manuscdn.com/user_upload_by_module/session_file/310419663030563274/DYLMNtjYEYRenAtB.png" />
        <meta property="og:image:width" content="1024" />
        <meta property="og:image:height" content="1024" />
        <meta property="og:image:alt" content="The Vault Investigates — Exposing How Poverty Is Exploited" />
        <meta property="og:site_name" content="TruthDrop – The Vault Investigates" />

        {/* Twitter / X */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@PovertyVault" />
        <meta name="twitter:title" content="TruthDrop – The Vault Investigates" />
        <meta name="twitter:description" content="An independent archive documenting how resources are misused." />
        <meta name="twitter:image" content="https://files.manuscdn.com/user_upload_by_module/session_file/310419663030563274/DYLMNtjYEYRenAtB.png" />
        <meta name="twitter:image:alt" content="The Vault Investigates — Exposing How Poverty Is Exploited" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Courier+Prime:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
