const {
    createExpenseService,
    updateExpenseService,
    deleteExpenseService,
    getExpensesByEventIdService,
    checkBudgetService,
	getTotalExpensesByEventIdService
} = require('../services/expense.service');
const { catchAsync, endpointResponse } = require('../helpers/index');
const createHttpError = require('http-errors');

module.exports = {
	createExpense: catchAsync(async (req, res, next) => {
		try {
			const response = await createExpenseService(req.body);
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
	updateExpense: catchAsync(async (req, res, next) => {
		try {
			const response = await updateExpenseService(req.body);
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
	deleteExpense: catchAsync(async (req, res, next) => {
		try {
			const response = await deleteExpenseService(req.body);
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
	getExpensesByEventId: catchAsync(async (req, res, next) => {
		try {
			const response = await getExpensesByEventIdService(req.params.eventId);
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
	checkBudgetService: catchAsync(async (req, res, next) => {
		try {
			const response = await checkBudgetService(req.params.eventId);
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
	getTotalExpenses: catchAsync(async (req, res, next) => {
		try {
			const response = await getTotalExpensesByEventIdService(req.params.eventId);
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
