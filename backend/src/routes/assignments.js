const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { isAuthenticated, isProfessorOrAdmin } = require('../middleware/auth');

router.use(isAuthenticated);
router.post('/', isProfessorOrAdmin, assignmentController.createAssignment);
router.get('/course/:courseId', assignmentController.getAssignmentsByCourse);
router.put('/:id', isProfessorOrAdmin, assignmentController.updateAssignment);
router.delete('/:id', isProfessorOrAdmin, assignmentController.deleteAssignment);

module.exports = router;
