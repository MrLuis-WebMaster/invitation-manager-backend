const {
	createEventService,
	updateEventService,
	deleteEventService,
	getEventsByUserEmailService,
	getEventCategoriesService
} = require('../services/event.service');
const { catchAsync, endpointResponse } = require('../helpers/index');
const createHttpError = require('http-errors');

module.exports = {
	createEvent: catchAsync(async (req, res, next) => {
		try {
			const response = await createEventService(req.body);
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
	updateEvent: catchAsync(async (req, res, next) => {
		try {
			const response = await updateEventService(req.body);
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
	deleteEvent: catchAsync(async (req, res, next) => {
		try {
			const response = await deleteEventService(req.body);
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
	getEventsByUserEmail: catchAsync(async (req, res, next) => {
		try {
			const response = await getEventsByUserEmailService(req.params.email, req.query.eventId);
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
	getAllEventCategories: catchAsync(async (req, res, next) => {
		try {
			const response = await getEventCategoriesService();
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
};
