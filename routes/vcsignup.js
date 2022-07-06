const express = require('express');
const router = express.Router();
const VCSignupController = require('../controllers/VCSignupController');

router.post('/vcsignup', VCSignupController.create);

module.exports = router;
