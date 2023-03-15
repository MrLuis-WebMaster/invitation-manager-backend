const express = require('express');
const {
	getUser,
	postUser,
	createGuest,
	getAllGuest,
	getDetailsGuest,
	checkSession,
	createQRWhatsapp,
	getGuest,
	sendMessage,
	isConfirmedGuest,
	deleteGuest,
	updateGuest,
	createAccompanist,
	getListGuest,
	getFormReminder,
	sendMessageReminder,
	updateAccompanist,
	deleteAccompanist,
	sendNotificacion,
} = require('../controllers/index');

const router = express.Router();

router.get('/user/:email', getUser);
router.post('/user', postUser);
router.post('/guest', createGuest);
router.delete('/guest', deleteGuest);
router.delete('/accompanist', deleteAccompanist);
router.put('/guest', updateGuest);
router.put('/accompanist', updateAccompanist);
router.get('/guest/:email', getAllGuest);
router.get('/guest/list/:email', getListGuest);
router.get('/guest/details/:email', getDetailsGuest);
router.get('/guest/form/reminder', getFormReminder);
router.post('/guest/details', createAccompanist);
router.get('/guest-invitation/:slug', getGuest);
router.get('/qr-whatsapp', createQRWhatsapp);
router.get('/check-session', checkSession);
router.post('/send-message', sendMessage);
router.post('/send-message-reminder', sendMessageReminder);
router.post('/confirmed', isConfirmedGuest);
router.post('/send-notification', sendNotificacion);

module.exports = router;
