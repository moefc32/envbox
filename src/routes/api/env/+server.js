import { VITE_APP_NAME } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { decodeToken } from '$lib/server/token';
import model from '$lib/server/model/env';

export async function GET({ cookies, url }) {
    const id = url.searchParams.get('id');

    try {
        const result = await model.getData(id);

        return json({
            application: VITE_APP_NAME,
            message: !result.length
                ? 'No data found.'
                : `Get ${id ? 'data' : 'all data'} success.`,
            data: result,
        });
    } catch (e) {
        console.error(e);

        return json({
            application: VITE_APP_NAME,
            message: e,
        }, {
            status: 500,
        });
    }
}

export async function POST({ cookies, request }) {
    const {
        title = '',
        content = '',
    } = await request.json() || {};

    try {
        const result = await model.createData({ title, content });

        return json({
            application: VITE_APP_NAME,
            message: 'Create new data success.',
            data: result,
        });
    } catch (e) {
        console.error(e);

        return json({
            application: VITE_APP_NAME,
            message: e,
        }, {
            status: 500,
        });
    }
}

export async function PATCH({ cookies, request }) {
    const {
        title = '',
        content = '',
    } = await request.json() || {};

    try {
        const result = await model.editData({ title, content });

        return json({
            application: VITE_APP_NAME,
            message: 'Create new data success.',
            data: result,
        });
    } catch (e) {
        console.error(e);

        return json({
            application: VITE_APP_NAME,
            message: e,
        }, {
            status: 500,
        });
    }
}

export async function DELETE({ cookies, url }) {
    const id = url.searchParams.get('id');

    try {
        const result = await model.deleteData(id);

        return json({
            application: VITE_APP_NAME,
            message: 'Delete data success.',
        });
    } catch (e) {
        console.error(e);

        return json({
            application: VITE_APP_NAME,
            message: e,
        }, {
            status: 500,
        });
    }
}
