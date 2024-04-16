const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];  // Ensure this path is correct

// Initialize sequelize with the database configuration
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const db = {};

// Read all model files in the directory, initialize them, and add them to the db object
fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const modelFile = path.join(__dirname, file);
    const model = require(modelFile)(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Set up model associations if there are any
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Expose sequelize and Sequelize along with the models
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
