/**
 * Database helper for TruthDrop.io
 * Connects to the same persistent MySQL/TiDB database used by the vetting portal.
 * DATABASE_URL must be set in Vercel environment variables.
 */
import mysql from "mysql2/promise";

// ─── Researcher helpers ───────────────────────────────────────────────────────

export interface Researcher {
  id: number;
  vettingId: number | null;
  name: string;
  email: string;
  alias: string | null;
  country: string | null;
  bio: string | null;
  organization: string | null;
  passwordHash: string;
  role: "observer" | "researcher" | "custodian" | "admin";
  foundingInvestigator: number;
  foundingInvestigatorYear: number | null;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
}

export async function getResearcherByEmail(email: string): Promise<Researcher | null> {
  const db = await getRawConnection();
  if (!db) return null;
  const [rows] = await db.execute(
    "SELECT * FROM researchers WHERE email = ? LIMIT 1",
    [email]
  ) as [Researcher[], unknown];
  return rows[0] ?? null;
}

export async function getResearcherById(id: number): Promise<Researcher | null> {
  const db = await getRawConnection();
  if (!db) return null;
  const [rows] = await db.execute(
    "SELECT * FROM researchers WHERE id = ? LIMIT 1",
    [id]
  ) as [Researcher[], unknown];
  return rows[0] ?? null;
}

export async function getAllResearchers(): Promise<Researcher[]> {
  const db = await getRawConnection();
  if (!db) return [];
  const [rows] = await db.execute(
    "SELECT id, vettingId, name, email, alias, country, bio, organization, role, foundingInvestigator, foundingInvestigatorYear, createdAt, updatedAt, lastLoginAt FROM researchers ORDER BY createdAt DESC"
  ) as [Researcher[], unknown];
  return rows;
}

export async function updateResearcherRole(id: number, role: string): Promise<void> {
  const db = await getRawConnection();
  if (!db) return;
  await db.execute("UPDATE researchers SET role = ? WHERE id = ?", [role, id]);
}

export async function updateResearcherFoundingInvestigator(
  id: number,
  fi: boolean,
  year: number | null
): Promise<void> {
  const db = await getRawConnection();
  if (!db) return;
  await db.execute(
    "UPDATE researchers SET foundingInvestigator = ?, foundingInvestigatorYear = ? WHERE id = ?",
    [fi ? 1 : 0, year, id]
  );
}

export async function updateResearcherProfile(
  id: number,
  data: { alias?: string | null; country?: string | null; bio?: string | null }
): Promise<void> {
  const db = await getRawConnection();
  if (!db) return;
  const fields: string[] = [];
  const values: (string | number | null)[] = [];
  if (data.alias !== undefined) { fields.push("alias = ?"); values.push(data.alias); }
  if (data.country !== undefined) { fields.push("country = ?"); values.push(data.country); }
  if (data.bio !== undefined) { fields.push("bio = ?"); values.push(data.bio); }
  if (fields.length === 0) return;
  values.push(id);
  await db.execute(`UPDATE researchers SET ${fields.join(", ")} WHERE id = ?`, values);
}

export async function updateResearcherLastLogin(id: number): Promise<void> {
  const db = await getRawConnection();
  if (!db) return;
  await db.execute("UPDATE researchers SET lastLoginAt = NOW() WHERE id = ?", [id]);
}

export async function createResearcher(data: {
  vettingId?: number;
  name: string;
  email: string;
  organization?: string;
  passwordHash: string;
  role?: string;
}): Promise<number> {
  const db = await getRawConnection();
  if (!db) throw new Error("Database unavailable");
  const [result] = await db.execute(
    "INSERT INTO researchers (vettingId, name, email, organization, passwordHash, role) VALUES (?, ?, ?, ?, ?, ?)",
    [data.vettingId ?? null, data.name, data.email, data.organization ?? null, data.passwordHash, data.role ?? "observer"]
  ) as [{ insertId: number }, unknown];
  return result.insertId;
}

// ─── Bookmarks ────────────────────────────────────────────────────────────────

export async function getBookmarks(researcherId: number) {
  const db = await getRawConnection();
  if (!db) return [];
  const [rows] = await db.execute(
    "SELECT * FROM researcher_bookmarks WHERE researcherId = ? ORDER BY createdAt DESC",
    [researcherId]
  ) as [unknown[], unknown];
  return rows;
}

export async function addBookmark(researcherId: number, caseId: string, caseTitle: string) {
  const db = await getRawConnection();
  if (!db) return;
  await db.execute(
    "INSERT IGNORE INTO researcher_bookmarks (researcherId, caseId, caseTitle) VALUES (?, ?, ?)",
    [researcherId, caseId, caseTitle]
  );
}

export async function removeBookmark(researcherId: number, caseId: string) {
  const db = await getRawConnection();
  if (!db) return;
  await db.execute(
    "DELETE FROM researcher_bookmarks WHERE researcherId = ? AND caseId = ?",
    [researcherId, caseId]
  );
}

// ─── Notes ────────────────────────────────────────────────────────────────────

