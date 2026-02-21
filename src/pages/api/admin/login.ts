import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "../../../lib/session";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "tainorican2n@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  if (!ADMIN_PASSWORD) {
    return res.status(500).json({ error: "ADMIN_PASSWORD environment variable is not set." });
  }

  if (
    email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase() &&
    password === ADMIN_PASSWORD
  ) {
    const session = await getSession(req, res);
    session.isAdmin = true;
    session.email = ADMIN_EMAIL;
    await session.save();
    return res.status(200).json({ ok: true });
  }

  return res.status(401).json({ error: "Invalid email or password." });
}
