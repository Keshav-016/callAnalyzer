import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Storage } from '@google-cloud/storage';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BUCKET = process.env.STORAGE_BUCKET;

interface FileObj {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
}

let storageClient: Storage | null;
try {
  storageClient = new Storage();
} catch (e) {
  storageClient = null;
}

export const uploadFile = async (file: FileObj, destPath: string): Promise<string> => {
  // file: { originalname, buffer, mimetype }
  if (storageClient && BUCKET) {
    const bucket = storageClient.bucket(BUCKET);
    const fileObj = bucket.file(destPath);
    const stream = fileObj.createWriteStream({ metadata: { contentType: file.mimetype } });
    return new Promise((resolve, reject) => {
      stream.on('error', reject);
      stream.on('finish', () => resolve(`gs://${BUCKET}/${destPath}`));
      stream.end(file.buffer);
    });
  }

  // Fallback: save locally to uploads/
  const uploadsDir = path.resolve(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  const outPath = path.join(uploadsDir, destPath.replace(/\//g, '_'));
  fs.writeFileSync(outPath, file.buffer);
  return outPath;
};

export default { uploadFile };
