import type { NextApiRequest, NextApiResponse } from "next";
import { getUserSession, readWorkspace, writeWorkspace } from "../../../lib/userSession";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getUserSession(req, res);
  if (!session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const userId = session.userId;
  const workspace = readWorkspace();
  if (!workspace.bookmarks[userId]) workspace.bookmarks[userId] = [];

  if (req.method === "GET") {
    return res.status(200).json({ bookmarks: workspace.bookmarks[userId] });
  }

  if (req.method === "POST") {
    const { caseId } = req.body;
    if (!caseId) return res.status(400).json({ error: "caseId required" });
    if (!workspace.bookmarks[userId].includes(caseId)) {
      workspace.bookmarks[userId].push(caseId);
      writeWorkspace(workspace);
    }
    return res.status(200).json({ ok: true, bookmarks: workspace.bookmarks[userId] });
  }

  if (req.method === "DELETE") {
    const { caseId } = req.body;
    if (!caseId) return res.status(400).json({ error: "caseId required" });
    workspace.bookmarks[userId] = workspace.bookmarks[userId].filter((id) => id !== caseId);
    writeWorkspace(workspace);
    return res.status(200).json({ ok: true, bookmarks: workspace.bookmarks[userId] });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
