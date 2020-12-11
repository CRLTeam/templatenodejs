const express = require('express');

const Ctrl = require('../controllers/ctrl.js');

const router = express.Router();

router.post('/template', Ctrl.addTemplate);
router.get('/template/:id', Ctrl.getTemplateById);
router.get('/templates', Ctrl.getTemplates);
router.put('/updateTemplate/:id', Ctrl.updateTemplate);

module.exports = router;