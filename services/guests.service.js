const { ErrorObject } = require('../helpers');
const { Guest, User, Accompanist } = require('../database/models');
const { Op } = require('sequelize');

exports.createGuestService = async body => {
	try {
		const guest = await Guest.findOne({
			where: {
				numberPhone: body.numberPhone,
			},
			include: {
				model: User,
				where: {
					email: body.email,
				},
			},
		});

		if (guest instanceof Guest) {
			throw new ErrorObject('Number Phone already exists on our platform', 400);
		}

		const user = await User.findOne({
			where: {
				email: body.email,
			},
		});
		const creatingSlug = body.name.trim().toLowerCase().replace(/ /g, '-');
		const guestCreated = await user.createGuest({
			name: body.name,
			numberPhone: body.numberPhone,
			slug: creatingSlug,
			numberGuest: body.numberGuest,
			messageCustomize: body.messageCustomize,
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
exports.updateGuestService = async ({ oldGuest, newGuest, email }) => {
	try {
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

		const guestUpated = await Guest.update(
			{ ...newGuest },
			{
				where: { ...oldGuest },
			}
		);
		return guestUpated;
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};
exports.getAllGuestService = async ({
	limit,
	search,
	page,
	isConfirmed,
	email,
}) => {
	try {
		const user = await User.findOne({
			where: {
				email,
			},
		});
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

		const listGuests = await user.getGuests({
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
