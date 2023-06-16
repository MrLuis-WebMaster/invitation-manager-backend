const express = require('express');
const usersRouter = require('./users.route');
const guestsRouter = require('./guests.route');
const notificationRouter = require('./notifications.route');
const whatsappRouter = require('./whatsapp.route');
const stripeRouter = require('./stripe.route');
const eventRouter = require('./event.route');
const eventTemplateRouter = require('./eventTemplate.route');
const expenseRouter = require('./expense.route');
const taskRouter = require('./task.route');
const templatesRouter = require('./templates.route');
const providersRouter = require('./provider.route');

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
router.use('/stripe', stripeRouter);
router.use('/event', eventRouter);
router.use('/event/template', eventTemplateRouter);
router.use('/expense', expenseRouter);
router.use('/task', taskRouter);
router.use('/templates', templatesRouter);
router.use('/providers', providersRouter);

module.exports = router;
