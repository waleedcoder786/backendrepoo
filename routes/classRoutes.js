const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');

// Base Path: /api/classes
router.get('/', classController.getAllClasses);            // Get all classes/subjects/chapters
router.post('/add-question', classController.addQuestion); // Sync new question to cloud bank

module.exports = router;