import sqlite from './sqlite';
import { TABLE_AUTH, TABLE_ENV } from './model/tables';

export default function setSchema() {
    const queries = [
        `CREATE TABLE IF NOT EXISTS ${TABLE_AUTH} (
            id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        );`,
        `CREATE TABLE IF NOT EXISTS ${TABLE_ENV} (
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
