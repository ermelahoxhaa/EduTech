import express from 'express';
import * as materialController from '../controllers/materialController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, authorize(['admin', 'teacher']), materialController.createMaterial);
router.post('/upload', authenticate, authorize(['admin', 'teacher']), materialController.uploadMaterial, materialController.createMaterialWithFile);
router.get('/course/:courseId', authenticate, materialController.getMaterialsByCourse);
router.put('/:id', authenticate, authorize(['admin', 'teacher']), materialController.updateMaterial);
router.delete('/:id', authenticate, authorize(['admin', 'teacher']), materialController.deleteMaterial);

export default router;

