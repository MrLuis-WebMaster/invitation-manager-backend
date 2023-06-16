const express = require('express');
const { postOrder, completedPayment, getSubscriptions } = require('../controllers/stripe.controller');
const bodyParser = require('body-parser');

const router = express.Router();

router.post('/create/order', postOrder);
router.get('/:customerId/subcriptions', getSubscriptions);
router.post('/webhook', bodyParser.raw({ type: 'application/json' }),completedPayment);

module.exports = router;
