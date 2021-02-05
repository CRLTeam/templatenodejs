const express = require('express');

// const templateCtrl = require('../controllers/templateCtrl.js');
const instanceCtrl = require('../controllers/instanceCtrl.js')

const router = express.Router();

//template
// router.post('/template', templateCtrl.addTemplate);
// router.get('/template/:id', templateCtrl.getTemplateById);
// router.get('/templates', templateCtrl.getTemplates);
// router.put('/updateTemplate/:id', templateCtrl.updateTemplate);

//instance
router.post('/addInstance', instanceCtrl.addInstance);
router.get('/getInstance/:id', instanceCtrl.getInstanceById);
// router.get('/getInstances', instanceCtrl.getInstances);
router.put('/updateInstance/:id', instanceCtrl.updateInstance);

module.exports = router;