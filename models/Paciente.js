module.exports = (sequelize, DataTypes) => {
  const Paciente = sequelize.define('Paciente', {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'O nome do paciente é obrigatório'
        },
        len: {
          args: [3, 100],
          msg: 'O nome deve ter entre 3 e 100 caracteres'
        }
      }
    },
    idade: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: {
          msg: 'A idade deve ser um número inteiro'
        },
        min: {
          args: [0],
          msg: 'A idade não pode ser negativa'
        },
        max: {
          args: [120],
          msg: 'Idade máxima permitida é 120 anos'
        }
      }
    },
    sexo: {
      type: DataTypes.STRING(1),
      validate: {
        isIn: {
          args: [['M', 'F', 'O']],
          msg: 'Sexo deve ser M (Masculino), F (Feminino) ou O (Outro)'
        }
      }
    },
    cpf: {
      type: DataTypes.STRING(11),
      unique: {
        msg: 'CPF já cadastrado'
      },
      allowNull: false,
      validate: {
        len: {
          args: [11, 11],
          msg: 'CPF deve ter exatamente 11 dígitos'
        },
        isNumeric: {
          msg: 'CPF deve conter apenas números'
        }
      }
    }
  }, {
    timestamps: true,
    underscored: true,
    paranoid: true, // Adiciona deletedAt para exclusão lógica
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt']
      }
    },
    scopes: {
      comComorbidades: {
        include: [{
          association: 'Comorbidades',
          through: { attributes: [] }
        }]
      },
      comSinaisVitais: {
        include: ['SinaisVitais']
      }
    }
  });

  // Associações
  Paciente.associate = (models) => {
    Paciente.belongsToMany(models.Comorbidade, {
      through: 'paciente_comorbidades',
      foreignKey: 'paciente_id',
      as: 'Comorbidades',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    
    Paciente.hasMany(models.SinalVital, {
      foreignKey: 'paciente_id',
      as: 'SinaisVitais'
    });
  };

  // Hooks (opcional)
  Paciente.beforeCreate(async (paciente) => {
    // Validações adicionais podem ser adicionadas aqui
  });

  // Métodos de instância (opcional)
  Paciente.prototype.getInfo = function() {
    return `${this.nome} (${this.idade} anos) - CPF: ${this.cpf}`;
  };

  return Paciente;
};