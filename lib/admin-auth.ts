import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
// Backend that issues/validates user tokens (frontend and API are on different hosts).
const BACKEND_URL = process.env.BACKEND_API_URL || 'https://watchpulse.info';

/**
 * Verifies that the caller is an ADMIN.
 *
 * The backend access token only carries { id, type: 'access' } — it is handed to
 * EVERY logged-in user, so a valid signature alone does NOT prove admin rights.
 * We therefore:
 *   1) verify the signature + type locally (cheap reject of forged/expired tokens),
 *   2) ask the backend /api/auth/me who the token belongs to and require an
 *      admin / super_admin role.
 *
 * There is intentionally NO static shared-key bypass: a leaked constant would be a
 * permanent admin backdoor.
 */
export async function verifyAdminAuth(token: string): Promise<boolean> {
  if (!token || !JWT_SECRET) return false;

  // 1) Signature + type check — avoids a backend round-trip for junk tokens.
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id?: string; type?: string };
    if (decoded.type !== 'access' || !decoded.id) return false;
  } catch {
    return false;
  }

  // 2) Role check against the backend (authoritative source of the user's role).
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return false;
    const data = await res.json();
    const role = data?.user?.role;
    return role === 'admin' || role === 'super_admin';
  } catch {
    return false;
  }
}
