const {
	createTemplateService,
	updateTemplateService,
	deleteTemplateService,
	getTemplatesService,
	getTemplateByIdService,
} = require('../services/templates.service');
const { catchAsync, endpointResponse } = require('../helpers/index');
const createHttpError = require('http-errors');

exports.createTemplate = catchAsync(async (req, res, next) => {
	try {
		const response = await createTemplateService(req.body);
		endpointResponse({
			res,
			message: 'Success',
			body: response,
		});
	} catch (error) {
		const httpError = createHttpError(
			error.statusCode,
			`[Error creating template] - [createTemplate - POST]: ${error.message}`
		);
		next(httpError);
	}
});

exports.updateTemplate = catchAsync(async (req, res, next) => {
	try {
		const { templateId } = req.params;
		const response = await updateTemplateService({ templateId, ...req.body });
		endpointResponse({
			res,
			message: 'Success',
			body: response,
		});
	} catch (error) {
		const httpError = createHttpError(
			error.statusCode,
			`[Error updating template] - [updateTemplate - PUT]: ${error.message}`
		);
		next(httpError);
	}
});

exports.deleteTemplate = catchAsync(async (req, res, next) => {
	try {
		const { templateId } = req.params;
		const response = await deleteTemplateService({ templateId });
		endpointResponse({
			res,
			message: 'Success',
			body: response,
		});
	} catch (error) {
		const httpError = createHttpError(
			error.statusCode,
			`[Error deleting template] - [deleteTemplate - DELETE]: ${error.message}`
		);
		next(httpError);
	}
});

exports.getTemplates = catchAsync(async (req, res, next) => {
	try {
		const response = await getTemplatesService();
		endpointResponse({
			res,
			message: 'Success',
			body: response,
		});
	} catch (error) {
		const httpError = createHttpError(
			error.statusCode,
			`[Error getting templates] - [getTemplates - GET]: ${error.message}`
		);
		next(httpError);
	}
});
exports.getTemplateById = catchAsync(async (req, res, next) => {
	try {
		console.log(req.params)
		const response = await getTemplateByIdService(req.params.id);
		endpointResponse({
			res,
			message: 'Success',
			body: response,
		});
	} catch (error) {
		const httpError = createHttpError(
			error.statusCode,
			`[Error getting templates] - [getTemplates - GET]: ${error.message}`
		);
		next(httpError);
	}
});
