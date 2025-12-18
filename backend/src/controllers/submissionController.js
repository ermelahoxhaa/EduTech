import DataAccessLayer from '../dataAccess/DataAccessLayer.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadsDir = path.join(process.cwd(), 'uploads', 'submissions');

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

export const uploadSubmission = upload.single('file');

export const createSubmission = async (req, res) => {
  try {
    const { assignment_id, submission_url } = req.body;
    const student_id = req.user.id;

    if (!assignment_id) {
      return res.status(400).json({
        success: false,
        message: 'Assignment ID is required'
      });
    }

    const submissionData = {
      assignment_id,
      student_id,
      submission_url: submission_url || null
    };

    const submissionId = await DataAccessLayer.createSubmission(submissionData);
    const submission = await DataAccessLayer.getSubmissionByAssignmentAndStudent(assignment_id, student_id);
    
    res.status(201).json({
      success: true,
      data: submission
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create submission',
      error: error.message
    });
  }
};

export const createSubmissionWithFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const assignment_id = req.body.assignment_id;
    const student_id = req.user.id;

    if (!assignment_id) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: 'Assignment ID is required'
      });
    }

    const fileUrl = `/uploads/submissions/${req.file.filename}`;
    const submissionData = {
      assignment_id,
      student_id,
      submission_url: fileUrl
    };

    const submissionId = await DataAccessLayer.createSubmission(submissionData);
    const submission = await DataAccessLayer.getSubmissionByAssignmentAndStudent(assignment_id, student_id);
    
    res.status(201).json({
      success: true,
      data: submission
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({
      success: false,
      message: 'Failed to upload submission',
      error: error.message
    });
  }
};

export const getSubmissionByAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const studentId = req.user.id;
    
    const submission = await DataAccessLayer.getSubmissionByAssignmentAndStudent(assignmentId, studentId);
    
    res.json({
      success: true,
      data: submission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submission',
      error: error.message
    });
  }
};

export const getSubmissionsByAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const submissions = await DataAccessLayer.getSubmissionsByAssignment(assignmentId);
    
    res.json({
      success: true,
      data: submissions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submissions',
      error: error.message
    });
  }
};

export const updateSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { submission_url } = req.body;
    
    const updated = await DataAccessLayer.updateSubmission(id, { submission_url });
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }
    
    const submission = await DataAccessLayer.getSubmission(id);
    res.json({
      success: true,
      data: submission
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update submission',
      error: error.message
    });
  }
};

export const deleteSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DataAccessLayer.deleteSubmission(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Submission deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete submission',
      error: error.message
    });
  }
};

