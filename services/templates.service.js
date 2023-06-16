const { ErrorObject } = require('../helpers');
const { User, Event, Template } = require('../database/models');

exports.createTemplateService = async ({
	name,
	description,
	html,
	css,
	js,
	previewImage,
	userEmail,
	eventId,
	role
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

		if (role !== 'admin') {
			throw new ErrorObject('Only admins can create templates', 401);
		}

		const event = await Event.findByPk(eventId);

		if (!event) {
			throw new ErrorObject('Event not found', 404);
		}

		const template = await Template.create({
			name,
			description,
			html,
			css,
			js,
			previewImage,
			UserId: user.id,
			EventId: event.id,
		});

		return template;
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};

exports.updateTemplateService = async ({
	templateId,
	name,
	description,
	html,
	css,
	js,
	previewImage,
	role
}) => {
	try {
		const template = await Template.findByPk(templateId);

		if (!template) {
			throw new ErrorObject('Template not found', 404);
		}

		if (role !== 'admin') {
			throw new ErrorObject('Only admins can update templates', 401);
		}

		const updatedTemplate = await template.update({
			name,
			description,
			html,
			css,
			js,
			previewImage,
		});

		return updatedTemplate;
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};

exports.deleteTemplateService = async ({ templateId, role }) => {
	try {
		const template = await Template.findByPk(templateId);

		if (!template) {
			throw new ErrorObject('Template not found', 404);
		}

		if (role !== 'admin') {
			throw new ErrorObject('Only admins can delete templates', 401);
		}

		await template.destroy();

		return { message: 'Template deleted successfully' };
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};


exports.getTemplatesService = async () => {
	try {
	  const templates = await Template.findAll();
  
	  if (!templates.length) {
		throw new ErrorObject(`No templates found`, 404);
	  }
  
	  return templates;
	} catch (error) {
	  throw new ErrorObject(error.message, error.statusCode || 500);
	}
  };

exports.getTemplateByIdService = async (templateId) => {
	try {
		const template = await Template.findByPk(templateId);
		if (!template) {
			throw new ErrorObject('Template not found', 404);
		}
		return template;
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};
