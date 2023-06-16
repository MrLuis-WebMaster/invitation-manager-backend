'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Providers', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			title: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			introductionMessage: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			description: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			contactName: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			contactEmail: {
				type: Sequelize.STRING,
				allowNull: false,
				validate: {
					isEmail: true,
				},
			},
			contactPhone: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			price: {
				type: Sequelize.DECIMAL,
				allowNull: false,
			},
			location: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			imageUrl: Sequelize.STRING,
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('Providers');
	},
};
