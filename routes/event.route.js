const express = require('express');
const {
	createEvent,
	updateEvent,
	deleteEvent,
	getEventsByUserEmail,
	getAllEventCategories
} = require('../controllers/event.controller');
const router = express.Router();

router.post('/create', createEvent);
router.put('/update', updateEvent);
router.delete('/delete', deleteEvent);
router.get('/:email/events-by-user', getEventsByUserEmail);
router.get('/categories', getAllEventCategories);

module.exports = router;