const express = require('express');
const router = express.Router();
const InjectorController = require('../controllers/InjectorController');

router.post('/injector', InjectorController.simpleCreate);
router.get('/injector/code/:code', InjectorController.getByCode);

module.exports = router;
