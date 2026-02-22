import { Router } from 'express';
import callsController from '../controllers/callsController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.get('/', authenticate, callsController.listCalls);
router.get('/:id', authenticate, callsController.getCall);

export default router;
