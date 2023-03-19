const express = require('express');
const { getUser, postUser } = require('../controllers/users.controller');
const router = express.Router();

router.get('/:email', getUser);
router.post('/', postUser);

module.exports = router;
