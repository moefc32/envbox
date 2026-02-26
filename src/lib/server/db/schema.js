import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const auth = sqliteTable('auth', {
	id: text('id')
		.primaryKey()
		.default(sql`lower(hex(randomblob(16)))`),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
});

export const env = sqliteTable('env', {
	id: text('id')
		.primaryKey()
		.notNull(),
	title: text('title').notNull(),
	content: text('content'),
	timestamp: integer('timestamp').notNull(),
});
