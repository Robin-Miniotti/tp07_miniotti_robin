const { Sequelize } = require('sequelize');
const { DATABASE_URL, DB_SSL } = require('../config');

// Prefer a full DATABASE_URL but fall back to the assembled URL from config.js
const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    // If DB_SSL is truthy enable ssl. Some environments (local) may not need it.
    ssl: DB_SSL,
    native: true,
  },
  define: {
    timestamps: false,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.pollution = require("./pollution.model.js")(sequelize, Sequelize);
db.utilisateur = require('./utilisateur.model.js')(sequelize, Sequelize);

module.exports = db;
