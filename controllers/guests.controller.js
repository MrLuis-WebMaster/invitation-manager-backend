const {
	createGuestService,
	getGuestBySlugService,
	deleteGuestByNumberPhone,
	updateGuestService,
	getAllGuestService,
	getFullDetailsGuestService,
	getListGuestsService,
	getGuestByIdAndNameService,
	isConfirmedGuestService,
	createAccompanistsService,
	deleteAccompanistService,
	updateAccompanistService
} = require('../services/guests.service');
const { catchAsync, endpointResponse } = require('../helpers/index');
const createHttpError = require('http-errors');

module.exports = {
	createGuest: catchAsync(async (req, res, next) => {
		try {
			const response = await createGuestService(req.body);
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
			const response = await getGuestBySlugService(req.params.slug);
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
			await deleteGuestByNumberPhone(numberPhone);
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
			const response = await updateGuestService(req.body);
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
			const { meta, listGuests } = getAllGuestService({
				...req.query,
				...req.params,
			});
			endpointResponse({
				res,
				message: 'Success',
				meta,
				body: listGuests,
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
			const response = await getFullDetailsGuestService(id,email,name);
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
			const response = getGuestByIdAndNameService(id,name);
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
			const { meta, listGuests } = getListGuestsService({
				...req.query,
				...req.params,
			});
			endpointResponse({
				res,
				message: 'Success',
				meta,
				body: listGuests,
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
			const response = await isConfirmedGuestService(req.body);
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
	createAccompanist: catchAsync(async (req, res, next) => {
		try {
			const createdResponse = await createAccompanistsService(req.body);
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
			const response = await updateAccompanistService(req.body);
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
			endpointResponse({
				res,
				message: 'Success',
				body: await deleteAccompanistService(req.body),
			});
		} catch (error) {
			const httpError = createHttpError(
				error.statusCode,
				`[Error retrieving index] - [index - POST]: ${error.message}`
			);
			next(httpError);
		}
	})
};
