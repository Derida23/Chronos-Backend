DROP INDEX "categories_category_id_unique";--> statement-breakpoint
DROP INDEX "categories_name_unique";--> statement-breakpoint
DROP INDEX "tasks_task_id_unique";--> statement-breakpoint
DROP INDEX "users_user_id_unique";--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
ALTER TABLE `categories` ALTER COLUMN "created_at" TO "created_at" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `categories_category_id_unique` ON `categories` (`category_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `categories_name_unique` ON `categories` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `tasks_task_id_unique` ON `tasks` (`task_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_user_id_unique` ON `users` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
ALTER TABLE `categories` ALTER COLUMN "updated_at" TO "updated_at" text NOT NULL;--> statement-breakpoint
ALTER TABLE `tasks` ALTER COLUMN "created_at" TO "created_at" text NOT NULL;--> statement-breakpoint
ALTER TABLE `tasks` ALTER COLUMN "updated_at" TO "updated_at" text NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ALTER COLUMN "created_at" TO "created_at" text NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ALTER COLUMN "updated_at" TO "updated_at" text NOT NULL;