
import { routeLoader$, server$ } from '@qwik.dev/router';
import type { RequestEventBase } from '@qwik.dev/router';
import { tursoDb } from '~/utils/drizzle';
import { sessions } from '@sova/drizzle-schema';
import { eq } from 'drizzle-orm';

export const useSession = routeLoader$(async (requestEvent) => {
  return await getSession(requestEvent);
});

export const getSession = server$(async function getSession(requestEvent?: RequestEventBase) {
  requestEvent = requestEvent ?? this;
  const sid = requestEvent.cookie.get('sessionid')?.value;
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

  return {
    sessionId: session.sessionId,
    discordId: session.discordId,
    pfp: session.pfp,
    accent: session.accent,
  };
});