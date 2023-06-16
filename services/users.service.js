const { ErrorObject } = require('../helpers');
const { User,Role } = require('../database/models');

exports.getAllUsersService = async () => {
	try {
		const users = await User.findAll();
		if (!users) {
			throw new ErrorObject('Error', 404);
		}
		return users;
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};
exports.getUserService = async email => {
	try {
		const user = await User.findOne({
			where: {
				email,
			},
		});
		if (!user) {
			throw new ErrorObject('No user found', 404);
		}
		return user;
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};
exports.createUserService = async body => {
	try {
		const checkUser = await User.findOne({
			where: {
				email: body.email,
			},
			include: [Role]
		});
		if (checkUser instanceof User) {
			throw new ErrorObject('Mail already exists on our platform', 404);
		}
		const createdUser = await User.create(body);

		const defaultRole = await Role.create({
		  name: 'user',
		  description: 'Role default'
		});
		await createdUser.setRole(defaultRole);
		const userWithRole = await User.findByPk(createdUser.id, {
			include: [Role]
		});
		return userWithRole;
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};