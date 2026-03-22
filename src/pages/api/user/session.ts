import type { NextApiRequest, NextApiResponse } from "next";
import { getUserSession, readUsers } from "../../../lib/userSession";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getUserSession(req, res);
  if (!session.userId) {
    return res.status(401).json({ loggedIn: false });
  }
  // Refresh user data from file
  const users = readUsers();
  const user = users.find((u) => u.id === session.userId);
  if (!user) {
    await session.destroy();
    return res.status(401).json({ loggedIn: false });
  }
  return res.status(200).json({
    loggedIn: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization,
      alias: user.alias,
      country: user.country,
      bio: user.bio,
      foundingInvestigator: user.foundingInvestigator,
      foundingInvestigatorYear: user.foundingInvestigatorYear,
      createdAt: user.createdAt,
    },
  });
}
