const { catchAsync, endpointResponse } = require('../helpers/index');
const createHttpError = require('http-errors');
const { sendNotificationGuestUpdatedStatusService } = require('../services/notifications.service')
module.exports = {
    sendNotificacion: catchAsync(async (req, res, next) => {
		try {
            await sendNotificationGuestUpdatedStatusService(req.body)
			endpointResponse({
                res,
                message: 'Sent success',
                body: true,
            });
		} catch (error) {
			const httpError = createHttpError(
				error.statusCode,
				`[Error retrieving index] - [index - POST]: ${error.message}`
			);
			next(httpError);
		}
	})
}