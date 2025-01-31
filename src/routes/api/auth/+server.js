import {
    VITE_APP_NAME,
    VITE_JWT_SECRET,
    VITE_JWT_EXPIRATION
} from '$env/static/private';
import { json } from '@sveltejs/kit';
import { hashPassword, comparePassword } from '$lib/server/hash';
import { decodeToken } from '$lib/server/token';
import jwt from 'jsonwebtoken';
import model from '$lib/server/model/auth';

export async function POST({ cookies, request }) {
    const {
        email = '',
        password = '',
    } = await request.json() || {};

    try {
        const result = await model.getData(email);
        const match = result
            ? await comparePassword(password, result?.password)
            : false;

        if (!match) {
            return json({
                application: VITE_APP_NAME,
                message: 'Login failed, please try again!',
            }, {
                status: 401,
            });
        }

        const token = jwt.sign({
            id: result.id,
        },
            VITE_JWT_SECRET, {
            expiresIn: VITE_JWT_EXPIRATION ?? '1h',
        });

        const hours = parseInt(VITE_JWT_EXPIRATION) || 1;
        const maxAge = hours * 60 * 60;
        cookies.set('access_token', token, {
            path: '/',
            httpOnly: true,
            maxAge,
        });

        return json({
            application: VITE_APP_NAME,
            message: 'Login success.',
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
        email = '',
        password = '',
    } = await request.json() || {};

    try {
        const access_token = await cookies.get('access_token');
        const decoded_token = await decodeToken(access_token);
        const isUserPresent = await model.getData(decoded_token?.id);

        if (!isUserPresent)
            return json({
                application: VITE_APP_NAME,
                message: 'Error, application user data not found!',
            }, {
                status: 404,
            });

        const data = {
            email: email === '' ? null : email,
            password: password
                ? await hashPassword(password)
                : null,
        }
        const result = await model.editData(data, decoded_token.id);

        return json({
            application: VITE_APP_NAME,
            message: 'Edit login info success.',
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

export async function PUT({ request }) {
    const {
        email = '',
        password = '',
    } = await request.json() || {};

    try {
        const countUser = await model.getData();

        if (countUser)
            return json({
                application: VITE_APP_NAME,
                message: 'Permission denied, application user data already exists!',
            }, {
                status: 409,
            });

        const result = await model.createData({
            email,
            password: await hashPassword(password),
        });

        return json({
            application: VITE_APP_NAME,
            message: 'Create login info success.',
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

export async function DELETE({ cookies }) {
    try {
        cookies.delete('access_token', { path: '/', });

        return json({
            application: VITE_APP_NAME,
            message: 'Logout success.',
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
