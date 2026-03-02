import { Router } from 'express';
import uploadController from '../controllers/uploadController.js';
import authMiddleware from '../middlewares/auth.js';
import upload from '../middlewares/multer.js';

const router = Router();

router.post('/', authMiddleware.authenticate, upload.single('file'), uploadController.upload);

export default router;
