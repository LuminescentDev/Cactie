import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

// -------------------- Account --------------------
export const settings = sqliteTable('settings', {
  Id: text('Id').primaryKey(),
});

export const schema = {
  settings,
};