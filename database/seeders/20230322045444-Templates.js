'use strict';
const {  Event } = require('../../database/models');

module.exports = {
	up: async (queryInterface, Sequelize) => {
    const events = await Event.findAll();
    const eventIds = events.map(event => event.id);

		await queryInterface.bulkInsert('Templates', [
			{
				name: 'Template 1',
				description: 'lorem',
				html: '<!DOCTYPE html><html><head><title>Template 1</title></head><body><h1>Template 1</h1><p>This is template 1</p></body></html>',
				css: 'h1 { color: red; }',
				js: '',
				previewImage: 'https://via.placeholder.com/350x250.png?text=Template+1',
				EventId: eventIds[Math.floor(Math.random() * eventIds.length)],
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: 'Template 2',
				description: 'lorem',
				html: '<!DOCTYPE html><html><head><title>Template 2</title></head><body><h1>Template 2</h1><p>This is template 2</p></body></html>',
				css: 'h1 { color: blue; }',
				js: '',
				previewImage: 'https://via.placeholder.com/350x250.png?text=Template+2',
				EventId: eventIds[Math.floor(Math.random() * eventIds.length)],
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: 'Template 3',
				description: 'lorem',
				html: '<!DOCTYPE html><html><head><title>Template 3</title></head><body><h1>Template 3</h1><p>This is template 3</p></body></html>',
				css: 'h1 { color: green; }',
				js: '',
				previewImage: 'https://via.placeholder.com/350x250.png?text=Template+3',
				EventId: eventIds[Math.floor(Math.random() * eventIds.length)],
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete('Templates', null, {});
	},
};
