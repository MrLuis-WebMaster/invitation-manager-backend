const express = require('express');
const {
	createExpense,
    deleteExpense,
    updateExpense,
    getExpensesByEventId,
    checkBudgetService,
    getTotalExpenses
} = require('../controllers/expense.controller');
const router = express.Router();

router.post('/create', createExpense);
router.put('/update', updateExpense);
router.delete('/delete', deleteExpense);
router.get('/:eventId', getExpensesByEventId);
router.get('/:eventId/total-expenses', getTotalExpenses);
router.get('/:eventId/check-budget', checkBudgetService);

module.exports = router;