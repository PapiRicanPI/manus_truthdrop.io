import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "../../../lib/session";
import {
  getAllResearchers,
  updateResearcherRole,
  updateResearcherFoundingInvestigator,
} from "../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res);
  if (!session.isAdmin) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    const researchers = await getAllResearchers();
    const userList = researchers.map((r) => ({
      id: String(r.id),
      name: r.name,
      email: r.email,
      organization: r.organization || null,
      role: r.role,
      alias: r.alias || null,
      country: r.country || null,
      foundingInvestigator: r.foundingInvestigator === 1,
      foundingInvestigatorYear: r.foundingInvestigatorYear || null,
      createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
      hasLogin: true,
    }));
    return res.status(200).json({ users: userList });
  }

  // PATCH — update role or Founding Investigator status
  if (req.method === "PATCH") {
    const { id, role, foundingInvestigator, foundingInvestigatorYear } = req.body;
    const numId = parseInt(id, 10);
    if (!numId) return res.status(400).json({ error: "Invalid id" });

    if (role !== undefined) {
      const validRoles = ["observer", "researcher", "custodian", "admin"];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
      }
      await updateResearcherRole(numId, role);
    }

    if (foundingInvestigator !== undefined) {
      await updateResearcherFoundingInvestigator(
        numId,
        Boolean(foundingInvestigator),
        foundingInvestigatorYear ?? null
      );
    }

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
