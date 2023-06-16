const {
	getUserService,
	createUserService,
} = require('../services/users.service');
const {
	createCustomerStripe,
} = require('../services/stripe.service');
const { catchAsync, endpointResponse } = require('../helpers/index');
const createHttpError = require('http-errors');

module.exports = {
	getUser: catchAsync(async (req, res, next) => {
		try {
			const response = await getUserService(req.params.email);
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
			const response = await createUserService(req.body);
			await createCustomerStripe(req.body.email)
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
