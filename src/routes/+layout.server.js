export async function load({ locals }) {
    const routes = {
        publicRoutes: locals.publicRoutes,
        unauthRoutes: locals.unauthRoutes,
    };

    return { ...routes };
}
