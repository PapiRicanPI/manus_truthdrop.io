import type { NextApiRequest, NextApiResponse } from "next";
import { getUserSession } from "../../../lib/userSession";
import { getResearcherById, updateResearcherProfile } from "../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getUserSession(req, res);
  if (!session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const numId = parseInt(session.userId, 10);
  const researcher = await getResearcherById(numId);
  if (!researcher) {
    return res.status(404).json({ error: "User not found" });
  }

  if (req.method === "GET") {
    return res.status(200).json({
      id: String(researcher.id),
      name: researcher.name,
      email: researcher.email,
      role: researcher.role,
      organization: researcher.organization ?? null,
      alias: researcher.alias ?? null,
      country: researcher.country ?? null,
      bio: researcher.bio ?? null,
      foundingInvestigator: researcher.foundingInvestigator === 1,
      foundingInvestigatorYear: researcher.foundingInvestigatorYear ?? null,
      createdAt: researcher.createdAt instanceof Date ? researcher.createdAt.toISOString() : String(researcher.createdAt),
    });
  }

  if (req.method === "PATCH") {
    const { alias, country, bio } = req.body;
    if (alias !== undefined && typeof alias === "string" && alias.length > 50) {
      return res.status(400).json({ error: "Alias must be 50 characters or less" });
    }
    if (bio !== undefined && typeof bio === "string" && bio.length > 500) {
      return res.status(400).json({ error: "Bio must be 500 characters or less" });
    }
    await updateResearcherProfile(numId, {
      alias: alias !== undefined ? (alias?.trim() || null) : undefined,
      country: country !== undefined ? (country?.trim() || null) : undefined,
      bio: bio !== undefined ? (bio?.trim() || null) : undefined,
    });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
