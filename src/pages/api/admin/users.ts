import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "../../../lib/session";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join("/tmp", "vetting_applications.json");

interface VettingApplication {
  id: string;
  fullName: string;
  email: string;
  organization?: string;
  role?: string;
  status: string;
  assignedRole?: string;
  reviewedAt?: string;
  createdAt: string;
}

function readApplications(): VettingApplication[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    }
  } catch {}
  return [];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res);
  if (!session.isAdmin) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    const applications = readApplications();
    const approvedUsers = applications
      .filter((a) => a.status === "approved")
      .map((a) => ({
        id: a.id,
        name: a.fullName,
        email: a.email,
        organization: a.organization || null,
        role: a.role || null,
        assignedRole: a.assignedRole || "observer",
        approvedAt: a.reviewedAt || a.createdAt,
      }))
      .sort((a, b) => new Date(b.approvedAt).getTime() - new Date(a.approvedAt).getTime());

    // Always include the admin at the top
    const adminUser = {
      id: "admin",
      name: "The Vault Archivist",
      email: "—",
      organization: "The Vault Investigates",
      role: "Admin",
      assignedRole: "admin",
      approvedAt: "2025-12-01T00:00:00Z",
    };

    return res.status(200).json({ users: [adminUser, ...approvedUsers] });
  }

  // PATCH — update a user's assigned role
  if (req.method === "PATCH") {
    const { id, assignedRole } = req.body;
    const validRoles = ["observer", "researcher", "custodian", "admin"];
    if (!id || !assignedRole || !validRoles.includes(assignedRole)) {
      return res.status(400).json({ error: "Invalid id or role" });
    }
    const applications = readApplications();
    const index = applications.findIndex((a) => a.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "User not found" });
    }
    applications[index].assignedRole = assignedRole;
    fs.writeFileSync(DATA_FILE, JSON.stringify(applications, null, 2), "utf-8");
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
