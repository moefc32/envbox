import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const Users = sqliteTable('Users', {
	id: text('id').primaryKey()
		.$defaultFn(() => sql`lower(hex(randomblob(16)))`),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
});

export const Envs = sqliteTable('Envs', {
	id: text('id').primaryKey().notNull(),
	title: text('title').notNull(),
	content: text('content'),
	timestamp: integer('timestamp').notNull(),
});
