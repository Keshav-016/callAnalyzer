import { Router } from 'express';
import authRoutes from './auth.js';
import uploadRoutes from './upload.js';
import callsRoutes from './calls.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/upload', uploadRoutes);
router.use('/calls', callsRoutes);

export default router;
