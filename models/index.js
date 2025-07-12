// models/index.js
const { Sequelize } = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(config);

const models = {
  Paciente: require('./Paciente')(sequelize, Sequelize.DataTypes),
  Comorbidade: require('./Comorbidade')(sequelize, Sequelize.DataTypes),
  SinalVital: require('./SinalVital')(sequelize, Sequelize.DataTypes)
};

// Configure as associações
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = {
  sequelize,
  ...models
};