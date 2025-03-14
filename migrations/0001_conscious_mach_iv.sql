ALTER TABLE `categories` ADD `created_at` integer DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `categories` ADD `updated_at` integer DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `categories` ADD `deleted_at` integer DEFAULT 'null';