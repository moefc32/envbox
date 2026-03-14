import { init as cuid2 } from '@paralleldrive/cuid2';
import { eq, or, like, sql, desc } from 'drizzle-orm';
import { db } from '../drizzle';
import { Envs } from '../schema';

export default {
    searchData: async (keyword) => {
        try {
            const search = `%${keyword}%`;

            const result = await db
                .select({
                    id: Envs.id,
                    title: Envs.title,
                    content: Envs.content,
                    timestamp: Envs.timestamp,
                })
                .from(Envs)
                .where(
                    or(
                        like(sql`lower(${Envs.title})`, search.toLowerCase()),
                        like(sql`lower(${Envs.content})`, search.toLowerCase())
                    )
                );

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when getting data!');
        }
    },
    getData: async (id) => {
        try {
            const result = !id
                ? await db
                    .select({
                        id: Envs.id,
                        title: Envs.title,
                        timestamp: Envs.timestamp,
                    })
                    .from(Envs)
                    .orderBy(desc(Envs.timestamp))
                : await db
                    .select({
                        id: Envs.id,
                        title: Envs.title,
                        content: Envs.content,
                        timestamp: Envs.timestamp,
                    })
                    .from(Envs)
                    .where(eq(Envs.id, id));

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when getting data!');
        }
    },
    createData: async (data) => {
        try {
            const timestamp = Date.now();
            const cuid = cuid2({ length: 12 })();

            const result = await db
                .insert(Envs)
                .values({
                    id: cuid,
                    title: data.title,
                    content: data.content,
                    timestamp,
                });

            return {
                column: {
                    id: cuid,
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

            const result = await db
                .update(Envs)
                .set({
                    ...(data.title !== undefined && { title: data.title }),
                    ...(data.content !== undefined && { content: data.content }),
                    timestamp,
                })
                .where(eq(Envs.id, id));

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
            const result = await db
                .delete(Envs)
                .where(eq(Envs.id, id));

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when deleting data!');
        }
    },
}
