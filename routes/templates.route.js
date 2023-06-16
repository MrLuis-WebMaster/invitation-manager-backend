const express = require('express');
const router = express.Router();
const {
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getTemplates,
  getTemplateById,
} = require('../controllers/templates.controller');

router.post('/', createTemplate);
router.put('/:templateId', updateTemplate);
router.delete('/:templateId', deleteTemplate);
router.get('/', getTemplates);
router.get('/by-id/:id', getTemplateById);

module.exports = router;
