import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "../../../lib/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res);
  if (session.isAdmin) {
    return res.status(200).json({ isAdmin: true, email: session.email });
  }
  return res.status(401).json({ isAdmin: false });
}
