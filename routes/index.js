const express = require('express');
const usersRouter = require('./users.route');
const guestsRouter = require('./guests.route');
const notificationRouter = require('./notifications.route');
const whatsappRouter = require('./whatsapp.route');

const router = express.Router();

router.get('/', (req, res, next) => {
	res.json({
		status: 200,
	});
});

router.use('/users', usersRouter);
router.use('/guests', guestsRouter);
router.use('/notifications', notificationRouter);
router.use('/whatsapp', whatsappRouter);

module.exports = router;
