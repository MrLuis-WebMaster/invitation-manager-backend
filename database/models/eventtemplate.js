'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EventTemplate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      EventTemplate.belongsTo(models.Event);
      EventTemplate.belongsTo(models.Template);
    }
  };
  EventTemplate.init({
    userId: DataTypes.INTEGER,
    html: DataTypes.TEXT,
    css: DataTypes.TEXT,
    javascript: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'EventTemplate',
  });
  return EventTemplate;
};