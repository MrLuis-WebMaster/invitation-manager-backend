const { ErrorObject } = require('../helpers');
const { User } = require('../database/models');
const fs = require('fs');
const nodemailer = require('nodemailer');

exports.sendNotificationGuestUpdatedStatusService = async ({
	name,
	status,
	UserId,
}) => {
	try {
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
			'../emails/NotificationStatus/notification.html'
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
			}
		});
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};
