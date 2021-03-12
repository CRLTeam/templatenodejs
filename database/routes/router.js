const express = require('express');

const templateCtrl = require('../controllers/templateCtrl.js');
const instanceCtrl = require('../controllers/instanceCtrl.js')
const contextCtrl = require('../controllers/contextCtrl.js')

const router = express.Router();

//template
router.post('/addTemplate', templateCtrl.addTemplate);
router.get('/getTemplate/:id', templateCtrl.getTemplateById);
// router.get('/templates', templateCtrl.getTemplates);
router.put('/updateTemplate/:id', templateCtrl.updateTemplate);

//instance
router.post('/addInstance', instanceCtrl.addInstance);
router.get('/getInstance/:id', instanceCtrl.getInstanceById);
// router.get('/getInstances', instanceCtrl.getInstances);
router.put('/updateInstance/:id', instanceCtrl.updateInstance);

//context
router.post('/addContext', contextCtrl.addContext);
router.get('/getContext/:id', contextCtrl.getContextById);
// router.get('/getInstances', instanceCtrl.getInstances);
router.put('/updateContext/:id', contextCtrl.updateContext);

module.exports = router;