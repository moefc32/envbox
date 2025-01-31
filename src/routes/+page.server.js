import { createHash } from "crypto";
import { decodeToken } from '$lib/server/token';
import model from '$lib/server/model/auth';

export async function load({ cookies }) {
    const access_token = await cookies.get('access_token');
    const decoded_token = await decodeToken(access_token);
    const isUserPresent = await model.getData(decoded_token?.id);

    const hashed_email = !!isUserPresent
        ? createHash("sha256")
            .update(isUserPresent?.email)
            .digest("hex")
        : null;

    return {
        access_token,
        is_registered: !!isUserPresent,
        hashed_email,
    };
}
