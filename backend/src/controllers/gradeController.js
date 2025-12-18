import EduCoreService from '../services/education/EduCoreService.js';

export const getStudentGradesForCourse = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;
    const grades = await EduCoreService.getGradesByStudentAndCourse(studentId, courseId);
    res.json({
      success: true,
      data: grades
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student grades',
      error: error.message
    });
  }
};

export const createOrUpdateGrade = async (req, res) => {
  try {
    const { submission_id, assignment_id, student_id, score, feedback } = req.body;

    if (!assignment_id || !student_id) {
      return res.status(400).json({
        success: false,
        message: 'Assignment ID and Student ID are required'
      });
    }

    if (submission_id) {
      const gradeId = await EduCoreService.gradeSubmission(
        submission_id,
        score !== null && score !== undefined ? parseInt(score) : 0,
        feedback || null
      );
      const grade = await EduCoreService.getGrade(gradeId);
      res.status(201).json({
        success: true,
        data: grade
      });
    } else {
      const gradeData = {
        assignment_id,
        student_id,
        score: score !== null && score !== undefined ? parseInt(score) : null,
        feedback: feedback || null
      };
      const gradeId = await EduCoreService.createGrade(gradeData);
      const grade = await EduCoreService.getGrade(gradeId);
      res.status(201).json({
        success: true,
        data: grade
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to save grade',
      error: error.message
    });
  }
};

export const getGradesByAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const grades = await EduCoreService.getGradesByAssignment(assignmentId);
    res.json({
      success: true,
      data: grades
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch grades',
      error: error.message
    });
  }
};

export const deleteStudentGrades = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;
    const deleted = await EduCoreService.deleteGradesByStudentAndCourse(studentId, courseId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'No grades found to delete'
      });
    }
    res.json({
      success: true,
      message: 'All grades deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete grades',
      error: error.message
    });
  }
};

