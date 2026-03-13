import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "../../../lib/session";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import nodemailer from "nodemailer";

type AppStatus = "pending" | "approved" | "rejected" | "needs_info";

interface VettingApplication {
  id: string;
  fullName: string;
  email: string;
  organization?: string;
  role?: string;
  reasonForAccess: string;
  intendedUse: string;
  status: AppStatus;
  reviewNotes?: string;
  assignedRole?: string;
  scoreIdentity?: number;
  scoreOrg?: number;
  scorePurpose?: number;
  scoreSupport?: number;
  scoreRisk?: number;
  scoreTotal?: number;
  createdAt: string;
  reviewedAt?: string;
}

const DATA_FILE = path.join("/tmp", "vetting_applications.json");

function readApplications(): VettingApplication[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    }
  } catch {}
  return [];
}

function writeApplications(apps: VettingApplication[]): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(apps, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write applications:", err);
  }
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendApprovalEmail(to: string, name: string, assignedRole: string, reviewNotes: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("[Email] SMTP not configured - skipping approval email to", to);
    return;
  }
  const roleLabels: Record<string, string> = {
    observer: "Observer (Read-only access)",
    researcher: "Researcher (Case and evidence work)",
    custodian: "Custodian / Moderator (Tip review and case linking)",
    admin: "Admin (Full access)",
  };
  const roleLabel = roleLabels[assignedRole] || assignedRole;
  const html = `<!DOCTYPE html>
<html><head><style>
body{font-family:Arial,sans-serif;line-height:1.6;color:#333;background:#f4f4f4}
.container{max-width:600px;margin:0 auto;background:#fff}
.header{background:#1a1a1a;color:#f59e0b;padding:24px;text-align:center}
.content{padding:30px}
.badge{display:inline-block;background:#f59e0b22;color:#92400e;border:1px solid #f59e0b55;border-radius:6px;padding:4px 14px;font-weight:600;font-size:0.9rem;margin:8px 0}
.info-box{background:#f9f9f9;border-left:4px solid #f59e0b;padding:16px;margin:20px 0;border-radius:0 6px 6px 0}
.footer{background:#1a1a1a;color:#666;padding:16px;text-align:center;font-size:12px}
a.btn{display:inline-block;padding:12px 28px;background:#f59e0b;color:#1a1a1a;text-decoration:none;border-radius:6px;font-weight:700;margin-top:16px}
</style></head>
<body>
<div class="container">
  <div class="header"><h1>The Vault Investigates</h1><p style="margin:4px 0 0;color:#94a3b8;font-size:0.9rem">Database Access Approved</p></div>
  <div class="content">
    <h2>Congratulations, ${name}!</h2>
    <p>Your application for access to the TruthDrop poverty fraud case documentation database has been <strong>approved</strong>.</p>
    <div class="info-box">
      <strong>Assigned Role:</strong><br>
      <span class="badge">${roleLabel}</span>
      <br><br>
      <strong>Login URL:</strong> <a href="https://truthdrop.io/login">https://truthdrop.io/login</a><br>
      <strong>Email:</strong> ${to}
    </div>
    <p><strong>Reviewer Notes:</strong><br>${reviewNotes}</p>
    <h3>Terms of Use Reminder:</h3>
    <ul>
      <li>Use data responsibly and ethically</li>
      <li>Properly cite The Vault Investigates as a source</li>
      <li>Do not misrepresent or manipulate findings</li>
      <li>Do not redistribute raw data without permission</li>
      <li>Comply with all applicable laws and regulations</li>
    </ul>
    <p style="text-align:center"><a href="https://truthdrop.io/login" class="btn">Login to TruthDrop</a></p>
    <p>Best regards,<br><strong>The Vault Investigates Team</strong></p>
  </div>
  <div class="footer"><p>This is an automated message. &copy; 2026 The Vault Investigates.</p></div>
</div>
</body></html>`;
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"The Vault Investigates" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to,
    subject: "Your Access to The Vault Investigates - Approved",
    html,
  });
}

async function sendRejectionEmail(to: string, name: string, reviewNotes: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("[Email] SMTP not configured - skipping rejection email to", to);
    return;
  }
  const html = `<!DOCTYPE html>
<html><head><style>
body{font-family:Arial,sans-serif;line-height:1.6;color:#333;background:#f4f4f4}
.container{max-width:600px;margin:0 auto;background:#fff}
.header{background:#1a1a1a;color:#f59e0b;padding:24px;text-align:center}
.content{padding:30px}
.footer{background:#1a1a1a;color:#666;padding:16px;text-align:center;font-size:12px}
</style></head>
<body>
<div class="container">
  <div class="header"><h1>The Vault Investigates</h1><p style="margin:4px 0 0;color:#94a3b8;font-size:0.9rem">Application Update</p></div>
  <div class="content">
    <h2>Dear ${name},</h2>
    <p>Thank you for your interest in The Vault Investigates database.</p>
    <p>After careful review, we are unable to approve your application at this time.</p>
    <p><strong>Reviewer Notes:</strong><br>${reviewNotes}</p>
    <p>You are welcome to reapply in the future with a more detailed application addressing our vetting criteria:</p>
    <ul>
      <li>Legitimate research, journalistic, or educational purpose</li>
      <li>Professional affiliation with a verifiable organization</li>
      <li>Clear commitment to responsible data use</li>
      <li>Verifiable identity and professional email</li>
    </ul>
    <p>Best regards,<br><strong>The Vault Investigates Team</strong></p>
  </div>
  <div class="footer"><p>This is an automated message. &copy; 2026 The Vault Investigates.</p></div>
</div>
</body></html>`;
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"The Vault Investigates" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to,
    subject: "Update on Your Application to The Vault Investigates",
    html,
  });
}

