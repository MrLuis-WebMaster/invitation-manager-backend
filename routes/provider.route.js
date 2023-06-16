const express = require('express');
const {
	createProvider,
	getAllProviders,
	getProviderById,
	updateProvider,
	deleteProvider
} = require('../controllers/provider.controller');
const router = express.Router();

router.post('/', createProvider);
router.get('/', getAllProviders);
router.get('/:providerId', getProviderById);
router.put('/:providerId', updateProvider);
router.delete('/:providerId', deleteProvider);

module.exports = router;
