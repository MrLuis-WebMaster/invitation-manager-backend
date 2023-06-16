const {
	createSessionWSService,
	getSessionWSService,
} = require('../services/whatsapp.service');
const { catchAsync, endpointResponse } = require('../helpers/index');
const createHttpError = require('http-errors');
const qrcode = require('qrcode-terminal');
const { MessageMedia } = require('whatsapp-web.js');

module.exports = {
	createSession: catchAsync(async (req, res, next) => {
		try {
			const response = await createSessionWSService(req.body.email);
			endpointResponse({
				res,
				message: 'Success',
				body: response,
			});
		} catch (error) {
			const httpError = createHttpError(
				error.statusCode,
				`[Error retrieving index] - [index - GET]: ${error.message}`
			);
			next(httpError);
		}
	}),
	createQRWhatsapp: catchAsync(async (req, res, next) => {
		try {
			await createSessionWSService(req.body.email);
			const client = await getSessionWSService(req.body.email);
			let isGeneratedQR = false;

			client.on('auth_failure', async msg => {
				console.error('AUTHENTICATION FAILURE', msg);
				await client.logout();
				await client.destroy();
			});

			client.on('qr', qr => {
				qrcode.generate(qr, { small: true });
				console.log(qr);
				endpointResponse({
					res,
					message: 'QR GENERATED',
					body: qr,
				});
				isGeneratedQR = true;
			});

			if (isGeneratedQR) return;

			client.on('authenticated', () => {
				// endpointResponse({
				// 	res,
				// 	message: 'QR GENERATED',
				// 	body: 'authenticated',
				// });
			});
		} catch (error) {
			const client = await getSessionWSService(req.body.email);
			await client?.logout();
			await client?.destroy();
			const httpError = createHttpError(
				error.statusCode,
				`[Error retrieving index] - [index - POST]: ${error.message}`
			);
			next(httpError);
		}
	}),
	sendMessage: catchAsync(async (req, res, next) => {
		const { url, number, message, email } = req.body;
		try {
			const client = await getSessionWSService(email);
			const media = await MessageMedia.fromUrl(
				'https://i.ibb.co/sW9cDPf/img-ws.jpg'
			);
			const sanitizedNumber = number.toString().replace(/[- )(]/g, '');
			const numberDetails = await client.getNumberId(sanitizedNumber);
			if (!numberDetails) {
				throw new Error('Error');
			}

			client.on('auth_failure', async msg => {
				console.error('AUTHENTICATION FAILURE', msg);
				await client.logout();
				await client.destroy();
			});

			await client.sendMessage(numberDetails._serialized, media, {
				caption: `${message} \n \n ${url.trim()}`,
			});

			endpointResponse({
				res,
				message: 'Sent success',
				body: true,
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
			const { url, number, email } = req.body;
			const client = await getSessionWSService(email);
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
