const { ErrorObject } = require('../helpers');
const { User, EventCategory, Event } = require('../database/models');

exports.createEventService = async ({
	email,
	name,
	description,
	date,
	time,
	location,
	cost,
	category,
}) => {
	try {
		const user = await User.findOne({
			where: {
				email,
			},
		});

		if (!user) {
			throw new ErrorObject('User not found', 404);
		}

		const eventCategory = await EventCategory.findOne({
			where: {
				name: category,
			},
		});
		if (!eventCategory) {
			throw new ErrorObject('Event category not found', 404);
		}

		const eventCreate = await user.createEvent({
			name,
			description,
			date,
			time,
			location,
			cost,
			EventCategoryId: eventCategory.id,
		});

		return eventCreate;
	} catch (error) {
		console.log(error)
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};

exports.updateEventService = async ({
	eventId,
	name,
	description,
	date,
	time,
	location,
	cost,
	categoryId,
}) => {
	try {
		const event = await Event.findByPk(eventId, {
			include: [{ model: User }, { model: EventCategory }],
		});

		if (!event) {
			throw new ErrorObject('Event not found', 404);
		}

		let category = null;
		if (categoryId) {
			category = await EventCategory.findByPk(categoryId);
			if (!category) {
				throw new ErrorObject('Category not found', 404);
			}
		}

		const updatedEvent = await event.update({
			name,
			description,
			date,
			time,
			location,
			cost,
			EventCategoryId: category?.id,
		});

		return updatedEvent;
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};

exports.deleteEventService = async ({eventId}) => {
	try {
		const event = await Event.findByPk(eventId, {
			include: [{ model: User }, { model: EventCategory }],
		});

		if (!event) {
			throw new ErrorObject('Event not found', 404);
		}

		await event.destroy();

		return { message: 'Event deleted successfully' };
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};

exports.getEventsByUserEmailService = async (email,eventId = null) => {
	try {
		const user = await User.findOne({
			where: { email },
			include: {
				model: Event,
				...( eventId && {
					where: {
						id: eventId
					}
				}),
				include: {
					model: EventCategory,
					attributes: ['name'],
				},
			},
		});

		if (!user) {
			throw new ErrorObject(`User with email ${email} not found`, 404);
		}

		const events = user.Events
			? user.Events.map(event => {
					return {
						id: event.id,
						name: event.name,
						description: event.description,
						date: event.date,
						time: event.time,
						location: event.location,
						cost: event.cost,
						category: event.EventCategory.name,
						templateId: event.templateId
					};
			  })
			: [];

		return events;
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};

exports.getEventCategoriesService = async () => {
	try {
		const categories = await EventCategory.findAll();

		if (!categories.length) {
			throw new ErrorObject(`Not found categories`, 404);
		}

		return categories;
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};
