CREATE TABLE `client` (
	`address` text NOT NULL,
	`port` text NOT NULL,
	`name` text DEFAULT 'unassigned' NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`last_heartbeat` text DEFAULT (CURRENT_TIMESTAMP),
	PRIMARY KEY(`address`, `port`)
);
--> statement-breakpoint
CREATE TABLE `config` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `connection_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`timestamp` text DEFAULT (CURRENT_TIMESTAMP),
	`address` text NOT NULL,
	`port` text NOT NULL,
	`handler_type` text,
	`handler_details` text,
	FOREIGN KEY (`address`) REFERENCES `client`(`address`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`port`) REFERENCES `client`(`port`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `swipe_log` (
	`timestamp` text DEFAULT (CURRENT_TIMESTAMP),
	`address` text NOT NULL,
	`port` text NOT NULL,
	`swipe_id` text,
	`is_allowed` integer,
	`reason` text,
	PRIMARY KEY(`address`, `port`, `swipe_id`, `timestamp`),
	FOREIGN KEY (`address`) REFERENCES `client`(`address`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`port`) REFERENCES `client`(`port`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`swipe_id`) REFERENCES `turtle`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `turtle` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text DEFAULT 'unassigned' NOT NULL,
	`enabled` integer DEFAULT false,
	`timestamp` text DEFAULT (CURRENT_TIMESTAMP)
);
