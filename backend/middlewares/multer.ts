import multer, { type Multer } from 'multer';
import path from 'node:path';
import fs from 'node:fs';

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), 'uploads/audio');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const fileName = file.originalname + Date.now();
    cb(null, `call-${fileName}`);
  },
});

const upload: Multer = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedExt = ['.mp3', '.wav', '.m4a'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (file.mimetype.startsWith('audio/') && allowedExt.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid audio file type'));
    }
  },
});

export default upload;
