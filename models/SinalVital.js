module.exports = (sequelize, DataTypes) => {
  const SinalVital = sequelize.define('SinalVital', {
    pressao: DataTypes.STRING,
    glicemia: DataTypes.FLOAT,
    peso: DataTypes.FLOAT,
    altura: DataTypes.FLOAT,
  }, {
    timestamps: true,
    underscored: true,
  });

  SinalVital.associate = (models) => {
    SinalVital.belongsTo(models.Paciente, { foreignKey: 'paciente_id' });
  };

  return SinalVital;
};