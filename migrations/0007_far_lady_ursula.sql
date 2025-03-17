DROP INDEX "categories_id_unique";--> statement-breakpoint
DROP INDEX "categories_name_unique";--> statement-breakpoint
DROP INDEX "tasks_id_unique";--> statement-breakpoint
DROP INDEX "users_id_unique";--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
ALTER TABLE `categories` ALTER COLUMN "created_at" TO "created_at" text DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
CREATE UNIQUE INDEX `categories_id_unique` ON `categories` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `categories_name_unique` ON `categories` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `tasks_id_unique` ON `tasks` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_id_unique` ON `users` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
ALTER TABLE `categories` ALTER COLUMN "updated_at" TO "updated_at" text NOT NULL DEFAULT (CURRENT_TIMESTAMP);