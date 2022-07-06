const express = require('express');
const router = express.Router();
const InjectorController = require('../controllers/InjectorController');

router.post('/injector', InjectorController.simpleCreate);
router.get('/injector/customer/code', InjectorController.getByCode);
router.get('/injector/customer/:id', InjectorController.getByCustomerId);

module.exports = router;
