import { getIronSession, IronSession, SessionOptions } from "iron-session";
import { IncomingMessage, ServerResponse } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { getResearcherByEmail, Researcher } from "./db";

// Legacy constants kept for any imports that reference them (no longer used for file I/O)
export const USERS_FILE = "/tmp/truthdrop_users.json";
export const WORKSPACE_FILE = "/tmp/truthdrop_workspace.json";

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

function researcherToUser(r: Researcher): TruthDropUser {
  return {
    id: String(r.id),
    name: r.name,
    email: r.email,
    passwordHash: r.passwordHash,
    role: r.role,
    organization: r.organization ?? null,
    alias: r.alias ?? null,
    country: r.country ?? null,
    bio: r.bio ?? null,
    foundingInvestigator: r.foundingInvestigator === 1,
    foundingInvestigatorYear: r.foundingInvestigatorYear ?? null,
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
    updatedAt: r.updatedAt instanceof Date ? r.updatedAt.toISOString() : String(r.updatedAt),
  };
}

// Legacy stubs — kept so existing imports don't break, but data is now in the DB
export function readUsers(): TruthDropUser[] { return []; }
export function writeUsers(_users: TruthDropUser[]): void { /* no-op: use DB */ }
export function readWorkspace(): WorkspaceData {
  return { bookmarks: {}, notes: {}, projects: {}, recentlyViewed: {}, savedSearches: {} };
}
export function writeWorkspace(_data: WorkspaceData): void { /* no-op: use DB */ }

export async function verifyUserPassword(email: string, password: string): Promise<TruthDropUser | null> {
  const researcher = await getResearcherByEmail(email);
  if (!researcher) return null;
  const valid = await bcrypt.compare(password, researcher.passwordHash);
  if (!valid) return null;
  return researcherToUser(researcher);
}
