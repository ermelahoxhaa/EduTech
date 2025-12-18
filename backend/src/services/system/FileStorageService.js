import multer from 'multer';
import path from 'path';
import fs from 'fs';
import LoggingService from './LoggingService.js';

class FileStorageService {
  constructor() {
    this.logger = LoggingService;
    this.uploadsDir = path.join(process.cwd(), 'uploads');
    this._ensureDirectories();
  }

  _ensureDirectories() {
    const dirs = [
      this.uploadsDir,
      path.join(this.uploadsDir, 'materials'),
      path.join(this.uploadsDir, 'submissions')
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  getStorage(type = 'materials') {
    const uploadDir = path.join(this.uploadsDir, type);

    return multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
      }
    });
  }

  getMaterialUpload() {
    return multer({
      storage: this.getStorage('materials'),
      limits: {
        fileSize: 50 * 1024 * 1024 
      },
      fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|mp4|avi|mov/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
          return cb(null, true);
        } else {
          cb(new Error('Invalid file type. Only images, PDFs, documents, and videos are allowed.'));
        }
      }
    });
  }

  getSubmissionUpload() {
    return multer({
      storage: this.getStorage('submissions'),
      limits: {
        fileSize: 50 * 1024 * 1024 
      },
      fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|zip|rar|mp4|avi|mov/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
          return cb(null, true);
        } else {
          cb(new Error('Invalid file type. Only documents, images, videos, and archives are allowed.'));
        }
      }
    });
  }

  async uploadFile(filePath) {

    return filePath;
  }

  async downloadFile(fileId) {
    const filePath = path.join(this.uploadsDir, fileId);
    
    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }

    return filePath;
  }

  async deleteFile(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        this.logger.logInfo('File deleted', { filePath });
        return true;
      }
      return false;
    } catch (error) {
      this.logger.logError('Failed to delete file', { filePath, error: error.message });
      throw error;
    }
  }
}

export default new FileStorageService();

