import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { getUserSession, readWorkspace, writeWorkspace, Project } from "../../../lib/userSession";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getUserSession(req, res);
  if (!session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const userId = session.userId;
  const workspace = readWorkspace();
  if (!workspace.projects[userId]) workspace.projects[userId] = [];

  if (req.method === "GET") {
    return res.status(200).json({ projects: workspace.projects[userId] });
  }

  if (req.method === "POST") {
    const { name, description } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: "Project name required" });
    const project: Project = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description?.trim() || "",
      caseIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    workspace.projects[userId].push(project);
    writeWorkspace(workspace);
    return res.status(201).json({ ok: true, project });
  }

  if (req.method === "PATCH") {
    const { projectId, name, description, addCaseId, removeCaseId } = req.body;
    if (!projectId) return res.status(400).json({ error: "projectId required" });
    const idx = workspace.projects[userId].findIndex((p) => p.id === projectId);
    if (idx === -1) return res.status(404).json({ error: "Project not found" });
    if (name !== undefined) workspace.projects[userId][idx].name = name.trim();
    if (description !== undefined) workspace.projects[userId][idx].description = description.trim();
    if (addCaseId && !workspace.projects[userId][idx].caseIds.includes(addCaseId)) {
      workspace.projects[userId][idx].caseIds.push(addCaseId);
    }
    if (removeCaseId) {
      workspace.projects[userId][idx].caseIds = workspace.projects[userId][idx].caseIds.filter((id) => id !== removeCaseId);
    }
    workspace.projects[userId][idx].updatedAt = new Date().toISOString();
    writeWorkspace(workspace);
    return res.status(200).json({ ok: true, project: workspace.projects[userId][idx] });
  }

  if (req.method === "DELETE") {
    const { projectId } = req.body;
    if (!projectId) return res.status(400).json({ error: "projectId required" });
    workspace.projects[userId] = workspace.projects[userId].filter((p) => p.id !== projectId);
    writeWorkspace(workspace);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
