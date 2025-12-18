import EduCoreService from '../services/education/EduCoreService.js';
import FileStorageService from '../services/system/FileStorageService.js';
import fs from 'fs';

export const uploadMaterial = FileStorageService.getMaterialUpload().single('file');

export const createMaterial = async (req, res) => {
  try {
    const materialId = await EduCoreService.createMaterial(req.body);
    const material = await EduCoreService.getMaterial(materialId);
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

    const materialId = await EduCoreService.createMaterial(materialData);
    const material = await EduCoreService.getMaterial(materialId);
    
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
    const materials = await EduCoreService.getMaterialsByCourseId(courseId);
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
    const updated = await EduCoreService.updateMaterial(id, req.body);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }
    const material = await EduCoreService.getMaterial(id);
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
    const deleted = await EduCoreService.deleteMaterial(id);
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

