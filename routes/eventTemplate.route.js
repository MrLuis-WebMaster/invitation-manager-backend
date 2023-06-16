const express = require('express');
const {
  createEventTemplate,
  updateEventTemplate,
  deleteEventTemplate,
  getEventTemplateById,
} = require('../controllers/eventTemplate.controller');
const router = express.Router();

router.post('/', createEventTemplate);
router.put('/:id', updateEventTemplate);
router.delete('/:id', deleteEventTemplate);
router.get('/:id', getEventTemplateById);

module.exports = router;
