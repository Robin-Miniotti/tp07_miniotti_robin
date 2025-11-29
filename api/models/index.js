const { Sequelize } = require('sequelize');
const { DATABASE_URL, DB_SSL } = require('../config');

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: DB_SSL ? {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    }
  } : {},
  define: {
    timestamps: false,
  },
});
