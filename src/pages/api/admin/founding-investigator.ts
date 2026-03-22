import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "../../../lib/session";
import { readUsers, writeUsers } from "../../../lib/userSession";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res);
  if (!session.isAdmin) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, foundingInvestigator, foundingInvestigatorYear } = req.body;
  if (!userId) return res.status(400).json({ error: "userId required" });

  const users = readUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return res.status(404).json({ error: "User not found" });

  users[idx].foundingInvestigator = Boolean(foundingInvestigator);
  users[idx].foundingInvestigatorYear = foundingInvestigator
    ? (foundingInvestigatorYear || new Date().getFullYear())
    : null;
  users[idx].updatedAt = new Date().toISOString();
  writeUsers(users);

  return res.status(200).json({ ok: true });
}
