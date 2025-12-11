import express from 'express';
import * as courseController from '../controllers/courseController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', courseController.getCourses);
router.post('/', authenticate, authorize(['admin', 'teacher']), courseController.createCourse);
router.put('/:id', authenticate, authorize(['admin', 'teacher']), courseController.updateCourse);
router.delete('/:id', authenticate, authorize(['admin']), courseController.deleteCourse);
router.get('/:courseId/enrollments', authenticate, courseController.getCourseEnrollments);
router.post('/:courseId/enroll', authenticate, authorize(['admin', 'teacher']), courseController.enrollStudent);
router.delete('/:courseId/enroll/:studentId', authenticate, authorize(['admin', 'teacher']), courseController.unenrollStudent);

export default router;
