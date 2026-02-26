import { sql } from 'drizzle-orm';
import { db } from '../db/drizzle';

export default async function setSchema() {
    await db.run(sql`
        CREATE TABLE IF NOT EXISTS auth (
            id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
    `);

    await db.run(sql`
        CREATE TABLE IF NOT EXISTS env (
            id TEXT PRIMARY KEY NOT NULL,
            title TEXT NOT NULL,
            content TEXT,
            timestamp INTEGER NOT NULL
        )
    `);
}
