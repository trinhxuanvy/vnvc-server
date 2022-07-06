const express = require('express');
const router = express.Router();
const VCCenterController = require('../controllers/VCCenterController');

router.get('/vccenter', VCCenterController.getAll);

module.exports = router;
