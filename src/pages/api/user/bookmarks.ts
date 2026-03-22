import type { NextApiRequest, NextApiResponse } from "next";
import { getUserSession } from "../../../lib/userSession";
import { getBookmarks, addBookmark, removeBookmark } from "../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getUserSession(req, res);
  if (!session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const researcherId = parseInt(session.userId, 10);

  if (req.method === "GET") {
    const bookmarks = await getBookmarks(researcherId);
    return res.status(200).json({ bookmarks });
  }

  if (req.method === "POST") {
    const { caseId, caseTitle } = req.body;
    if (!caseId) return res.status(400).json({ error: "caseId required" });
    await addBookmark(researcherId, caseId, caseTitle || caseId);
    const bookmarks = await getBookmarks(researcherId);
    return res.status(200).json({ ok: true, bookmarks });
  }

  if (req.method === "DELETE") {
    const { caseId } = req.body;
    if (!caseId) return res.status(400).json({ error: "caseId required" });
    await removeBookmark(researcherId, caseId);
    const bookmarks = await getBookmarks(researcherId);
    return res.status(200).json({ ok: true, bookmarks });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
