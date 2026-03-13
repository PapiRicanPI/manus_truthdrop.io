import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "../../../lib/session";
import fs from "fs";
import path from "path";
import crypto from "crypto";

interface VettingApplication {
  id: string;
  fullName: string;
  email: string;
  organization?: string;
  role?: string;
  reasonForAccess: string;
  intendedUse: string;
  status: "pending" | "approved" | "rejected";
  reviewNotes?: string;
  scoreIdentity?: number;
  scoreOrg?: number;
  scorePurpose?: number;
  scoreSupport?: number;
  scoreRisk?: number;
  scoreTotal?: number;
  createdAt: string;
  reviewedAt?: string;
}

// Store data in /tmp for Vercel (ephemeral but works for the session)
// For persistent storage, this would connect to a database
const DATA_FILE = path.join("/tmp", "vetting_applications.json");

function readApplications(): VettingApplication[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(raw);
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check admin session
  const session = await getSession(req, res);
  if (!session.isAdmin) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    // Return all applications
    const applications = readApplications();
    return res.status(200).json({ applications });
  }

  if (req.method === "POST") {
    // Add a new application manually
    const { fullName, email, organization, role, reasonForAccess, intendedUse } = req.body;

    if (!fullName || !email || !reasonForAccess || !intendedUse) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newApp: VettingApplication = {
      id: crypto.randomUUID(),
      fullName,
      email,
      organization: organization || undefined,
      role: role || undefined,
      reasonForAccess,
      intendedUse,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const applications = readApplications();
    applications.unshift(newApp);
    writeApplications(applications);

    return res.status(201).json({ application: newApp });
  }

  if (req.method === "PATCH") {
    // Update application status and scores
    const {
      id,
      status,
      reviewNotes,
      scoreIdentity,
      scoreOrg,
      scorePurpose,
      scoreSupport,
      scoreRisk,
      scoreTotal,
    } = req.body;

    if (!id || !status) {
      return res.status(400).json({ error: "Missing id or status" });
    }

    const applications = readApplications();
    const index = applications.findIndex(a => a.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Application not found" });
    }

    applications[index] = {
      ...applications[index],
      status,
      reviewNotes,
      scoreIdentity,
      scoreOrg,
      scorePurpose,
      scoreSupport,
      scoreRisk,
      scoreTotal,
      reviewedAt: new Date().toISOString(),
    };

    writeApplications(applications);

    return res.status(200).json({ application: applications[index] });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
