import express from 'express';
import * as gradeController from '../controllers/gradeController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/student/:studentId/course/:courseId', authenticate, authorize(['student', 'teacher', 'admin']), gradeController.getStudentGradesForCourse);
router.get('/assignment/:assignmentId', authenticate, authorize(['teacher', 'admin']), gradeController.getGradesByAssignment);
router.post('/', authenticate, authorize(['teacher', 'admin']), gradeController.createOrUpdateGrade);
router.put('/:id', authenticate, authorize(['teacher', 'admin']), gradeController.createOrUpdateGrade);

export default router;

