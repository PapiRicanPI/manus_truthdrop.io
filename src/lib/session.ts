import { getIronSession, IronSession, SessionOptions } from "iron-session";
import { IncomingMessage, ServerResponse } from "http";
import { NextApiRequest, NextApiResponse } from "next";

export interface SessionData {
  isAdmin: boolean;
  email?: string;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || "truthdrop-session-secret-change-in-production-32chars",
  cookieName: "truthdrop_admin_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8 hours
  },
};

export async function getSession(
  req: IncomingMessage | NextApiRequest,
  res: ServerResponse | NextApiResponse
): Promise<IronSession<SessionData>> {
  return getIronSession<SessionData>(req as IncomingMessage, res as ServerResponse, sessionOptions);
}
