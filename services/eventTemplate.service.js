const { ErrorObject } = require('../helpers');
const { User, Event, EventTemplate, Template } = require('../database/models');

exports.createOrUpdateEventTemplateService = async ({
	name,
	description,
	html,
	css,
	js,
	previewImage,
	userEmail,
	eventId,
	templateId
}) => {
	try {
		const user = await User.findOne({
			where: {
				email: userEmail,
			},
		});

		if (!user) {
			throw new ErrorObject('User not found', 404);
		}

		const event = await Event.findByPk(eventId);

		if (!event) {
			throw new ErrorObject('Event not found', 404);
		}
		const template = await Template.findByPk(templateId);

		if (!template) {
			throw new ErrorObject('Template not found', 404);
		}

		let eventTemplate = await EventTemplate.findOne({
			where: {
				EventId: event.id,
			},
		});

		if (!eventTemplate) {
			eventTemplate = await EventTemplate.create({
				name,
				description,
				html,
				css,
				js,
				previewImage,
				userId: user.id,
				EventId: event.id,
				TemplateId: template.id,
			});
		} else {
			await eventTemplate.update({
				name,
				description,
				html,
				css,
				js,
				previewImage,
				TemplateId: template.id,
				userId: user.id,
			});
		}

		return eventTemplate;
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};

exports.updateEventTemplateService = async ({
	eventTemplateId,
	name,
	description,
	html,
	css,
	js,
	previewImage,
}) => {
	try {
		const eventTemplate = await EventTemplate.findByPk(eventTemplateId);

		if (!eventTemplate) {
			throw new ErrorObject('Event template not found', 404);
		}

		const updatedEventTemplate = await eventTemplate.update({
			name,
			description,
			html,
			css,
			js,
			previewImage,
		});

		return updatedEventTemplate;
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};

exports.deleteEventTemplateService = async ({ eventTemplateId }) => {
	try {
		const eventTemplate = await EventTemplate.findByPk(eventTemplateId);

		if (!eventTemplate) {
			throw new ErrorObject('Event template not found', 404);
		}

		await eventTemplate.destroy();

		return { message: 'Event template deleted successfully' };
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};

exports.getEventTemplateByEventIdService = async eventId => {
	try {
		const eventTemplate = await EventTemplate.findOne({
			where: {
				EventId: eventId,
			},
			include: [
				{
					model: Event,
					attributes: ['name'],
				},
			],
		});

		if (!eventTemplate) {
			throw new ErrorObject('Event template not found', 404);
		}

		return eventTemplate;
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};

