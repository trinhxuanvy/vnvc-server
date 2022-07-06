const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/CustomerController');

router.post('/customer', CustomerController.simpleCreate);
router.get('/customer/code/:code', CustomerController.getByCode);
router.get('/customer/:id', CustomerController.getById);

module.exports = router;
