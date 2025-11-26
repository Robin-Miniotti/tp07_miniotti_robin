// Configuration driven by environment variables so the API can run locally
// while still defaulting to the Render Postgres instance used in production.
module.exports = {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'EMMA123',
    // You can provide a full DATABASE_URL (recommended) or individual parts below.
    DATABASE_URL:
        process.env.DATABASE_URL ||
        `postgres://${process.env.DB_USER || 'pollutions_user'}:${process.env.DB_PASSWORD || 'QH0JXIr9G2qgqtY08nw42gKxrSS8Qms5'}@${process.env.DB_HOST || 'dpg-d4jf8815pdvs739dgi3g-a.oregon-postgres.render.com'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'pollutions_9hwr'}`,
    DB_SSL: process.env.DB_SSL === 'true' || true,
};

//postgresql://pollutions_user:QH0JXIr9G2qgqtY08nw42gKxrSS8Qms5@dpg-d4jf8815pdvs739dgi3g-a.oregon-postgres.render.com/pollutions_9hwr