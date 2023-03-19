const express = require('express');
const {
	createSession,
	createQRWhatsapp,
	sendMessage,
} = require('../controllers/whatsapp.controller');
const router = express.Router();

router.post('/create/session', createSession);
router.post('/create/qr', createQRWhatsapp);
router.post('/send/message', sendMessage);

module.exports = router;
