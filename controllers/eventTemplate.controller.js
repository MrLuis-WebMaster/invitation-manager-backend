const {
	createOrUpdateEventTemplateService,
	getEventTemplateByEventIdService,
	updateEventTemplateService,
	deleteEventTemplateService,
} = require('../services/eventTemplate.service');
const { catchAsync, endpointResponse } = require('../helpers');
const createHttpError = require('http-errors');

module.exports = {
	createEventTemplate: catchAsync(async (req, res, next) => {
		try {
			console.log(req.body)
			const response = await createOrUpdateEventTemplateService(req.body);
			endpointResponse({
				res,
				message: 'Event template created',
				body: response,
			});
		} catch (error) {
			const httpError = createHttpError(error.statusCode || 500, error.message);
			next(httpError);
		}
	}),

	getEventTemplateById: catchAsync(async (req, res, next) => {
		try {
			const response = await getEventTemplateByEventIdService(Number(req.params.id));
			endpointResponse({
				res,
				message: 'Event templates retrieved',
				body: response,
			});
		} catch (error) {
			const httpError = createHttpError(error.statusCode || 500, error.message);
			next(httpError);
		}
	}),

	updateEventTemplate: catchAsync(async (req, res, next) => {
		try {
			const { id, html, css, javascript } = req.body;
			const response = await updateEventTemplateService(
				id,
				html,
				css,
				javascript
			);
			endpointResponse({
				res,
				message: 'Event template updated',
				body: response,
			});
		} catch (error) {
			const httpError = createHttpError(error.statusCode || 500, error.message);
			next(httpError);
		}
	}),

	deleteEventTemplate: catchAsync(async (req, res, next) => {
		try {
			const { id } = req.params;
			const response = await deleteEventTemplateService(id);
			endpointResponse({
				res,
				message: 'Event template deleted',
				body: response,
			});
		} catch (error) {
			const httpError = createHttpError(error.statusCode || 500, error.message);
			next(httpError);
		}
	}),
};
