import { schema } from '@sova/drizzle-schema';

import { server$, type RequestEventBase } from '@qwik.dev/router';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient, type Client } from '@libsql/client';

export const tursoDb = server$(function (requestEvent?: RequestEventBase) {
  const client = tursoClient(requestEvent ?? this);

  return drizzle(client, { schema });
});

export function tursoClient(requestEvent: RequestEventBase): Client {
  const url = requestEvent.env.get('PRIVATE_TURSO_DATABASE_URL')?.trim();
  if (url === undefined) {
    throw new Error('PRIVATE_TURSO_DATABASE_URL is not defined');
  }

  const authToken = requestEvent.env.get('PRIVATE_TURSO_AUTH_TOKEN')?.trim();
  if (authToken === undefined) {
    if (!url.includes('file:')) {
      throw new Error('PRIVATE_TURSO_AUTH_TOKEN is not defined');
    }
  }

  return createClient({
    url,
    authToken,
  });
}