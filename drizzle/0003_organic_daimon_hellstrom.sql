CREATE TABLE `analyticsEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`eventType` varchar(100) NOT NULL,
	`eventName` varchar(255) NOT NULL,
	`page` varchar(255) NOT NULL,
	`metadata` text,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `analyticsEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pageEngagement` (
	`id` int AUTO_INCREMENT NOT NULL,
	`page` varchar(255) NOT NULL,
	`totalViews` int NOT NULL DEFAULT 0,
	`uniqueVisitors` int NOT NULL DEFAULT 0,
	`avgTimeOnPage` int NOT NULL DEFAULT 0,
	`bounceRate` int NOT NULL DEFAULT 0,
	`lastUpdated` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pageEngagement_id` PRIMARY KEY(`id`),
	CONSTRAINT `pageEngagement_page_unique` UNIQUE(`page`)
);
--> statement-breakpoint
CREATE TABLE `pageViews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`page` varchar(255) NOT NULL,
	`referrer` varchar(255),
	`userAgent` text,
	`ipHash` varchar(64),
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pageViews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`startTime` timestamp NOT NULL DEFAULT (now()),
	`endTime` timestamp,
	`duration` int,
	`pageCount` int NOT NULL DEFAULT 0,
	`eventCount` int NOT NULL DEFAULT 0,
	`referrer` varchar(255),
	`userAgent` text,
	`ipHash` varchar(64),
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `sessions_sessionId_unique` UNIQUE(`sessionId`)
);
