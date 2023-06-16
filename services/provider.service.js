const { ErrorObject } = require('../helpers');
const { Provider } = require('../database/models');

exports.createProviderService = async ({
	title,
    introductionMessage,
	description,
	contactName,
	contactEmail,
	contactPhone,
	price,
	location,
	imageUrl,
}) => {
	try {
		const provider = await Provider.create({
			title,
            introductionMessage,
			description,
			contactName,
			contactEmail,
			contactPhone,
			price,
			location,
			imageUrl,
		});

		return provider;
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};

exports.updateProviderService = async ({
	providerId,
	title,
    introductionMessage,
	description,
	contactName,
	contactEmail,
	contactPhone,
	price,
	location,
	imageUrl,
}) => {
	try {
		const provider = await Provider.findByPk(providerId);

		if (!provider) {
			throw new ErrorObject('Provider not found', 404);
		}

		const updatedProvider = await provider.update({
			title,
            introductionMessage,
			description,
			contactName,
			contactEmail,
			contactPhone,
			price,
			location,
			imageUrl,
		});

		return updatedProvider;
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};

exports.deleteProviderService = async ({ providerId }) => {
	try {
		const provider = await Provider.findByPk(providerId);

		if (!provider) {
			throw new ErrorObject('Provider not found', 404);
		}

		await provider.destroy();

		return { message: 'Provider deleted successfully' };
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};

exports.getProviderByIdService = async providerId => {
	try {
		const provider = await Provider.findByPk(providerId);

		if (!provider) {
			throw new ErrorObject('Provider not found', 404);
		}

		return provider;
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};

exports.getAllProvidersService = async () => {
	try {
		const providers = await Provider.findAll();

		return providers;
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};
