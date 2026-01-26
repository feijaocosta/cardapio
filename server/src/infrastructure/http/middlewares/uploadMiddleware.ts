import multer from 'multer';
import path from 'path';

const uploadDir = path.join(__dirname, '../../../uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

export const uploadMiddleware = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
