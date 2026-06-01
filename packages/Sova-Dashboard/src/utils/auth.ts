import { RequestEventBase } from '@qwik.dev/router';
import { tursoDb } from './drizzle';
import { sessions } from '@sova/drizzle-schema';
import { eq } from 'drizzle-orm';

export async function getSessionFn(requestEvent: RequestEventBase) {
  const { cookie } = requestEvent;
  const sid = cookie.get('sessionid')?.value;
  if (!sid) return null;

  const db = await tursoDb(requestEvent);
  const session = await db.select()
    .from(sessions)
    .where(
      eq(sessions.sessionId, sid),
    )
    .get();

  if (!session) {
    return null;
  }

  // optional: check expiry
  if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
    return null;
  }

  return session;
};
