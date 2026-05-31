import { schema } from '~drizzle/schema';
export * from '~drizzle/schema';

import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

function tursoDb(url: string, authToken: string) {
  const client = createClient({
    url,
    authToken,
  });

  return drizzle(client, { schema });
}

export const db = tursoDb(
  process.env.PRIVATE_TURSO_DATABASE_URL!,
  process.env.PRIVATE_TURSO_AUTH_TOKEN!,
);