export async function getNote(researcherId: number, caseId: string) {
  const db = await getRawConnection();
  if (!db) return null;
  const [rows] = await db.execute(
    "SELECT * FROM researcher_notes WHERE researcherId = ? AND caseId = ? LIMIT 1",
    [researcherId, caseId]
  ) as [unknown[], unknown];
  return (rows as { note: string }[])[0] ?? null;
}

export async function upsertNote(researcherId: number, caseId: string, note: string) {
  const db = await getRawConnection();
  if (!db) return;
  await db.execute(
    `INSERT INTO researcher_notes (researcherId, caseId, note)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE note = VALUES(note), updatedAt = NOW()`,
    [researcherId, caseId, note]
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function getProjects(researcherId: number) {
  const db = await getRawConnection();
  if (!db) return [];
  const [rows] = await db.execute(
    "SELECT * FROM researcher_projects WHERE researcherId = ? ORDER BY updatedAt DESC",
    [researcherId]
  ) as [unknown[], unknown];
  return rows;
}

export async function createProject(researcherId: number, title: string, description: string) {
  const db = await getRawConnection();
  if (!db) return null;
  const [result] = await db.execute(
    "INSERT INTO researcher_projects (researcherId, title, description) VALUES (?, ?, ?)",
    [researcherId, title, description]
  ) as [{ insertId: number }, unknown];
  return result.insertId;
}

export async function updateProject(id: number, researcherId: number, data: { title?: string; description?: string; caseIds?: string[] }) {
  const db = await getRawConnection();
  if (!db) return;
  const fields: string[] = [];
  const values: (string | number | null)[] = [];
  if (data.title !== undefined) { fields.push("title = ?"); values.push(data.title); }
  if (data.description !== undefined) { fields.push("description = ?"); values.push(data.description); }
  if (data.caseIds !== undefined) { fields.push("caseIds = ?"); values.push(JSON.stringify(data.caseIds)); }
  if (fields.length === 0) return;
  values.push(id, researcherId);
  await db.execute(`UPDATE researcher_projects SET ${fields.join(", ")} WHERE id = ? AND researcherId = ?`, values);
}

export async function deleteProject(id: number, researcherId: number) {
  const db = await getRawConnection();
  if (!db) return;
  await db.execute("DELETE FROM researcher_projects WHERE id = ? AND researcherId = ?", [id, researcherId]);
}

// ─── Recently Viewed ──────────────────────────────────────────────────────────

export async function getRecentlyViewed(researcherId: number, limit = 20) {
  const db = await getRawConnection();
  if (!db) return [];
  const [rows] = await db.execute(
    "SELECT * FROM researcher_recently_viewed WHERE researcherId = ? ORDER BY viewedAt DESC LIMIT ?",
    [researcherId, limit]
  ) as [unknown[], unknown];
  return rows;
}

export async function recordView(researcherId: number, caseId: string, caseTitle: string) {
  const db = await getRawConnection();
  if (!db) return;
  // Delete existing entry for this case then re-insert (upsert by delete+insert)
  await db.execute(
    "DELETE FROM researcher_recently_viewed WHERE researcherId = ? AND caseId = ?",
    [researcherId, caseId]
  );
  await db.execute(
    "INSERT INTO researcher_recently_viewed (researcherId, caseId, caseTitle) VALUES (?, ?, ?)",
    [researcherId, caseId, caseTitle]
  );
  // Keep only last 20 entries
  await db.execute(
    `DELETE FROM researcher_recently_viewed WHERE researcherId = ? AND id NOT IN (
      SELECT id FROM (SELECT id FROM researcher_recently_viewed WHERE researcherId = ? ORDER BY viewedAt DESC LIMIT 20) t
    )`,
    [researcherId, researcherId]
  );
}

// ─── Connection pool ──────────────────────────────────────────────────────────

let _pool: mysql.Pool | null = null;

function parseDbUrl(url: string): mysql.PoolOptions {
  // Strip the ssl={...} query param that TiDB appends — mysql2 doesn't parse it
  const cleanUrl = url.replace(/[?&]ssl=\{[^}]*\}/, "");
  try {
    const u = new URL(cleanUrl);
    return {
      host: u.hostname,
      port: u.port ? parseInt(u.port, 10) : 4000,
      user: decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
      database: u.pathname.replace(/^\//, ""),
      ssl: { rejectUnauthorized: true },
      waitForConnections: true,
      connectionLimit: 5,
      connectTimeout: 10000,
    };
  } catch {
    // Fallback: pass the cleaned URL directly
    return { uri: cleanUrl, ssl: { rejectUnauthorized: true }, connectionLimit: 5 } as unknown as mysql.PoolOptions;
  }
}

async function getRawConnection(): Promise<mysql.Pool | null> {
  if (_pool) return _pool;
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("[TruthDrop DB] DATABASE_URL not set");
    return null;
  }
  try {
    _pool = mysql.createPool(parseDbUrl(url));
    return _pool;
  } catch (err) {
    console.error("[TruthDrop DB] Pool creation failed:", err);
    return null;
  }
}
