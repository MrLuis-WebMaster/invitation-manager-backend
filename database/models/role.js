'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Role.belongsTo(models.User);
    }
  };
  Role.init({
    name: {
      type: DataTypes.ENUM('user', 'administrator', 'moderator', 'editor', 'analyst', 'customer_support', 'merchant'),
      allowNull: false,
      validate: {
        len: [1, 20]
      }
    },
  }, {
    sequelize,
    modelName: 'Role',
  });
  return Role;
};