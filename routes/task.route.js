const express = require('express');
const {
	createTask,
	getTasksByEventId,
	updateTask,
	deleteTask,
	getTaskStatusPercentage
} = require('../controllers/task.controller');
const router = express.Router();

router.post('/create', createTask);
router.get('/:eventId', getTasksByEventId);
router.get('/:eventId/percentage', getTaskStatusPercentage);
router.put('/update', updateTask);
router.delete('/delete', deleteTask);

module.exports = router;
