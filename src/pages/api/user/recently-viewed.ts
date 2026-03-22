import type { NextApiRequest, NextApiResponse } from "next";
import { getUserSession } from "../../../lib/userSession";
import { getRecentlyViewed, recordView } from "../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getUserSession(req, res);
  if (!session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const researcherId = parseInt(session.userId, 10);

  if (req.method === "GET") {
    const recentlyViewed = await getRecentlyViewed(researcherId, 10);
    return res.status(200).json({ recentlyViewed });
  }

  if (req.method === "POST") {
    const { caseId, caseTitle } = req.body;
    if (!caseId) return res.status(400).json({ error: "caseId required" });
    await recordView(researcherId, caseId, caseTitle || caseId);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
