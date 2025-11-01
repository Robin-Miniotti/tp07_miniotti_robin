// Configuration driven by environment variables so the API can run locally
// while still defaulting to the Render Postgres instance used in production.
module.exports = {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'EMMA123',
    // You can provide a full DATABASE_URL (recommended) or individual parts below.
    DATABASE_URL:
        process.env.DATABASE_URL ||
        `postgres://${process.env.DB_USER || 'pollutions_user'}:${process.env.DB_PASSWORD || '1X9lkb5069FJKU7ZgfcIM31hwaA9n9LP'}@${process.env.DB_HOST || 'dpg-d41mvac9c44c73d0019g-a.oregon-postgres.render.com'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'pollutions'}`,
    DB_SSL: process.env.DB_SSL === 'true' || true,
};

