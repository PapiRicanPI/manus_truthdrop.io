import type { NextApiRequest, NextApiResponse } from "next";
import { getUserSession, readUsers, writeUsers } from "../../../lib/userSession";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getUserSession(req, res);
  if (!session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === session.userId);
  if (idx === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  if (req.method === "GET") {
    const u = users[idx];
    return res.status(200).json({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      organization: u.organization,
      alias: u.alias,
      country: u.country,
      bio: u.bio,
      foundingInvestigator: u.foundingInvestigator,
      foundingInvestigatorYear: u.foundingInvestigatorYear,
      createdAt: u.createdAt,
    });
  }

  if (req.method === "PATCH") {
    const { alias, country, bio } = req.body;
    // Validate lengths
    if (alias !== undefined && typeof alias === "string" && alias.length > 50) {
      return res.status(400).json({ error: "Alias must be 50 characters or less" });
    }
    if (bio !== undefined && typeof bio === "string" && bio.length > 500) {
      return res.status(400).json({ error: "Bio must be 500 characters or less" });
    }
    if (alias !== undefined) users[idx].alias = alias?.trim() || null;
    if (country !== undefined) users[idx].country = country?.trim() || null;
    if (bio !== undefined) users[idx].bio = bio?.trim() || null;
    users[idx].updatedAt = new Date().toISOString();
    writeUsers(users);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
