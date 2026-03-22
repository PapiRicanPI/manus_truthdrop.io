import type { NextApiRequest, NextApiResponse } from "next";
import { getUserSession, readWorkspace, writeWorkspace } from "../../../lib/userSession";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getUserSession(req, res);
  if (!session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const userId = session.userId;
  const workspace = readWorkspace();
  if (!workspace.recentlyViewed[userId]) workspace.recentlyViewed[userId] = [];

  if (req.method === "GET") {
    return res.status(200).json({ recentlyViewed: workspace.recentlyViewed[userId].slice(0, 10) });
  }

  if (req.method === "POST") {
    const { caseId, caseTitle } = req.body;
    if (!caseId) return res.status(400).json({ error: "caseId required" });
    // Remove existing entry for this case, then add to front
    workspace.recentlyViewed[userId] = workspace.recentlyViewed[userId].filter((r) => r.caseId !== caseId);
    workspace.recentlyViewed[userId].unshift({
      caseId,
      caseTitle: caseTitle || caseId,
      viewedAt: new Date().toISOString(),
    });
    // Keep only last 20
    workspace.recentlyViewed[userId] = workspace.recentlyViewed[userId].slice(0, 20);
    writeWorkspace(workspace);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
