import { v4 as uuidv4 } from 'uuid';
import sqlite from '../sqlite';
import { TABLE_ENV } from './tables';

export default {
    searchData: async (keyword) => {
        try {
            const search = `%${keyword}%`;

            const result = sqlite(`
                SELECT
                    id,
                    title,
                    content,
                    timestamp
                FROM ${TABLE_ENV}
                WHERE LOWER(title) LIKE LOWER(?)
                OR LOWER(content) LIKE LOWER(?);
            `, [search, search]);

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when getting data!');
        }
    },
    getData: async (id) => {
        try {
            const result = !id
                ? sqlite(`
                    SELECT
                        id,
                        title
                    FROM ${TABLE_ENV}
                    ORDER BY timestamp DESC;
                `)
                : sqlite(`
                    SELECT
                        id,
                        title,
                        content,
                        timestamp
                    FROM ${TABLE_ENV}
                    WHERE id = ?;
                `, [id]);

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when getting data!');
        }
    },
    createData: async (data) => {
        try {
            const timestamp = Date.now();
            const id = uuidv4();

            const result = sqlite(`
                INSERT INTO ${TABLE_ENV} (
                    id,
                    title,
                    content,
                    timestamp
                ) VALUES (?, ?, ?, ?);
            `, [
                id,
                data.title,
                data.content,
                timestamp
            ]);

            return {
                column: {
                    id,
                    title: data.title,
                    content: data.content,
                    timestamp,
                },
                ...result,
            };
        } catch (e) {
            console.error(e);
            throw new Error('Error when creating data!');
        }
    },
    editData: async (data, id) => {
        try {
            const timestamp = Date.now();

            const result = sqlite(`
                UPDATE ${TABLE_ENV} SET
                    title     = COALESCE(?, title),
                    content   = COALESCE(?, content),
                    timestamp = ?
                WHERE id = ?;
            `, [
                data.title || null,
                data.content || null,
                timestamp,
                id
            ]);

            return {
                column: {
                    id,
                    title: data.title,
                    content: data.content,
                    timestamp,
                },
                ...result,
            };
        } catch (e) {
            console.error(e);
            throw new Error('Error when editing data!');
        }
    },
    deleteData: async (id) => {
        try {
            const result = sqlite(`
                DELETE FROM ${TABLE_ENV}
                WHERE id = ?;
            `, [id]);

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when deleting data!');
        }
    },
}
