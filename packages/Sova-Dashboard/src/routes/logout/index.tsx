import type { RequestHandler } from '@qwik.dev/router';
import { eq } from 'drizzle-orm/sql/expressions/conditions';
import { tursoDb } from '~/utils/drizzle';
import { sessions } from '@sova/drizzle-schema';
import { getSession } from '../plugin@auth';

export const onGet: RequestHandler = async (requestEvent) => {
  const { redirect, cookie } = requestEvent;
  const session = await getSession();

  if (session) {
    const db = await tursoDb(requestEvent);
    await db.delete(sessions)
      .where(
        eq(sessions.sessionId, session.sessionId),
      );
    cookie.delete('sessionid', { path: '/' });
  }

  throw redirect(302, '/');
};