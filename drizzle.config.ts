import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.PRIVATE_TURSO_DATABASE_URL!,
    authToken: process.env.PRIVATE_TURSO_AUTH_TOKEN!,
  },
});