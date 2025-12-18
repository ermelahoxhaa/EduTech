import EduCoreService from '../services/education/EduCoreService.js';

export const createAssignment = async (req, res) => {
  try {
    const { course_id, title, due_date, max_score } = req.body;
    const assignmentId = await EduCoreService.assignHomework(
      course_id,
      title,
      due_date,
      max_score
    );
    const assignment = await EduCoreService.getAssignment(assignmentId);
    res.status(201).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create assignment',
      error: error.message
    });
  }
};

export const getAssignmentsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const assignments = await EduCoreService.getAssignmentsByCourseId(courseId);
    res.json({
      success: true,
      data: assignments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assignments',
      error: error.message
    });
  }
};

export const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await EduCoreService.updateAssignment(id, req.body);
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    const assignment = await EduCoreService.getAssignment(id);
    res.json({
      success: true,
      data: assignment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update assignment',
      error: error.message
    });
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await EduCoreService.deleteAssignment(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    res.json({
      success: true,
      message: 'Assignment deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to delete assignment',
      error: error.message
    });
  }
};
