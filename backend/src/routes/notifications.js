import express from 'express';
import * as notificationController from '../controllers/notificationController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/student', authenticate, notificationController.getStudentNotifications);

router.get('/', authenticate, authorize(['admin', 'teacher']), notificationController.getNotifications);
router.get('/:id', authenticate, notificationController.getNotificationById);
router.post('/', authenticate, authorize(['admin', 'teacher']), notificationController.createNotification);
router.put('/:id', authenticate, authorize(['admin', 'teacher']), notificationController.updateNotification);
router.delete('/:id', authenticate, authorize(['admin', 'teacher']), notificationController.deleteNotification);

export default router;
