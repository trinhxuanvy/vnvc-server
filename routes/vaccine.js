const express = require('express');
const router = express.Router();
const VaccineController = require('../controllers/VaccineController');

router.post('/vaccine', VaccineController.simpleCreate);
router.get('/vaccine', VaccineController.getBySellType);
router.get('/vaccine/:id', VaccineController.getByById);

module.exports = router;
