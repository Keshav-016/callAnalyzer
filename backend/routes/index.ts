import { Router } from 'express';
import healthController from '../controllers/healthController.js';
import authRoutes from './auth.js';
import uploadRoutes from './upload.js';
import callsRoutes from './calls.js';
import authMiddleware from '../middlewares/auth.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/upload', uploadRoutes);
router.use('/calls', callsRoutes);

router.get('/health', healthController.health);
router.get('/', (req, res) => res.json({ status: 'ok', service: 'call-analyzer-backend' }));

// Example protected route
router.get('/protected', authMiddleware.authenticate, (req, res) => {
  res.json({ msg: 'protected content', user: req.user });
});

export default router;
