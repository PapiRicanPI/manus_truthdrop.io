import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "../../../lib/session";
import { readUsers, writeUsers } from "../../../lib/userSession";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res);
  if (!session.isAdmin) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    const users = readUsers();
    const userList = users
      .map((u) => ({
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
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return res.status(200).json({ users: userList });
  }

  // PATCH — update a user's role
  if (req.method === "PATCH") {
    const { id, role } = req.body;
    const validRoles = ["observer", "researcher", "custodian", "admin"];
    if (!id || !role || !validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid id or role" });
    }
    const users = readUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: "User not found" });
    }
    users[idx].role = role;
    users[idx].updatedAt = new Date().toISOString();
    writeUsers(users);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
