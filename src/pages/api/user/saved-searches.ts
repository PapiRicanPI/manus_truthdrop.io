import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { getUserSession, readWorkspace, writeWorkspace, SavedSearch } from "../../../lib/userSession";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getUserSession(req, res);
  if (!session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const userId = session.userId;
  const workspace = readWorkspace();
  if (!workspace.savedSearches[userId]) workspace.savedSearches[userId] = [];

  if (req.method === "GET") {
    return res.status(200).json({ savedSearches: workspace.savedSearches[userId] });
  }

  if (req.method === "POST") {
    const { name, query, filters } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: "Search name required" });
    const savedSearch: SavedSearch = {
      id: crypto.randomUUID(),
      name: name.trim(),
      query: query || "",
      filters: filters || {},
      createdAt: new Date().toISOString(),
      lastChecked: new Date().toISOString(),
    };
    workspace.savedSearches[userId].push(savedSearch);
    writeWorkspace(workspace);
    return res.status(201).json({ ok: true, savedSearch });
  }

  if (req.method === "DELETE") {
    const { searchId } = req.body;
    if (!searchId) return res.status(400).json({ error: "searchId required" });
    workspace.savedSearches[userId] = workspace.savedSearches[userId].filter((s) => s.id !== searchId);
    writeWorkspace(workspace);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
