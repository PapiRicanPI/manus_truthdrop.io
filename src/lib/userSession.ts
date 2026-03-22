import { getIronSession, IronSession, SessionOptions } from "iron-session";
import { IncomingMessage, ServerResponse } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export const USERS_FILE = path.join("/tmp", "truthdrop_users.json");
export const WORKSPACE_FILE = path.join("/tmp", "truthdrop_workspace.json");

export interface TruthDropUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string; // observer | researcher | custodian | admin
  organization: string | null;
  // Extended profile fields
  alias: string | null;
  country: string | null;
  bio: string | null;
  // Founding Investigator
  foundingInvestigator: boolean;
  foundingInvestigatorYear: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserSessionData {
  userId?: string;
  email?: string;
  role?: string;
  name?: string;
}

export interface WorkspaceData {
  bookmarks: Record<string, string[]>; // userId -> caseId[]
  notes: Record<string, Record<string, string>>; // userId -> { caseId: note }
  projects: Record<string, Project[]>; // userId -> Project[]
  recentlyViewed: Record<string, RecentItem[]>; // userId -> RecentItem[]
  savedSearches: Record<string, SavedSearch[]>; // userId -> SavedSearch[]
}

export interface Project {
  id: string;
  name: string;
  description: string;
  caseIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RecentItem {
  caseId: string;
  caseTitle: string;
  viewedAt: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: Record<string, string>;
  createdAt: string;
  lastChecked: string;
}

export const userSessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || "truthdrop-user-session-secret-change-in-production-32chars",
  cookieName: "truthdrop_user_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

export async function getUserSession(
  req: IncomingMessage | NextApiRequest,
  res: ServerResponse | NextApiResponse
): Promise<IronSession<UserSessionData>> {
  return getIronSession<UserSessionData>(req as IncomingMessage, res as ServerResponse, userSessionOptions);
}

export function readUsers(): TruthDropUser[] {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const raw = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
      // Migrate old user records that don't have new fields
      return raw.map((u: Partial<TruthDropUser>) => ({
        alias: null,
        country: null,
        bio: null,
        foundingInvestigator: false,
        foundingInvestigatorYear: null,
        updatedAt: u.createdAt || new Date().toISOString(),
        ...u,
      }));
    }
  } catch {}
  return [];
}

export function writeUsers(users: TruthDropUser[]): void {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

export function readWorkspace(): WorkspaceData {
  try {
    if (fs.existsSync(WORKSPACE_FILE)) {
      return JSON.parse(fs.readFileSync(WORKSPACE_FILE, "utf-8"));
    }
  } catch {}
  return { bookmarks: {}, notes: {}, projects: {}, recentlyViewed: {}, savedSearches: {} };
}

export function writeWorkspace(data: WorkspaceData): void {
  fs.writeFileSync(WORKSPACE_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function verifyUserPassword(email: string, password: string): Promise<TruthDropUser | null> {
  const users = readUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  return valid ? user : null;
}
