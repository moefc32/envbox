import sqlite from '../sqlite';
import { TABLE_ENV } from './tables';

export default {
    getData: async (id) => {
        try {
            const result = sqlite(`
                SELECT * FROM ${TABLE_ENV}
                ${data ? 'WHERE id = ?' : ''};
            `, id ? [id] : []);

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when getting data!');
        }
    },
    createData: async (data) => {
        try {
            const timestamp = Date.now();

            const result = sqlite(`
                INSERT INTO ${TABLE_ENV} (
                    title,
                    content,
                    timestamp
                ) VALUES (?, ?, ?);
            `, [
                data.title,
                data.content,
                timestamp
            ]);

            return result;
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

            return result;
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
