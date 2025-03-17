PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text DEFAULT 'null'
);
--> statement-breakpoint
INSERT INTO `__new_categories`("id", "name", "created_at", "updated_at", "deleted_at") SELECT "id", "name", "created_at", "updated_at", "deleted_at" FROM `categories`;--> statement-breakpoint
DROP TABLE `categories`;--> statement-breakpoint
ALTER TABLE `__new_categories` RENAME TO `categories`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `categories_id_unique` ON `categories` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `categories_name_unique` ON `categories` (`name`);--> statement-breakpoint
CREATE TABLE `__new_tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`user_id` integer,
	`category_id` integer NOT NULL,
	`status` integer DEFAULT 1 NOT NULL,
	`label` integer DEFAULT 2 NOT NULL,
	`due_date` integer DEFAULT 'null',
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text DEFAULT 'null',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_tasks`("id", "title", "description", "user_id", "category_id", "status", "label", "due_date", "created_at", "updated_at", "deleted_at") SELECT "id", "title", "description", "user_id", "category_id", "status", "label", "due_date", "created_at", "updated_at", "deleted_at" FROM `tasks`;--> statement-breakpoint
DROP TABLE `tasks`;--> statement-breakpoint
ALTER TABLE `__new_tasks` RENAME TO `tasks`;--> statement-breakpoint
CREATE UNIQUE INDEX `tasks_id_unique` ON `tasks` (`id`);--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(100) NOT NULL,
	`email` text(255) NOT NULL,
	`password` text(255) NOT NULL,
	`role` text DEFAULT 'user' NOT NULL,
	`is_active` integer DEFAULT true,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text DEFAULT 'null'
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "name", "email", "password", "role", "is_active", "created_at", "updated_at", "deleted_at") SELECT "id", "name", "email", "password", "role", "is_active", "created_at", "updated_at", "deleted_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_id_unique` ON `users` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);