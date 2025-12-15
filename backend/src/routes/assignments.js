import express from 'express';
import * as assignmentController from '../controllers/assignmentController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, authorize(['admin', 'teacher']), assignmentController.createAssignment);
router.get('/course/:courseId', authenticate, assignmentController.getAssignmentsByCourse);
router.put('/:id', authenticate, authorize(['admin', 'teacher']), assignmentController.updateAssignment);
router.delete('/:id', authenticate, authorize(['admin', 'teacher']), assignmentController.deleteAssignment);

export default router;
