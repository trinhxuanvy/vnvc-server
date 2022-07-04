const express = require('express');
const router = express.Router();
const VaccineController = require('../controllers/VaccineController');

router.post('/vaccine', VaccineController.simpleCreate);

module.exports = router;
