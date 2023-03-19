const express = require('express');
const {
	createGuest,
	getGuest,
	deleteGuest,
	updateGuest,
	getDetailsGuest,
	getAllGuest,
	getListGuest,
	getFormReminder,
	isConfirmedGuest,
	createAccompanist,
	deleteAccompanist,
	updateAccompanist,
} = require('../controllers/guests.controller');
const router = express.Router();

router.post('/', createGuest);
router.delete('/', deleteGuest);
router.put('/', updateGuest);
router.get('/guest-invitation/:slug', getGuest);
router.get('/:email', getAllGuest);
router.get('/details/:email', getDetailsGuest);
router.get('/list/:email', getListGuest);
router.get('/guest/form/reminder', getFormReminder);
router.post('/confirmed', isConfirmedGuest);
router.post('/details', createAccompanist);
router.delete('/accompanist', deleteAccompanist);
router.put('/accompanist', updateAccompanist);

module.exports = router;
