const { ErrorObject } = require('../helpers');
const { Event, Expense } = require('../database/models');

exports.createExpenseService = async ({
	eventId,
	name,
	description,
	amount,
}) => {
	try {
		const event = await Event.findByPk(eventId);

		if (!event) {
			throw new ErrorObject('Event not found', 404);
		}

		const expense = await Expense.create({
			name,
			description,
			amount,
			EventId: eventId,
		});

		return expense;
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};

exports.updateExpenseService = async ({
	expenseId,
	name,
	description,
	amount,
}) => {
	try {
		const expense = await Expense.findByPk(expenseId);

		if (!expense) {
			throw new ErrorObject('Expense not found', 404);
		}

		const updatedExpense = await expense.update({
			name,
			description,
			amount,
		});

		return updatedExpense;
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};

exports.deleteExpenseService = async ({ expenseId }) => {
	try {
		const expense = await Expense.findByPk(expenseId);

		if (!expense) {
			throw new ErrorObject('Expense not found', 404);
		}

		await expense.destroy();

		return { message: 'Expense deleted successfully' };
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};

exports.getExpensesByEventIdService = async eventId => {
	try {
		const event = await Event.findByPk(eventId);

		if (!event) {
			throw new ErrorObject('Event not found', 404);
		}

		const expenses = await Expense.findAll({ where: { EventId: eventId } });

		return expenses;
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};

exports.checkBudgetService = async eventId => {
	try {
		const event = await Event.findByPk(eventId);

		if (!event) {
			throw new ErrorObject('Event not found', 404);
		}

		const expenses = await Expense.sum('amount', {
			where: { EventId: eventId },
		});

		if (expenses > event.cost) {
			return {
				message: `Expenses exceeded budget by ${expenses - event.cost}`,
			};
		}

		return { message: 'Budget is OK' };
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};

exports.getTotalExpensesByEventIdService = async (eventId) => {
  try {
    const event = await Event.findByPk(eventId);

    if (!event) {
      throw new ErrorObject('Event not found', 404);
    }

    const totalExpenses = await Expense.sum('amount', {
      where: { EventId: eventId },
    });
    
    return totalExpenses || 0;
  } catch (error) {
    throw new ErrorObject(error.message, error.statusCode || 500);
  }
};
