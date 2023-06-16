'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Provider extends Model {
		static associate(models) {
			// Define association here if needed
		}
	}
	Provider.init(
		{
			title: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			introductionMessage: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			contactName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			contactEmail: {
				type: DataTypes.STRING,
				allowNull: true,
				validate: {
					isEmail: true,
				},
			},
			contactPhone: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			price: {
				type: DataTypes.DECIMAL,
				allowNull: true,
			},
			location: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			imageUrl: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'Provider',
		}
	);
	return Provider;
};
