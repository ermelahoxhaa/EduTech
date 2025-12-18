import express from 'express';
import * as submissionController from '../controllers/submissionController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, authorize(['student']), submissionController.createSubmission);
router.post('/upload', authenticate, authorize(['student']), submissionController.uploadSubmission, submissionController.createSubmissionWithFile);
router.get('/assignment/:assignmentId', authenticate, authorize(['student']), submissionController.getSubmissionByAssignment);
router.get('/assignment/:assignmentId/all', authenticate, authorize(['admin', 'teacher']), submissionController.getSubmissionsByAssignment);
router.put('/:id', authenticate, authorize(['student']), submissionController.updateSubmission);
router.delete('/:id', authenticate, authorize(['student']), submissionController.deleteSubmission);

export default router;

