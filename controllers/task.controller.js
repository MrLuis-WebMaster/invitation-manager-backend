const {
    createTaskService,
    updateTaskService,
    deleteTaskService,
    getTasksByEventIdService,
    getTaskStatusPercentageService
  } = require('../services/task.service');
  const { catchAsync, endpointResponse } = require('../helpers/index');
  const createHttpError = require('http-errors');
  
  module.exports = {
    createTask: catchAsync(async (req, res, next) => {
      try {
        const response = await createTaskService(req.body);
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
    updateTask: catchAsync(async (req, res, next) => {
      try {
        const response = await updateTaskService(req.body);
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
    deleteTask: catchAsync(async (req, res, next) => {
      try {
        const response = await deleteTaskService(req.body);
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
    getTasksByEventId: catchAsync(async (req, res, next) => {
      try {
        const response = await getTasksByEventIdService(req.params.eventId);
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
    getTaskStatusPercentage: catchAsync(async (req, res, next) => {
      try {
        const response = await getTaskStatusPercentageService(req.params.eventId);
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
  