import type { NextApiRequest, NextApiResponse } from "next";
import { getUserSession } from "../../../lib/userSession";
import { getNote, upsertNote } from "../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getUserSession(req, res);
  if (!session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const researcherId = parseInt(session.userId, 10);

  if (req.method === "GET") {
    const { caseId } = req.query;
    if (caseId && typeof caseId === "string") {
      const row = await getNote(researcherId, caseId);
      return res.status(200).json({ note: row?.note || "" });
    }
    return res.status(200).json({ notes: {} });
  }

  if (req.method === "PUT") {
    const { caseId, note } = req.body;
    if (!caseId) return res.status(400).json({ error: "caseId required" });
    if (typeof note === "string" && note.length > 5000) {
      return res.status(400).json({ error: "Note must be 5000 characters or less" });
    }
    await upsertNote(researcherId, caseId, note || "");
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
