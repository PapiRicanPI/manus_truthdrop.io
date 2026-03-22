import type { NextApiRequest, NextApiResponse } from "next";
import { getUserSession } from "../../../lib/userSession";
import { getProjects, createProject, updateProject, deleteProject } from "../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getUserSession(req, res);
  if (!session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const researcherId = parseInt(session.userId, 10);

  if (req.method === "GET") {
    const projects = await getProjects(researcherId);
    return res.status(200).json({ projects });
  }

  if (req.method === "POST") {
    const { name, description } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: "Project name required" });
    const id = await createProject(researcherId, name.trim(), description?.trim() || "");
    return res.status(201).json({ ok: true, project: { id } });
  }

  if (req.method === "PATCH") {
    const { projectId, name, description, caseIds } = req.body;
    if (!projectId) return res.status(400).json({ error: "projectId required" });
    await updateProject(parseInt(projectId, 10), researcherId, {
      title: name?.trim(),
      description: description?.trim(),
      caseIds,
    });
    return res.status(200).json({ ok: true });
  }

  if (req.method === "DELETE") {
    const { projectId } = req.body;
    if (!projectId) return res.status(400).json({ error: "projectId required" });
    await deleteProject(parseInt(projectId, 10), researcherId);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
