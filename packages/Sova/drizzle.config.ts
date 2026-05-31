import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: '../DrizzleSchema/src/schema.ts',
  out: '../DrizzleSchema/src/migrations',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.PRIVATE_TURSO_DATABASE_URL!,
    authToken: process.env.PRIVATE_TURSO_AUTH_TOKEN!,
  },
});