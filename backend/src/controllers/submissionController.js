import EduCoreService from '../services/education/EduCoreService.js';
import FileStorageService from '../services/system/FileStorageService.js';
import fs from 'fs';

export const uploadSubmission = FileStorageService.getSubmissionUpload().single('file');

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

    const submissionId = await EduCoreService.submitAssignment(assignment_id, student_id, submission_url);
    const submission = await EduCoreService.getSubmissionByAssignmentAndStudent(assignment_id, student_id);
    
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
    const submissionId = await EduCoreService.submitAssignment(assignment_id, student_id, fileUrl);
    const submission = await EduCoreService.getSubmissionByAssignmentAndStudent(assignment_id, student_id);
    
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
    
    const submission = await EduCoreService.getSubmissionByAssignmentAndStudent(assignmentId, studentId);
    
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
    const submissions = await EduCoreService.getSubmissionsByAssignment(assignmentId);
    
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
    
    const updated = await EduCoreService.updateSubmission(id, { submission_url });
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }
    
    const submission = await EduCoreService.getSubmission(id);
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
    const deleted = await EduCoreService.deleteSubmission(id);
    
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

