import DataAccessLayer from '../dataAccess/DataAccessLayer.js';

export const getStudentGradesForCourse = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;
    const grades = await DataAccessLayer.getGradesByStudentAndCourse(studentId, courseId);
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
    const { assignment_id, student_id, score, feedback } = req.body;

    if (!assignment_id || !student_id) {
      return res.status(400).json({
        success: false,
        message: 'Assignment ID and Student ID are required'
      });
    }

    const gradeData = {
      assignment_id,
      student_id,
      score: score !== null && score !== undefined ? parseInt(score) : null,
      feedback: feedback || null
    };

    const gradeId = await DataAccessLayer.createGrade(gradeData);
    const grade = await DataAccessLayer.getGrade(gradeId);
    
    res.status(201).json({
      success: true,
      data: grade
    });
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
    const grades = await DataAccessLayer.getGradesByAssignment(assignmentId);
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

