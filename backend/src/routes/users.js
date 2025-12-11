import express from 'express';
import * as userController from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, authorize(['admin']), userController.getUsers);
router.get('/teachers', authenticate, userController.getTeachers);
router.get('/students', authenticate, userController.getStudents);
router.get('/:id', authenticate, userController.getUserById);

export default router;
