const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');

router.post('/category', CategoryController.simpleCreate);

module.exports = router;
