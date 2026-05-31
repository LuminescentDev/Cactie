import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { LeaveJoinMessageSetting } from './types';

// -------------------- Account --------------------
export const settings = sqliteTable('settings', {
  Id: text('Id').primaryKey(),
  LeaveJoinMessage: text('LeaveJoinMessage', { mode: 'json' })
    .$type<LeaveJoinMessageSetting>(),
});

export const schema = {
  settings,
};