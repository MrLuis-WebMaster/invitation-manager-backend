const express = require('express');
const { sendNotificacion } = require('../controllers/notifications.controller');
const router = express.Router();

router.post('/email', sendNotificacion);

module.exports = router;
