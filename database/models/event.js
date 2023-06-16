'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Event extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Event.belongsTo(models.User);
			Event.belongsTo(models.EventCategory);
			Event.hasMany(models.Expense);
			Event.hasMany(models.Task);
			Event.hasMany(models.Guest);
			Event.hasOne(models.EventTemplate);
		}
	}
	Event.init(
		{
			name: DataTypes.STRING,
			description: DataTypes.TEXT,
			date: DataTypes.DATE,
			time: DataTypes.TIME,
			location: DataTypes.STRING,
			cost: DataTypes.DECIMAL,
			templateId:DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: 'Event',
		}
	);
	return Event;
};
