
import { routeLoader$ } from '@qwik.dev/router';
import type { RequestEventBase } from '@qwik.dev/router';
import { sessions, tursoDb } from '~/utils/drizzle';
import { eq } from 'drizzle-orm';

export const useSession = routeLoader$(async (requestEvent) => {
  return await getSession(requestEvent);
});

export default async function getSession(requestEvent: RequestEventBase) {
  const sid = requestEvent.cookie.get('sessionid')?.value;
  if (!sid) return null;

  const session = await tursoDb(requestEvent)
    .select()
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
}