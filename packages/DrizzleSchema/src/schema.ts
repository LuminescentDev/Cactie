import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { LeaveJoinMessageSetting } from './types';

// -------------------- Settings --------------------
export const settings = sqliteTable('settings', {
  Id: text('Id').primaryKey(),
  LeaveJoinMessage: text('LeaveJoinMessage', { mode: 'json' })
    .$type<LeaveJoinMessageSetting>(),
});

// -------------------- Sessions --------------------
export const sessions = sqliteTable('sessions', {
  sessionId: text('session_id').primaryKey(),
  discordId: text('discord_id').notNull(),
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  scope: text('scope').notNull(),
  pfp: text('pfp'),
  accent: text('accent'),
});

export const schema = {
  settings,
  sessions
};