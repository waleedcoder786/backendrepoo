const express = require('express');
const router = express.Router();
const paperController = require('../controllers/paperController');

// Base Path: /api/papers
router.post('/', paperController.createPaper);              // Create new paper
router.get('/', paperController.getUserPapers);            // Get all papers (Admin + Teachers)
router.get('/:id', paperController.getPaperById);          // Get single paper details
router.put('/:id', paperController.updatePaper);            // Update paper (Designer Panel)
router.delete('/:id', paperController.deletePaper);         // Delete paper

module.exports = router;