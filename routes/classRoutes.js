const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');

// Base Path: /api/classes
router.get('/', classController.getAllClasses);            
router.post('/add-question', classController.addQuestion); 
router.delete('/delete-bulk', classController.deleteBulkQuestions); 
router.delete('/hierarchy-delete', classController.deleteHierarchy);
module.exports = router;