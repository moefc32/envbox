import { VITE_APP_NAME } from '$env/static/private';
import { json } from '@sveltejs/kit';
import model from '$lib/server/model/env';

function trimText(text) {
    return text.trim().replace(/\n+$/, '');
}

export async function GET({ url }) {
    const id = url.searchParams.get('id');
    const search = url.searchParams.get('s');

    try {
        const result = search
            ? await model.searchData(search)
            : await model.getData(id);

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

export async function POST({ request }) {
    const {
        title = '',
        content = '',
    } = await request.json() || {};

    try {
        const result = await model.createData({
            title: trimText(title),
            content: trimText(content) + '\n'
        });

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

export async function PATCH({ url, request }) {
    const id = url.searchParams.get('id');
    const {
        title = '',
        content = '',
    } = await request.json() || {};

    try {
        const result = await model.editData({
            title: trimText(title),
            content: trimText(content) + '\n'
        }, id);

        return json({
            application: VITE_APP_NAME,
            message: 'Edit data success.',
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

export async function DELETE({ url }) {
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
