import type { NextApiRequest, NextApiResponse } from "next";
import { getUserSession } from "../../../lib/userSession";
import { getResearcherById } from "../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getUserSession(req, res);
  if (!session.userId) {
    return res.status(401).json({ loggedIn: false });
  }
  // Refresh user data from database
  const researcher = await getResearcherById(parseInt(session.userId, 10));
  if (!researcher) {
    await session.destroy();
    return res.status(401).json({ loggedIn: false });
  }
  return res.status(200).json({
    loggedIn: true,
    user: {
      id: String(researcher.id),
      name: researcher.name,
      email: researcher.email,
      role: researcher.role,
      organization: researcher.organization ?? null,
      alias: researcher.alias ?? null,
      country: researcher.country ?? null,
      bio: researcher.bio ?? null,
      foundingInvestigator: researcher.foundingInvestigator === 1,
      foundingInvestigatorYear: researcher.foundingInvestigatorYear ?? null,
      createdAt: researcher.createdAt instanceof Date ? researcher.createdAt.toISOString() : String(researcher.createdAt),
    },
  });
}
