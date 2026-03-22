/**
 * Secure webhook endpoint called by the Vault Vetting Portal
 * when an applicant is approved. Creates the user account on
 * truthdrop.io with the assigned role and sends login credentials.
 *
 * Protected by VETTING_WEBHOOK_SECRET shared between both systems.
 */
import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { getResearcherByEmail, createResearcher, updateResearcherRole } from "../../../lib/db";

function generateSecurePassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
  let password = "";
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  Array.from(array).forEach((byte) => {
    password += chars[byte % chars.length];
  });
  return password;
}

function normalizeRole(role: string): string {
  const map: Record<string, string> = {
    custodian: "custodian",
    researcher: "researcher",
    observer: "observer",
    user: "observer",
    admin: "admin",
  };
  return map[role.toLowerCase()] || "observer";
}

async function sendCredentialsEmail(to: string, name: string, password: string, role: string) {
  const roleLabels: Record<string, string> = {
    observer: "Observer — Read-only access to published case files",
    researcher: "Researcher — Case and evidence work",
    custodian: "Custodian / Moderator — Tip review, redaction, and case linking",
    admin: "Administrator — Full access",
  };
  const roleLabel = roleLabels[role] || role;

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("[Webhook] SMTP not configured — skipping credentials email to", to);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const html = `<!DOCTYPE html>
<html><head><style>
body{font-family:Arial,sans-serif;line-height:1.6;color:#333;background:#f4f4f4}
.container{max-width:600px;margin:0 auto;background:#fff}
.header{background:#1a1a1a;color:#f59e0b;padding:24px;text-align:center}
.content{padding:30px}
.creds{background:#0a0a0f;border:1px solid #1e293b;border-radius:8px;padding:20px;margin:20px 0}
.creds p{color:#e2e8f0;margin:6px 0;font-family:monospace}
.creds label{color:#64748b;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.05em}
.badge{display:inline-block;padding:4px 12px;background:#0a1628;color:#63b3ed;border-radius:4px;font-size:0.8rem;font-weight:700}
.footer{background:#1a1a1a;color:#666;padding:16px;text-align:center;font-size:12px}
a.btn{display:inline-block;padding:12px 28px;background:#f59e0b;color:#1a1a1a;text-decoration:none;border-radius:6px;font-weight:700;margin-top:16px}
</style></head>
<body>
<div class="container">
  <div class="header">
    <h1>The Vault Investigates</h1>
    <p style="margin:4px 0 0;color:#94a3b8;font-size:0.9rem">Access Approved — Your Login Credentials</p>
  </div>
  <div class="content">
    <h2>Welcome, ${name}</h2>
    <p>Your application to access <strong>TruthDrop.io</strong> has been approved. Below are your login credentials.</p>
    <div class="creds">
      <label>Login URL</label>
      <p><a href="https://truthdrop.io/login" style="color:#f59e0b">https://truthdrop.io/login</a></p>
      <label>Email</label>
      <p>${to}</p>
      <label>Temporary Password</label>
      <p style="font-size:1.1rem;letter-spacing:0.1em;color:#f59e0b">${password}</p>
    </div>
    <p>Your access level: <span class="badge">${roleLabel}</span></p>
    <p style="margin-top:16px">Please change your password after your first login. Keep your credentials confidential — your account is tied to your vetting approval and is non-transferable.</p>
    <p style="text-align:center"><a href="https://truthdrop.io/login" class="btn">Log In to TruthDrop.io</a></p>
    <p style="margin-top:24px;color:#64748b;font-size:0.85rem">If you have questions, reply to this email and we will get back to you.</p>
  </div>
  <div class="footer"><p>&copy; 2026 TruthDrop.io — Investigative Research Platform</p></div>
</div>
</body></html>`;

  await transporter.sendMail({
    from: `"The Vault Investigates" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to,
    subject: "✅ Your TruthDrop.io Access Has Been Approved — Login Credentials",
    html,
    replyTo: process.env.ADMIN_REPLY_TO || "exposingpovertypimps@gmail.com",
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Verify shared secret
  const secret = process.env.VETTING_WEBHOOK_SECRET;
  const authHeader = req.headers["x-webhook-secret"];
  if (!secret || authHeader !== secret) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { email, name, organization, assignedRole } = req.body;
  if (!email || !name || !assignedRole) {
    return res.status(400).json({ error: "Missing required fields: email, name, assignedRole" });
  }

  const role = normalizeRole(assignedRole);

  // Check if user already exists in the database
  const existing = await getResearcherByEmail(email);
  if (existing) {
    // Update their role if they already exist
    await updateResearcherRole(existing.id, role);
    return res.status(200).json({ success: true, action: "role_updated", role });
  }

  // Generate password and create user in the database
  const password = generateSecurePassword();
  const passwordHash = await bcrypt.hash(password, 12);
  await createResearcher({
    name,
    email: email.toLowerCase(),
    organization: organization || undefined,
    passwordHash,
    role,
  });

  // Send credentials email
  try {
    await sendCredentialsEmail(email, name, password, role);
  } catch (e) {
    console.error("[Webhook] Failed to send credentials email:", e);
    // Don't fail the request — user was created, email is best-effort
  }

  return res.status(201).json({ success: true, action: "user_created", role });
}
