import { schema } from '@sova/drizzle-schema';
export * from '@sova/drizzle-schema';

import type { RequestEventBase } from '@qwik.dev/router';
import { drizzle } from 'drizzle-orm/libsql';
import { tursoClient } from './turso';

export function tursoDb(requestEvent: RequestEventBase) {
  const client = tursoClient(requestEvent);

  return drizzle(client, { schema });
}