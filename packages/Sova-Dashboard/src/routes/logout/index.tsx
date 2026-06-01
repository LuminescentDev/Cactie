import type { RequestHandler } from '@qwik.dev/router';
import { eq } from 'drizzle-orm/sql/expressions/conditions';
import { sessions, tursoDb } from '~/utils/drizzle';
import getSession from '../plugin@auth';

export const onGet: RequestHandler = async (requestEvent) => {
  const { redirect, cookie } = requestEvent;
  const session = await getSession(requestEvent);

  if (session) {
    await tursoDb(requestEvent)
      .delete(sessions)
      .where(
        eq(sessions.sessionId, session.sessionId),
      );
    cookie.delete('sessionid', { path: '/' });
  }

  throw redirect(302, '/');
};