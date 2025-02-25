import sqlite from './sqlite';

export default function setSchema() {
    const queries = [`
        CREATE TABLE IF NOT EXISTS auth (
            id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        );`,
        `CREATE TABLE IF NOT EXISTS env (
            id TEXT PRIMARY KEY NOT NULL,
            title TEXT NOT NULL,
            content TEXT,
            timestamp INTEGER NOT NULL
        );`,
    ];

    for (const query of queries) {
        sqlite(query);
    }
}
