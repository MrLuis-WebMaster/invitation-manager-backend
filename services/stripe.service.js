const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { ErrorObject } = require('../helpers');
const { User } = require('../database/models');

exports.createCustomerStripe = async email => {
	try {
		const customer = await stripe.customers.create({ email });
		await User.update({ customerId: customer.id }, { where: { email } });
		return customer;
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};
exports.createOrderStripe = async customerId => {
	try {
		const subscription = await stripe.subscriptions.create({
			customer: customerId,
			items: [{ price: `${process.env.STRIPE_SUBSCRIPTION}` }],
			payment_behavior: 'default_incomplete',
			expand: ['latest_invoice.payment_intent'],
		});

		if (subscription && subscription.latest_invoice) {
			return subscription.latest_invoice.payment_intent.client_secret;
		}
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};
exports.completedPayment = async req => {
	try {
		const event = stripe.webhooks.constructEvent(
			req.body,
			req.header('Stripe-Signature'),
			`${process.env.STRIPE_WEBHOOK_SECRET}`
		);

		if (event.type === 'invoice.payment_succeeded') {
			if (event.data.object.billing_reason === 'subscription_create') {
				const subscriptionId = event.data.object.subscription;
				const paymentIntentId = event.data.object.payment_intent;
				const paymentIntent = await stripe.paymentIntents.retrieve(
					paymentIntentId
				);
				await stripe.subscriptions.update(subscriptionId, {
					default_payment_method: paymentIntent.payment_method,
				});
				await User.update(
					{ isActive: true },
					{ where: { customerId: event.data.object.customer } }
				);
			}
		}

		return event.data.object;
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};
exports.getSubscriptionsService = async customerId => {
	try {
		const subscriptions = await stripe.subscriptions.list({
			customer: customerId,
			status: 'active',
			expand: ['data.default_payment_method'],
		});
		return subscriptions.data;
	} catch (error) {
		throw new ErrorObject(error.message, error.statusCode || 500);
	}
};
