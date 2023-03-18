const createHttpError = require('http-errors');
const {catchAsync,endpointResponse}  = require('../helpers');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const userController = require('./users.controller');
const guestController = require('./guests.controller');
const notificationController = require('./notifications.controller');

const client = new Client({
	authStrategy: new LocalAuth({
		dataPath: 'wwebjs-auth',
	}),
	puppeteer: {
		args: ['--no-sandbox'],
	},
});

client.initialize();

module.exports = {
	...userController,
	...guestController,
	...notificationController,
	createQRWhatsapp: catchAsync(async (req, res, next) => {
		try {
			client.on('qr', qr => {
				endpointResponse({
					res,
					message: 'QR GENERATED',
					body: qr,
				});
			});

			// client.initialize()
		} catch (error) {
			const httpError = createHttpError(
				error.statusCode,
				`[Error retrieving index] - [index - POST]: ${error.message}`
			);
			next(httpError);
		}
		// client.initialize()
	}),
	checkSession: catchAsync(async (req, res, next) => {
		try {
			endpointResponse({
				res,
				message: 'Success',
				body: await client.getState(),
			});
		} catch (error) {
			const httpError = createHttpError(
				error.statusCode,
				`[Error retrieving index] - [index - POST]: ${error.message}`
			);
			next(httpError);
		}
	}),
	sendMessage: catchAsync(async (req, res, next) => {
		try {
			const { url, number, message } = req.body;
			const media = await MessageMedia.fromUrl(
				'https://i.ibb.co/sW9cDPf/img-ws.jpg'
			);
			const sanitizedNumber = number.toString().replace(/[- )(]/g, '');
			const numberDetails = await client.getNumberId(sanitizedNumber);
			if (!numberDetails) {
				throw new Error('Error');
			}
			await client.sendMessage(numberDetails._serialized, media, {
				caption: `${message} \n \n ${url.trim()}`,
			});
			endpointResponse({
				res,
				message: 'Sent success',
				body: await client.getState(),
			});
		} catch (error) {
			const httpError = createHttpError(
				error.statusCode,
				`[Error retrieving index] - [index - POST]: ${error.message}`
			);
			next(httpError);
		}
	}),
	sendMessageReminder: catchAsync(async (req, res, next) => {
		try {
			const { url, number } = req.body;
			const sanitizedNumber = number.toString().replace(/[- )(]/g, '');
			const numberDetails = await client.getNumberId(sanitizedNumber);
			if (!numberDetails) {
				throw new Error('Error');
			}
			await client.sendMessage(
				numberDetails._serialized,
				`Mensaje de recordatorio ${url}`
			);
			endpointResponse({
				res,
				message: 'Sent success',
				body: await client.getState(),
			});
		} catch (error) {
			const httpError = createHttpError(
				error.statusCode,
				`[Error retrieving index] - [index - POST]: ${error.message}`
			);
			next(httpError);
		}
	}),
};
