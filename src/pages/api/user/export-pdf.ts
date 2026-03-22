import type { NextApiRequest, NextApiResponse } from "next";
import { getUserSession, readUsers } from "../../../lib/userSession";
// @ts-ignore
import PDFDocument from "pdfkit";

/**
 * PDF Export API with user-specific watermarking.
 *
 * GET /api/user/export-pdf?caseId=XXX&caseTitle=...&content=...
 *
 * Authenticated users get a watermark with their alias/name.
 * Unauthenticated requests get a generic watermark.
 *
 * Watermark format (authenticated):
 *   "TruthDrop.io — The Vault Investigates — Case [ID] — Downloaded by [ALIAS/NAME] on [DATE]"
 *
 * Watermark format (generic/public):
 *   "TruthDrop.io — The Vault Investigates — Case [ID] — Generated on [DATE]"
 */

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function buildWatermarkText(caseId: string, userDisplayName: string | null): string {
  const date = formatDate(new Date());
  if (userDisplayName) {
    return `TruthDrop.io — The Vault Investigates — Case ${caseId} — Downloaded by ${userDisplayName} on ${date}`;
  }
  return `TruthDrop.io — The Vault Investigates — Case ${caseId} — Generated on ${date}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Extract parameters from query (GET) or body (POST)
  const params = req.method === "GET" ? req.query : req.body;
  const caseId = typeof params.caseId === "string" ? params.caseId : "UNKNOWN";
  const caseTitle = typeof params.caseTitle === "string" ? params.caseTitle : `Case ${caseId}`;
  const content = typeof params.content === "string" ? params.content : "";
  const summary = typeof params.summary === "string" ? params.summary : "";
  const category = typeof params.category === "string" ? params.category : "";
  const location = typeof params.location === "string" ? params.location : "";
  const status = typeof params.status === "string" ? params.status : "";

  // Check user session for personalized watermark
  let userDisplayName: string | null = null;
  try {
    const session = await getUserSession(req, res);
    if (session.userId) {
      const users = readUsers();
      const user = users.find((u) => u.id === session.userId);
      if (user) {
        userDisplayName = user.alias || user.name;
      }
    }
  } catch {
    // Session check failed — use generic watermark
  }

  const watermarkText = buildWatermarkText(caseId, userDisplayName);
  const exportDate = formatDate(new Date());

  // Build PDF
  const doc = new PDFDocument({
    size: "LETTER",
    margins: { top: 72, bottom: 72, left: 72, right: 72 },
    info: {
      Title: `${caseTitle} — TruthDrop.io`,
      Author: "The Vault Investigates",
      Subject: `Case File Export — ${caseId}`,
      Keywords: "investigative, case file, TruthDrop",
      Creator: "TruthDrop.io",
      Producer: "TruthDrop.io",
    },
  });

  // Collect PDF buffer
  const chunks: Buffer[] = [];
  doc.on("data", (chunk: Buffer) => chunks.push(chunk));

  // ── Header ──────────────────────────────────────────────────────────
  doc
    .fillColor("#f59e0b")
    .fontSize(20)
    .font("Helvetica-Bold")
    .text("THE VAULT INVESTIGATES", { align: "center" });

  doc
    .fillColor("#94a3b8")
    .fontSize(9)
    .font("Helvetica")
    .text("TruthDrop.io — Independent Investigative Archive", { align: "center" });

  doc.moveDown(0.5);

  // Divider line
  doc
    .moveTo(72, doc.y)
    .lineTo(doc.page.width - 72, doc.y)
    .strokeColor("#1e293b")
    .lineWidth(1)
    .stroke();

  doc.moveDown(1);

  // ── Case Title ───────────────────────────────────────────────────────
  doc
    .fillColor("#1a1a2e")
    .fontSize(16)
    .font("Helvetica-Bold")
    .text(caseTitle, { align: "left" });

  doc.moveDown(0.5);

  // Case metadata row
  const metaItems: string[] = [];
  if (caseId && caseId !== "UNKNOWN") metaItems.push(`Case ID: ${caseId}`);
  if (category) metaItems.push(`Category: ${category}`);
  if (location) metaItems.push(`Location: ${location}`);
  if (status) metaItems.push(`Status: ${status}`);

  if (metaItems.length > 0) {
    doc
      .fillColor("#64748b")
      .fontSize(9)
      .font("Helvetica")
      .text(metaItems.join("  ·  "), { align: "left" });
    doc.moveDown(0.5);
  }

  doc
    .fillColor("#475569")
    .fontSize(8)
    .font("Helvetica-Oblique")
    .text(`Exported: ${exportDate}`, { align: "left" });

  doc.moveDown(1);

  // Divider
  doc
    .moveTo(72, doc.y)
    .lineTo(doc.page.width - 72, doc.y)
    .strokeColor("#e2e8f0")
    .lineWidth(0.5)
    .stroke();

  doc.moveDown(1);

  // ── Summary ──────────────────────────────────────────────────────────
  if (summary) {
    doc
      .fillColor("#1a1a2e")
      .fontSize(11)
      .font("Helvetica-Bold")
      .text("Summary", { align: "left" });

    doc.moveDown(0.4);

    doc
      .fillColor("#374151")
      .fontSize(10)
      .font("Helvetica")
      .text(summary, { align: "left", lineGap: 3 });

    doc.moveDown(1);
  }

  // ── Main Content ─────────────────────────────────────────────────────
  if (content) {
    doc
      .fillColor("#1a1a2e")
      .fontSize(11)
      .font("Helvetica-Bold")
      .text("Case Details", { align: "left" });

    doc.moveDown(0.4);

    doc
      .fillColor("#374151")
      .fontSize(10)
      .font("Helvetica")
      .text(content, { align: "left", lineGap: 3 });

    doc.moveDown(1);
  }

  // ── Disclaimer ───────────────────────────────────────────────────────
  doc.moveDown(1);

  doc
    .moveTo(72, doc.y)
    .lineTo(doc.page.width - 72, doc.y)
    .strokeColor("#e2e8f0")
    .lineWidth(0.5)
    .stroke();

  doc.moveDown(0.75);

  doc
    .fillColor("#94a3b8")
    .fontSize(8)
    .font("Helvetica-Oblique")
    .text(
      "This document is exported from TruthDrop.io — The Vault Investigates, an independent investigative archive. " +
      "The information contained herein is for research and journalistic purposes. " +
      "Unauthorized redistribution of this document is prohibited. " +
      "This document is watermarked and traceable.",
      { align: "left", lineGap: 2 }
    );

  // ── Watermark (diagonal, on every page) ──────────────────────────────
  function addWatermark(pageDoc: typeof doc) {
    const { width, height } = pageDoc.page;
    pageDoc.save();
    pageDoc
      .fillColor("#e2e8f0")
      .opacity(0.12)
      .fontSize(9)
      .font("Helvetica-Bold");

    // Draw watermark text diagonally across the page
    // Repeat it in a grid pattern
    const text = watermarkText;
    const angle = -35 * (Math.PI / 180);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const rows = 5;
    const cols = 2;
    const rowSpacing = height / (rows + 1);
    const colSpacing = width / (cols + 1);

    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        const cx = colSpacing * (c + 1);
        const cy = rowSpacing * (r + 1);
        pageDoc
          .save()
          .translate(cx, cy)
          .rotate(-35, { origin: [0, 0] })
          .text(text, -200, -5, { width: 400, align: "center" })
          .restore();
      }
    }

    pageDoc.restore();
  }

  // Add watermark to first page
  addWatermark(doc);

  // Add watermark to subsequent pages
  doc.on("pageAdded", () => {
    addWatermark(doc);
  });

  // ── Footer on each page ───────────────────────────────────────────────
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    doc
      .fillColor("#94a3b8")
      .opacity(1)
      .fontSize(7)
      .font("Helvetica")
      .text(
        `TruthDrop.io — The Vault Investigates  |  Page ${i + 1}`,
        72,
        doc.page.height - 40,
        { align: "center", width: doc.page.width - 144 }
      );
  }

  doc.end();

  // Wait for PDF to be fully generated
  await new Promise<void>((resolve) => doc.on("end", resolve));

  const pdfBuffer = Buffer.concat(chunks);
  const filename = `TruthDrop-Case-${caseId}-${new Date().toISOString().split("T")[0]}.pdf`;

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("Content-Length", pdfBuffer.length);
  res.setHeader("Cache-Control", "no-store, no-cache");
  res.status(200).end(pdfBuffer);
}
