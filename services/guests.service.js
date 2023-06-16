const { ErrorObject } = require('../helpers');
const { Guest, User, Accompanist, Event } = require('../database/models');
const { Op } = require('sequelize');
const { encodeData } = require('../utils/token');
exports.createGuestService = async body => {
	try {
		const event = await Event.findOne({
			where: {
				id: body.eventId,
			},
			include: {
				model: User,
				where: {
					email: body.email,
				},
			},
		});

		if (!event) {
			throw new ErrorObject('Event not found', 404);
		}

		const guest = await Guest.findOne({
			where: {
				numberPhone: body.numberPhone,
				EventId: body.eventId,
			},
		});

		if (guest) {
			throw new ErrorObject('Number Phone already exists on our platform', 400);
		}

		const creatingSlug = encodeData({
			event,
			guest:{
				name: body.name,
				numberPhone: body.numberPhone,
				numberGuest: body.numberGuest,
				messageCustomize: body.messageCustomize,
			}
		})

		const guestCreated = await Guest.create({
			name: body.name,
			numberPhone: body.numberPhone,
			slug: creatingSlug,
			numberGuest: body.numberGuest,
			messageCustomize: body.messageCustomize,
			isConfirmed: body.isConfirmed,
			EventId: body.eventId,
		});

		return guestCreated;
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};
exports.getGuestBySlugService = async slug => {
	try {
		const guest = await Guest.findOne({
			where: {
				slug,
			},
		});
		return guest;
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};
exports.deleteGuestByNumberPhone = async numberPhone => {
	try {
		const responseByDatabase = await Guest.destroy({
			where: {
				numberPhone,
			},
		});
		return responseByDatabase;
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};
const findGuestByNumberPhone = async (numberPhone) => {
	const guest = await Guest.findOne({
		where: {
			numberPhone,
		},
	});
	return guest;
};
exports.updateGuestService = async ({ oldGuest, newGuest }) => {
	try {
		const existingGuest = await findGuestByNumberPhone(newGuest.numberPhone);
		if (existingGuest && existingGuest.id !== oldGuest.id) {
			throw new Error('Este número de teléfono ya ha sido registrado por otro usuario');
		}
		const guestUpated = await Guest.update(
			{ ...newGuest },
			{
				where: { ...oldGuest },
			}
			);
		return guestUpated;
	} catch (error) {
		throw new Error('Error al actualizar el invitado');
	}
};
exports.getAllGuestService = async ({
	limit,
	search,
	page,
	isConfirmed,
	email,
	eventId,
}) => {
	try {
		const user = await User.findOne({
			where: {
				email,
			},
		});

		if (!user) {
			throw new ErrorObject(`User with email ${email} not found`, 404);
		}

		const limitResult = Number(limit) || 10;
		const searchResult = search || '';
		const numberPage = Number(page);

		const whereClause = {
			name: {
				[Op.like]: `%${searchResult}%`,
			},
		};

		// eslint-disable-next-line no-extra-boolean-cast
		if (Boolean(isConfirmed)) {
			whereClause.isConfirmed = {
				[Op.is]:
					isConfirmed?.toLowerCase() === 'null'
						? null
						: isConfirmed?.toLowerCase() === 'true',
			};
		}

		const countGuest = await Guest.findAndCountAll({
			where: {
				...whereClause,
				EventId: eventId,
			},
			include: {
				model: Event,
				where: {
					UserId: user.id,
				},
			},
		});

		const listGuests = await Guest.findAll({
			where: {
				...whereClause,
				EventId: eventId,
			},
			include: {
				model: Event,
				where: {
					UserId: user.id,
				},
			},
			order: [['createdAt', 'DESC']],
			limit: limitResult,
			offset: numberPage ? (numberPage - 1) * limitResult : 0,
		});

		const totalPages = Math.ceil(countGuest.count / limitResult);

		const meta = {
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
				totalSumGuest: countGuest.rows.reduce(
					(accumulator, currentValue) =>
						accumulator + Number(currentValue.numberGuest),
					0
				),
				totalIsConfirmed: countGuest.rows
					.filter(guest => guest.isConfirmed === true)
					.reduce(
						(accumulator, currentValue) =>
							accumulator + Number(currentValue.numberGuest),
						0
					),
				totalIsDeclined: countGuest.rows
					.filter(guest => guest.isConfirmed === false)
					.reduce(
						(accumulator, currentValue) =>
							accumulator + Number(currentValue.numberGuest),
						0
					),
				totalIsNotConfirmed: countGuest.rows
					.filter(guest => guest.isConfirmed === null)
					.reduce(
						(accumulator, currentValue) =>
							accumulator + Number(currentValue.numberGuest),
						0
					),
			},
		};

		return {
			meta,
			listGuests,
		};
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};
exports.getFullDetailsGuestService = async (id, email, name) => {
	try {
		const fullDetailsGuests = await User.findOne({
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
		return fullDetailsGuests;
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};
exports.getListGuestsService = async ({ limit, search, page, email }) => {
	try {
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

		const listGuests = await User.findOne({
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
		const meta = {
			pagination: {
				totalGuests: countGuest.count,
				page: numberPage + 1,
				next: numberPage + 1 >= totalPages ? null : numberPage + 1 + 1,
				previous:
					numberPage - 1 + 1 <= 0 || numberPage - 1 + 1 > totalPages - 1
						? null
						: numberPage - 1 + 1,
			},
		};
		return {
			meta,
			listGuests,
		};
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};
exports.getGuestByIdAndNameService = async (id, name) => {
	try {
		const guest = await Guest.findOne({
			where: {
				id,
				name,
			},
			include: {
				model: User,
			},
		});
		return guest;
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};
exports.isConfirmedGuestService = async ({
	numberPhone,
	responseGuest,
	id,
}) => {
	try {
		const userUpatedStatusIsConfirmed = await Guest.update(
			{ isConfirmed: responseGuest },
			{
				where: {
					numberPhone,
					id,
				},
			}
		);
		return userUpatedStatusIsConfirmed;
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};
exports.createAccompanistsService = async ({ id, name, dataAccompanist }) => {
	try {
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
		return createdResponse;
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};
exports.deleteAccompanistService = async ({
	name,
	identifier,
	age,
	GuestId,
}) => {
	try {
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
		return true;
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};
exports.updateAccompanistService = async ({
	newAccompanist,
	oldAccompanist,
}) => {
	try {
		const updatedUser = await Accompanist.update(
			{ ...newAccompanist },
			{
				where: { ...oldAccompanist },
			}
		);
		return updatedUser;
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};
