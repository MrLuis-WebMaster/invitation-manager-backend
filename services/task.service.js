const { ErrorObject } = require('../helpers');
const { Task, Event } = require('../database/models');

exports.createTaskService = async ({ eventId, name, description }) => {
	try {
		const event = await Event.findByPk(eventId);

		if (!event) {
			throw new ErrorObject('Event not found', 404);
		}

		const taskCreate = await event.createTask({
			name,
			description,
			status: false,
		});

		return taskCreate;
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};

exports.updateTaskService = async ({ id, name, description, status }) => {
	try {
		const task = await Task.findByPk(id, {
			include: [{ model: Event }],
		});

		if (!task) {
			throw new ErrorObject('Task not found', 404);
		}

		const updatedTask = await task.update({
			name,
			description,
			status,
		});

		return updatedTask;
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};

exports.deleteTaskService = async ({ id }) => {
	try {
		const task = await Task.findByPk(id);

		if (!task) {
			throw new ErrorObject('Task not found', 404);
		}

		await task.destroy();

		return { message: 'Task deleted successfully' };
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};

exports.getTasksByEventIdService = async eventId => {
	try {
		const event = await Event.findByPk(eventId, {
			include: {
				model: Task,
			},
		});

		if (!event) {
			throw new ErrorObject(`Event with id ${eventId} not found`, 404);
		}

		return event.Tasks;
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};

exports.getTaskStatusPercentageService = async eventId => {
	try {
		const event = await Event.findByPk(eventId, {
			include: {
				model: Task,
			},
		});

		if (!event) {
			throw new ErrorObject(`Event with id ${eventId} not found`, 404);
		}

		const tasks = event.Tasks;
		const totalTasks = tasks.length;
		const completedTasks = tasks.filter(task => task.status).length;
		const percentage = Math.round((completedTasks / totalTasks) * 100);

		return percentage;
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};
