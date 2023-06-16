'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Template extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Template.belongsTo(models.User);
      Template.belongsTo(models.Event);
      Template.hasOne(models.EventTemplate);
    }
  }
  Template.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    html: DataTypes.TEXT,
    css: DataTypes.TEXT,
    js: DataTypes.TEXT,
    previewImage: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Template',
  });
  return Template;
};