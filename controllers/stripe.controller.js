const {
	createOrderStripe,
	completedPayment,
	getSubscriptionsService
} = require('../services/stripe.service');
const { catchAsync, endpointResponse } = require('../helpers/index');
const createHttpError = require('http-errors');

module.exports = {
	postOrder: catchAsync(async (req, res, next) => {
		try {
            const {customerId} = req.body
			const response = await createOrderStripe(customerId);
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
	completedPayment: catchAsync(async (req, res, next) => {
		try {
			const response = await completedPayment(req);
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
	getSubscriptions: catchAsync(async (req, res, next) => {
		try {
			const response = await getSubscriptionsService(req.params.customerId);
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
};
