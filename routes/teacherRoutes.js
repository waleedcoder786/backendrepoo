const express = require('express');
const router = express.Router();
const teacherCtrl = require('../controllers/teacherController');

router.post('/', teacherCtrl.createTeacher);
router.get('/', teacherCtrl.getTeachersByAdmin);
router.put('/:id', teacherCtrl.updateTeacher);
router.delete('/:id', teacherCtrl.deleteTeacher);

module.exports = router;