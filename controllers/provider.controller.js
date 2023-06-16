const {
	createProviderService,
	updateProviderService,
	deleteProviderService,
	getProviderByIdService,
	getAllProvidersService,
} = require('../services/provider.service');
const { catchAsync, endpointResponse } = require('../helpers/index');
const createHttpError = require('http-errors');

module.exports = {
	createProvider: catchAsync(async (req, res, next) => {
		try {
			const response = await createProviderService(req.body);
			endpointResponse({
				res,
				message: 'Provider created successfully',
				body: response,
			});
		} catch (error) {
			const httpError = createHttpError(
				error.statusCode,
				`[Error creating provider] - [createProvider - POST]: ${error.message}`
			);
			next(httpError);
		}
	}),

	updateProvider: catchAsync(async (req, res, next) => {
		try {
			const { providerId } = req.params;
			const response = await updateProviderService({
				providerId,
				...req.body,
			});
			endpointResponse({
				res,
				message: 'Provider updated successfully',
				body: response,
			});
		} catch (error) {
			const httpError = createHttpError(
				error.statusCode,
				`[Error updating provider] - [updateProvider - PUT]: ${error.message}`
			);
			next(httpError);
		}
	}),

	deleteProvider: catchAsync(async (req, res, next) => {
		try {
			const { providerId } = req.params;
			const response = await deleteProviderService({ providerId });
			endpointResponse({
				res,
				message: response.message,
				body: null,
			});
		} catch (error) {
			const httpError = createHttpError(
				error.statusCode,
				`[Error deleting provider] - [deleteProvider - DELETE]: ${error.message}`
			);
			next(httpError);
		}
	}),

	getProviderById: catchAsync(async (req, res, next) => {
		try {
			const { providerId } = req.params;
			const response = await getProviderByIdService(providerId);
			endpointResponse({
				res,
				message: 'Success',
				body: response,
			});
		} catch (error) {
			const httpError = createHttpError(
				error.statusCode,
				`[Error retrieving provider] - [getProviderById - GET]: ${error.message}`
			);
			next(httpError);
		}
	}),

	getAllProviders: catchAsync(async (req, res, next) => {
		try {
			const response = await getAllProvidersService();
			endpointResponse({
				res,
				message: 'Success',
				body: response,
			});
		} catch (error) {
			const httpError = createHttpError(
				error.statusCode,
				`[Error retrieving providers] - [getAllProviders - GET]: ${error.message}`
			);
			next(httpError);
		}
	}),
};
