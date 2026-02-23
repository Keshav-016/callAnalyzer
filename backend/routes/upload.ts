import { Router } from 'express';
import multer, { Multer } from 'multer';
import uploadController from '../controllers/uploadController.js';
import authMiddleware from '../middlewares/auth.js';

const router = Router();
const storage = multer.memoryStorage();
const upload: Multer = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

router.post('/', authMiddleware.authenticate, upload.single('file'), uploadController.upload);

export default router;
