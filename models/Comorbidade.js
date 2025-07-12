module.exports = (sequelize, DataTypes) => {
  const Comorbidade = sequelize.define('Comorbidade', {
    nome: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    }
  }, {
    timestamps: false // Não precisa de createdAt/updatedAt
  });

  Comorbidade.associate = (models) => {
    Comorbidade.belongsToMany(models.Paciente, {
      through: 'paciente_comorbidades',
      foreignKey: 'comorbidade_id'
    });
  };

  return Comorbidade;
};