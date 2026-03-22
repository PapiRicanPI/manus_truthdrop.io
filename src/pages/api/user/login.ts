import type { NextApiRequest, NextApiResponse } from "next";
import { getUserSession, verifyUserPassword } from "../../../lib/userSession";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  const user = await verifyUserPassword(email, password);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password." });
  }
  const session = await getUserSession(req, res);
  session.userId = user.id;
  session.email = user.email;
  session.role = user.role;
  session.name = user.name;
  await session.save();
  return res.status(200).json({
    ok: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      alias: user.alias,
      foundingInvestigator: user.foundingInvestigator,
      foundingInvestigatorYear: user.foundingInvestigatorYear,
    },
  });
}
