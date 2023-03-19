const { ErrorObject } = require('../helpers');
const { Client, LocalAuth } = require('whatsapp-web.js');
// const { SessionWhatsapp } = require('../database/models');}
const { getUserService } = require('./users.service');

const clients = {};

exports.createSessionWSService = async email => {
	try {
		const user = await getUserService(email);
		if (clients[user.email]) return;
		const client = new Client({
			authStrategy: new LocalAuth({
				dataPath: 'wwebjs-auth',
				clientId: user.id,
			}),
			puppeteer: {
				args: ['--no-sandbox'],
			},
		});
		clients[user.email] = client;
		clients[user.email].initialize();
		return user;
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};

exports.getSessionWSService = async email => {
	try {
		return clients[email];
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};
