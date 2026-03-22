import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "../../../lib/session";
import { readUsers, writeUsers } from "../../../lib/userSession";
import fs from "fs";
import path from "path";

const VETTING_FILE = path.join("/tmp", "vetting_applications.json");

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
  provisionedAt?: string;
}

function readApplications(): VettingApplication[] {
  try {
    if (fs.existsSync(VETTING_FILE)) {
      return JSON.parse(fs.readFileSync(VETTING_FILE, "utf-8"));
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
    // Read real user accounts (have login credentials)
    const realUsers = readUsers();
    const realUserEmails = new Set(realUsers.map((u) => u.email.toLowerCase()));

    // Build list from real users
    const userList = realUsers.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      organization: u.organization || null,
      role: u.role,
      alias: u.alias || null,
      country: u.country || null,
      foundingInvestigator: u.foundingInvestigator || false,
      foundingInvestigatorYear: u.foundingInvestigatorYear || null,
      createdAt: u.createdAt,
      hasLogin: true,
    }));

    // Also include approved applicants who don't yet have a real account
    // (webhook may not have fired, or they were approved before the new system)
    const applications = readApplications();
    const approvedWithoutAccounts = applications
      .filter((a) => a.status === "approved" && !realUserEmails.has(a.email.toLowerCase()))
      .map((a) => ({
        id: a.id,
        name: a.fullName,
        email: a.email,
        organization: a.organization || null,
        role: a.assignedRole || "observer",
        alias: null,
        country: null,
        foundingInvestigator: false,
        foundingInvestigatorYear: null,
        createdAt: a.reviewedAt || a.createdAt,
        hasLogin: false, // No login credentials yet
      }));

    const combined = [...userList, ...approvedWithoutAccounts]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return res.status(200).json({ users: combined });
  }

  // PATCH — update a user's role
  if (req.method === "PATCH") {
    const { id, role } = req.body;
    const validRoles = ["observer", "researcher", "custodian", "admin"];
    if (!id || !role || !validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid id or role" });
    }

    // Try real users first
    const users = readUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx !== -1) {
      users[idx].role = role;
      users[idx].updatedAt = new Date().toISOString();
      writeUsers(users);
      return res.status(200).json({ success: true });
    }

    // Fall back to vetting applications (approved but not yet provisioned)
    const applications = readApplications();
    const appIdx = applications.findIndex((a) => a.id === id);
    if (appIdx !== -1) {
      applications[appIdx].assignedRole = role;
      fs.writeFileSync(VETTING_FILE, JSON.stringify(applications, null, 2), "utf-8");
      return res.status(200).json({ success: true });
    }

    return res.status(404).json({ error: "User not found" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
