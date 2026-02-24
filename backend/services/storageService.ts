import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Storage } from '@google-cloud/storage';
import env from '../utils/Env.js';

interface FileObj {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
}

class StorageService {
  private readonly storageClient: Storage | null;
  private readonly bucket: string;
  private readonly dirname: string;

  constructor() {
    try {
      this.storageClient = new Storage();
      console.log('[Storage] Client initialized');
    } catch (e) {
      console.error('[Storage] Failed to initialize client:', e);
      this.storageClient = null;
    }
    this.bucket = env.STORAGE_BUCKET;
    this.dirname = path.dirname(fileURLToPath(import.meta.url));
  }

  uploadFile = async (file: FileObj, destPath: string): Promise<string> => {
    // file: { originalname, buffer, mimetype }
    if (this.storageClient && this.bucket) {
      const bucketObj = this.storageClient.bucket(this.bucket);
      const fileObj = bucketObj.file(destPath);
      const stream = fileObj.createWriteStream({ metadata: { contentType: file.mimetype } });
      return new Promise((resolve, reject) => {
        stream.on('error', reject);
        stream.on('finish', () => {
          const url = `gs://${this.bucket}/${destPath}`;
          console.log(`[Storage] File uploaded: ${url}`);
          resolve(url);
        });
        stream.end(file.buffer);
      });
    }

    // Fallback: save locally to uploads/
    const uploadsDir = path.resolve(this.dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    const outPath = path.join(uploadsDir, destPath.replace(/\//g, '_'));
    fs.writeFileSync(outPath, file.buffer);
    console.log(`[Storage] File saved locally: ${outPath}`);
    return outPath;
  };
}

export default new StorageService();
