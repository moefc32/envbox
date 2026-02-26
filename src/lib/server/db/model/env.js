import { init as cuid2 } from '@paralleldrive/cuid2';
import { eq, or, like, sql, desc } from 'drizzle-orm';
import { db } from '../drizzle';
import { env } from '../schema';

export default {
    searchData: async (keyword) => {
        try {
            const search = `%${keyword}%`;

            const result = await db
                .select({
                    id: env.id,
                    title: env.title,
                    content: env.content,
                    timestamp: env.timestamp,
                })
                .from(env)
                .where(
                    or(
                        like(sql`lower(${env.title})`, search.toLowerCase()),
                        like(sql`lower(${env.content})`, search.toLowerCase())
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
                        id: env.id,
                        title: env.title,
                        timestamp: env.timestamp,
                    })
                    .from(env)
                    .orderBy(desc(env.timestamp))
                : await db
                    .select({
                        id: env.id,
                        title: env.title,
                        content: env.content,
                        timestamp: env.timestamp,
                    })
                    .from(env)
                    .where(eq(env.id, id));

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
                .insert(env)
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
                .update(env)
                .set({
                    ...(data.title !== undefined && { title: data.title }),
                    ...(data.content !== undefined && { content: data.content }),
                    timestamp,
                })
                .where(eq(env.id, id));

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
                .delete(env)
                .where(eq(env.id, id));

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when deleting data!');
        }
    },
}
