import { Router } from 'express';
import callsController from '../controllers/callsController.js';
import authMiddleware from '../middlewares/auth.js';

const router = Router();

router.get('/', authMiddleware.authenticate, callsController.listCalls);
router.get('/:id', authMiddleware.authenticate, callsController.getCall);

export default router;
