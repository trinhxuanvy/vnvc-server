const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/CategoryController");

router.post("/category", CategoryController.simpleCreate);
router.get("/category", CategoryController.getCategories);

module.exports = router;
