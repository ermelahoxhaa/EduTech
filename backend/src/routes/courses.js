import express from 'express';
import * as courseController from '../controllers/courseController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/public', courseController.getPublicCourses);

router.get('/student/enrolled', authenticate, authorize(['student']), courseController.getStudentEnrolledCourses);
router.get('/teacher/my-courses', authenticate, authorize(['teacher']), courseController.getTeacherCourses);

router.get('/', authenticate, courseController.getCourses);
router.post('/', authenticate, authorize(['admin', 'teacher']), courseController.createCourse);

router.get('/:courseId/enrollments', authenticate, courseController.getCourseEnrollments);
router.post('/:courseId/enroll', authenticate, authorize(['admin', 'teacher']), courseController.enrollStudent);
router.delete('/:courseId/enroll/:studentId', authenticate, authorize(['admin', 'teacher']), courseController.unenrollStudent);
router.post('/:id/final-grade', authenticate, authorize(['admin', 'teacher']), courseController.updateFinalGrade);

router.get('/:id', authenticate, courseController.getCourse);
router.put('/:id', authenticate, authorize(['admin', 'teacher']), courseController.updateCourse);
router.delete('/:id', authenticate, authorize(['admin']), courseController.deleteCourse);

export default router;
