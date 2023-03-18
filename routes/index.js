const express = require('express');
const usersRouter = require('./users.route')
const guestsRouter = require('./guests.route')
const notificationRouter = require('./notifications.route')

const {
	checkSession,
	createQRWhatsapp,
	sendMessage,
	sendMessageReminder,
} = require('../controllers/index');

const router = express.Router();

router.get('/', (req, res, next) => {
	res.json( {
		status: 200
	})
	next()
})

router.use('/users', usersRouter)
router.use('/guests', guestsRouter)
router.use('/notifications', notificationRouter)

router.get('/qr-whatsapp', createQRWhatsapp);
router.get('/check-session', checkSession);
router.post('/send-message', sendMessage);
router.post('/send-message-reminder', sendMessageReminder);

module.exports = router;
