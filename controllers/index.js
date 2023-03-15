const createHttpError = require('http-errors');
const { User, Guest, Accompanist } = require('../database/models');
const { endpointResponse } = require('../helpers/success');
const { Op } = require('sequelize');
const { catchAsync } = require('../helpers/catchAsync');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');
const nodemailer = require('nodemailer');

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
	getUser: catchAsync(async (req, res, next) => {
		try {
			const response = await User.findOne({
				where: {
					email: req.params.email,
				},
			});
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
	postUser: catchAsync(async (req, res, next) => {
		try {
			const user = await User.findOne({
				where: {
					email: req.body.email,
				},
			});
			if (user instanceof User) {
				throw new Error('Mail already exists on our platform');
			}
			const response = await User.create({ ...req.body });
			endpointResponse({
				res,
				message: 'Success',
				body: response,
			});
		} catch (error) {
			const httpError = createHttpError(
				error.statusCode,
				`[Error retrieving index] - [index - POST]: ${error.message}`
			);
			next(httpError);
		}
	}),
	createGuest: catchAsync(async (req, res, next) => {
		try {
			const guest = await Guest.findOne({
				where: {
					numberPhone: req.body.numberPhone,
				},
				include: {
					model: User,
					where: {
						email: req.body.email,
					},
				},
			});

			if (guest instanceof Guest) {
				throw new Error('Number Phone already exists on our platform');
			}

			const user = await User.findOne({
				where: {
					email: req.body.email,
				},
			});
			const creatingSlug = req.body.name
				.trim()
				.toLowerCase()
				.replace(/ /g, '-');
			const response = await user.createGuest({
				name: req.body.name,
				numberPhone: req.body.numberPhone,
				slug: creatingSlug,
				numberGuest: req.body.numberGuest,
				messageCustomize: req.body.messageCustomize,
			});
			endpointResponse({
				res,
				message: 'Success',
				body: response,
			});
		} catch (error) {
			const httpError = createHttpError(
				error.statusCode,
				`[Error retrieving index] - [index - POST]: ${error.message}`
			);
			next(httpError);
		}
	}),
	getGuest: catchAsync(async (req, res, next) => {
		try {
			const response = await Guest.findOne({
				where: {
					slug: req.params.slug,
				},
			});
			endpointResponse({
				res,
				message: 'Success',
				body: response,
			});
		} catch (error) {
			console.log(error);
			const httpError = createHttpError(
				error.statusCode,
				`[Error retrieving index] - [index - POST]: ${error.message}`
			);
			next(httpError);
		}
	}),
	deleteGuest: catchAsync(async (req, res, next) => {
		try {
			const { numberPhone } = req.body;

			await Guest.destroy({
				where: {
					numberPhone,
				},
			});
			endpointResponse({
				res,
				message: 'Success',
				body: true,
			});
		} catch (error) {
			console.log(error);
			const httpError = createHttpError(
				error.statusCode,
				`[Error retrieving index] - [index - POST]: ${error.message}`
			);
			next(httpError);
		}
	}),
	updateGuest: catchAsync(async (req, res, next) => {
		try {
			const { oldGuest, newGuest, email } = req.body;

			let guest = null;

			if (oldGuest.numberPhone !== newGuest.numberPhone) {
				guest = await Guest.findOne({
					where: {
						numberPhone: newGuest.numberPhone,
					},
					include: {
						model: User,
						where: {
							email,
						},
					},
				});
			}

			if (guest instanceof Guest) {
				throw new Error('Number Phone already exists on our platform');
			}

			const response = await Guest.update(
				{ ...newGuest },
				{
					where: { ...oldGuest },
				}
			);
			endpointResponse({
				res,
				message: 'Success',
				body: response,
			});
		} catch (error) {
			console.log(error);
			const httpError = createHttpError(
				error.statusCode,
				`[Error retrieving index] - [index - POST]: ${error.message}`
			);
			next(httpError);
		}
	}),
	getAllGuest: catchAsync(async (req, res, next) => {
		try {
			const { search, limit, page, isConfirmed } = req.query;
			const user = await User.findOne({
				where: {
					email: req.params.email,
				},
			});
			const limitResult = Number(limit) || 10;
			const searchResult = search || '';
			const numberPage = Number(page);

			const countGuest = await User.findAndCountAll({
				where: {
					email: req.params.email,
				},
				include: {
					model: Guest,
					where: {
						...(Boolean(isConfirmed) && {
							isConfirmed: {
								[Op.is]:
									isConfirmed?.toLowerCase() === 'null'
										? null
										: isConfirmed?.toLowerCase() === 'true',
							},
						}),
						name: {
							[Op.like]: `%${searchResult}%`,
						},
					},
				},
			});

			const response = await user.getGuests({
				where: {
					...(Boolean(isConfirmed) && {
						isConfirmed: {
							[Op.is]:
								isConfirmed?.toLowerCase() === 'null'
									? null
									: isConfirmed?.toLowerCase() === 'true',
						},
					}),
					name: {
						[Op.like]: `%${searchResult}%`,
					},
				},
				order: [['createdAt', 'DESC']],
				limit: limitResult,
				offset: numberPage ? numberPage * limitResult : 0,
			});

			const totalPages = Math.ceil(countGuest.count / limitResult);
			endpointResponse({
				res,
				message: 'Success',
				meta: {
					pagination: {
						totalGuests: countGuest.count,
						page: numberPage + 1,
						next: numberPage + 1 >= totalPages ? null : numberPage + 1 + 1,
						previous:
							numberPage - 1 + 1 <= 0 || numberPage - 1 + 1 > totalPages
								? null
								: numberPage - 1 + 1,
					},
					infoCountGuests: {
						totalSumGuest: countGuest.rows[0]?.Guests?.reduce(
							(accumulator, currentValue) =>
								accumulator + Number(currentValue.numberGuest),
							0
						),
						totalIsConfirmed: countGuest.rows[0]?.Guests?.filter(
							guest => guest.isConfirmed === true
						).reduce(
							(accumulator, currentValue) =>
								accumulator + Number(currentValue.numberGuest),
							0
						),
						totalIsDeclined: countGuest.rows[0]?.Guests?.filter(
							guest => guest.isConfirmed === false
						).reduce(
							(accumulator, currentValue) =>
								accumulator + Number(currentValue.numberGuest),
							0
						),
						totalIsNotConfirmed: countGuest.rows[0]?.Guests?.filter(
							guest => guest.isConfirmed === null
						).reduce(
							(accumulator, currentValue) =>
								accumulator + Number(currentValue.numberGuest),
							0
						),
					},
				},
				body: response,
			});
		} catch (error) {
			const httpError = createHttpError(
				error.statusCode,
				`[Error retrieving index] - [index - POST]: ${error.message}`
			);
			next(httpError);
		}
	}),
	getDetailsGuest: catchAsync(async (req, res, next) => {
		try {
			const { email } = req.params;
			const { id, name } = req.query;
			const response = await User.findOne({
				where: {
					email,
				},
				include: {
					model: Guest,
					where: {
						id,
						name,
					},
					include: {
						model: Accompanist,
					},
				},
			});
			endpointResponse({
				res,
				message: 'Success',
				body: response,
			});
		} catch (error) {
			const httpError = createHttpError(
				error.statusCode,
				`[Error retrieving index] - [index - POST]: ${error.message}`
			);
			next(httpError);
		}
	}),
	getFormReminder: catchAsync(async (req, res, next) => {
		try {
			const { id, name } = req.query;
			console.log(id, name);
			const response = await Guest.findOne({
				where: {
					id,
					name,
				},
				include: {
					model: User,
				},
			});
			endpointResponse({
				res,
				message: 'Success',
				body: response,
			});
		} catch (error) {
			const httpError = createHttpError(
				error.statusCode,
				`[Error retrieving index] - [index - POST]: ${error.message}`
			);
			next(httpError);
		}
	}),
	getListGuest: catchAsync(async (req, res, next) => {
		try {
			const { email } = req.params;
			const { search, limit, page } = req.query;

			const limitResult = Number(limit) || 10;
			const searchResult = search || '';
			const numberPage = Number(page);

			const countGuest = await User.findAndCountAll({
				where: {
					email,
				},
				include: {
					model: Guest,
					where: {
						name: {
							[Op.like]: `%${searchResult}%`,
						},
					},
					include: {
						model: Accompanist,
						where: {
							name: {
								[Op.not]: null,
							},
							identifier: {
								[Op.not]: null,
							},
							age: {
								[Op.not]: null,
							},
						},
					},
				},
			});

			const response = await User.findOne({
				where: {
					email,
				},
				include: {
					model: Guest,
					where: {
						name: {
							[Op.like]: `%${searchResult}%`,
						},
					},
					include: {
						model: Accompanist,
						where: {
							name: {
								[Op.not]: null,
							},
							identifier: {
								[Op.not]: null,
							},
							age: {
								[Op.not]: null,
							},
						},
					},
					limit: limitResult,
					offset: numberPage ? numberPage * limitResult : 0,
					order: [['createdAt', 'DESC']],
				},
			});

			const totalPages = Math.ceil((countGuest.count - 1) / limitResult);

			endpointResponse({
				res,
				message: 'Success',
				meta: {
					pagination: {
						totalGuests: countGuest.count,
						page: numberPage + 1,
						next: numberPage + 1 >= totalPages ? null : numberPage + 1 + 1,
						previous:
							numberPage - 1 + 1 <= 0 || numberPage - 1 + 1 > totalPages - 1
								? null
								: numberPage - 1 + 1,
					},
				},
				body: response,
			});
		} catch (error) {
			const httpError = createHttpError(
				error.statusCode,
				`[Error retrieving index] - [index - POST]: ${error.message}`
			);
			next(httpError);
		}
	}),
	isConfirmedGuest: catchAsync(async (req, res, next) => {
		try {
			const { numberPhone, responseGuest, id } = req.body;
			console.log(responseGuest);
			const user = await Guest.update(
				{ isConfirmed: responseGuest },
				{
					where: {
						numberPhone,
						id,
					},
				}
			);
			endpointResponse({
				res,
				message: 'Success',
				body: user,
			});
		} catch (error) {
			const httpError = createHttpError(
				error.statusCode,
				`[Error retrieving index] - [index - POST]: ${error.message}`
			);
			next(httpError);
		}
	}),
	createAccompanist: catchAsync(async (req, res, next) => {
		try {
			const { id, name, dataAccompanist } = req.body;
			const guest = await Guest.findOne({
				where: {
					id: Number(id),
					name,
				},
				include: {
					model: User,
				},
			});
			const createdResponse = dataAccompanist.map(async data => {
				return await guest.createAccompanist({ ...data });
			});

			endpointResponse({
				res,
				message: 'Success',
				body: createdResponse.length,
			});
		} catch (error) {
			const httpError = createHttpError(
				error.statusCode,
				`[Error retrieving index] - [index - POST]: ${error.message}`
			);
			next(httpError);
		}
	}),
	updateAccompanist: catchAsync(async (req, res, next) => {
		try {
			const { oldAccompanist, newAccompanist } = req.body;
			const response = await Accompanist.update(
				{ ...newAccompanist },
				{
					where: { ...oldAccompanist },
				}
			);
			endpointResponse({
				res,
				message: 'Success',
				body: response,
			});
		} catch (error) {
			console.log(error);
			const httpError = createHttpError(
				error.statusCode,
				`[Error retrieving index] - [index - POST]: ${error.message}`
			);
			next(httpError);
		}
	}),
	deleteAccompanist: catchAsync(async (req, res, next) => {
		try {
			const { name, identifier, age, GuestId } = req.body;

			await Accompanist.destroy({
				include: {
					model: Guest,
					where: {
						GuestId,
					},
				},
				where: {
					name,
					identifier,
					age,
				},
			});
			endpointResponse({
				res,
				message: 'Success',
				body: true,
			});
		} catch (error) {
			console.log(error);
			const httpError = createHttpError(
				error.statusCode,
				`[Error retrieving index] - [index - POST]: ${error.message}`
			);
			next(httpError);
		}
	}),
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
	sendNotificacion: catchAsync(async (req, res, next) => {
		try {
			const { name, status, UserId } = req.body;
			const user = await User.findByPk(UserId);

			const transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: process.env.EMAIL_NOTIFICATION,
					pass: process.env.EMAIL_NOTIFICATION_PASSWORD,
				},
				tls: {
					rejectUnauthorized: false,
				},
			});

			async function readFile(ruta) {
				return new Promise((resolve, reject) => {
					fs.readFile(ruta, 'utf8', (error, data) => {
						if (error) {
							reject(error);
						} else {
							resolve(data);
						}
					});
				});
			}

			const userName = user.name;
			const statusRender = status ? 'Confirmado' : 'Rechazado';
			const html = await readFile(
				'./emails/NotificationStatus/notification.html'
			);
			const htmlRenderizado = html
				.replace('{nameUser}', userName)
				.replace('{name}', name)
				.replace('{status}', statusRender);
			const mailOptions = {
				from: process.env.EMAIL_NOTIFICATION,
				to: `${user.email}`,
				subject: `Nueva Actualización de Estado`,
				html: htmlRenderizado,
			};

			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					throw new Error(error);
				} else {
					endpointResponse({
						res,
						message: 'Sent success',
						body: true,
					});
				}
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
