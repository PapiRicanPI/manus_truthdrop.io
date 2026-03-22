import type { NextApiRequest, NextApiResponse } from "next";
import { getUserSession, readWorkspace, writeWorkspace } from "../../../lib/userSession";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getUserSession(req, res);
  if (!session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const userId = session.userId;
  const workspace = readWorkspace();
  if (!workspace.notes[userId]) workspace.notes[userId] = {};

  if (req.method === "GET") {
    const { caseId } = req.query;
    if (caseId && typeof caseId === "string") {
      return res.status(200).json({ note: workspace.notes[userId][caseId] || "" });
    }
    return res.status(200).json({ notes: workspace.notes[userId] });
  }

  if (req.method === "PUT") {
    const { caseId, note } = req.body;
    if (!caseId) return res.status(400).json({ error: "caseId required" });
    if (note === "" || note === null || note === undefined) {
      delete workspace.notes[userId][caseId];
    } else {
      if (typeof note === "string" && note.length > 5000) {
        return res.status(400).json({ error: "Note must be 5000 characters or less" });
      }
      workspace.notes[userId][caseId] = note;
    }
    writeWorkspace(workspace);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
