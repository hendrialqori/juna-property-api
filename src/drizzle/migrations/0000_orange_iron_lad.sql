CREATE TABLE `properties` (
	`id` varchar(16) NOT NULL,
	`type` int NOT NULL,
	`price` int NOT NULL,
	`tumbnail_url` text NOT NULL,
	`view_url` text NOT NULL,
	`description` text NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `properties_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(16) NOT NULL,
	`username` varchar(225) NOT NULL,
	`password` varchar(225) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
