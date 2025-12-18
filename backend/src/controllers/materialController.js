import DataAccessLayer from '../dataAccess/DataAccessLayer.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadsDir = path.join(process.cwd(), 'uploads', 'materials');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
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

export const uploadMaterial = upload.single('file');

export const createMaterial = async (req, res) => {
  try {
    const materialId = await DataAccessLayer.createMaterial(req.body);
    const material = await DataAccessLayer.getMaterial(materialId);
    res.status(201).json({
      success: true,
      data: material
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create material',
      error: error.message
    });
  }
};

export const createMaterialWithFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const fileUrl = `/uploads/materials/${req.file.filename}`;
    const materialData = {
      title: req.body.title,
      type: req.body.type,
      url: fileUrl,
      course_id: req.body.course_id
    };

    const materialId = await DataAccessLayer.createMaterial(materialData);
    const material = await DataAccessLayer.getMaterial(materialId);
    
    res.status(201).json({
      success: true,
      data: material
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({
      success: false,
      message: 'Failed to upload material',
      error: error.message
    });
  }
};

export const getMaterialsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const materials = await DataAccessLayer.getMaterialsByCourseId(courseId);
    res.json({
      success: true,
      data: materials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch materials',
      error: error.message
    });
  }
};

export const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await DataAccessLayer.updateMaterial(id, req.body);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }
    const material = await DataAccessLayer.getMaterial(id);
    res.json({
      success: true,
      data: material
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update material',
      error: error.message
    });
  }
};

export const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DataAccessLayer.deleteMaterial(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }
    res.json({
      success: true,
      message: 'Material deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete material',
      error: error.message
    });
  }
};