async function sendMoreInfoEmail(to: string, name: string, infoMessage: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("[Email] SMTP not configured - skipping more-info email to", to);
    return;
  }
  const html = `<!DOCTYPE html>
<html><head><style>
body{font-family:Arial,sans-serif;line-height:1.6;color:#333;background:#f4f4f4}
.container{max-width:600px;margin:0 auto;background:#fff}
.header{background:#1a1a1a;color:#f59e0b;padding:24px;text-align:center}
.content{padding:30px}
.info-box{background:#fffbeb;border-left:4px solid #f59e0b;padding:16px;margin:20px 0;border-radius:0 6px 6px 0;white-space:pre-wrap}
.footer{background:#1a1a1a;color:#666;padding:16px;text-align:center;font-size:12px}
a.btn{display:inline-block;padding:12px 28px;background:#f59e0b;color:#1a1a1a;text-decoration:none;border-radius:6px;font-weight:700;margin-top:16px}
</style></head>
<body>
<div class="container">
  <div class="header"><h1>The Vault Investigates</h1><p style="margin:4px 0 0;color:#94a3b8;font-size:0.9rem">Additional Information Needed</p></div>
  <div class="content">
    <h2>Dear ${name},</h2>
    <p>Thank you for applying for access to the TruthDrop database.</p>
    <p>We have reviewed your application and require some additional information before we can make a decision. Please provide the following:</p>
    <div class="info-box">${infoMessage}</div>
    <p>Please reply to this email with the requested information, or resubmit your application at <a href="https://vet.thevault.watch">vet.thevault.watch</a> with the updated details.</p>
    <p style="text-align:center"><a href="https://vet.thevault.watch" class="btn">Update Your Application</a></p>
    <p>We will review your response and follow up within 3-5 business days.</p>
    <p>Best regards,<br><strong>The Vault Investigates Team</strong></p>
  </div>
  <div class="footer"><p>This is an automated message. &copy; 2026 The Vault Investigates.</p></div>
</div>
</body></html>`;
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"The Vault Investigates" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to,
    subject: "Additional Information Needed - The Vault Investigates Application",
    html,
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res);
  if (!session.isAdmin) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    return res.status(200).json({ applications: readApplications() });
  }

  if (req.method === "POST") {
    const { fullName, email, organization, role, reasonForAccess, intendedUse } = req.body;
    if (!fullName || !email || !reasonForAccess || !intendedUse) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const newApp: VettingApplication = {
      id: crypto.randomUUID(),
      fullName, email,
      organization: organization || undefined,
      role: role || undefined,
      reasonForAccess, intendedUse,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    const applications = readApplications();
    applications.unshift(newApp);
    writeApplications(applications);
    return res.status(201).json({ application: newApp });
  }

  if (req.method === "PATCH") {
    const { id, status, reviewNotes, assignedRole, infoMessage, scoreIdentity, scoreOrg, scorePurpose, scoreSupport, scoreRisk, scoreTotal } = req.body;
    if (!id || !status) {
      return res.status(400).json({ error: "Missing id or status" });
    }
    const applications = readApplications();
    const index = applications.findIndex((a: VettingApplication) => a.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Application not found" });
    }
    applications[index] = {
      ...applications[index],
      status,
      reviewNotes,
      assignedRole: assignedRole || undefined,
      scoreIdentity, scoreOrg, scorePurpose, scoreSupport, scoreRisk, scoreTotal,
      reviewedAt: new Date().toISOString(),
    };
    writeApplications(applications);

    const app = applications[index];
    try {
      if (status === "approved") {
        await sendApprovalEmail(app.email, app.fullName, assignedRole || "observer", reviewNotes || "");
      } else if (status === "rejected") {
        await sendRejectionEmail(app.email, app.fullName, reviewNotes || "");
      } else if (status === "needs_info") {
        await sendMoreInfoEmail(app.email, app.fullName, infoMessage || "Please provide more information about your application.");
      }
    } catch (emailErr) {
      console.error("[Email] Failed to send email:", emailErr);
    }

    return res.status(200).json({ application: applications[index] });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
