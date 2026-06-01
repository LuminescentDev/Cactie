CREATE TABLE `sessions` (
	`session_id` text PRIMARY KEY NOT NULL,
	`discord_id` text NOT NULL,
	`access_token` text NOT NULL,
	`refresh_token` text NOT NULL,
	`expires_at` integer NOT NULL,
	`scope` text NOT NULL,
	`pfp` text,
	`accent` text
);
