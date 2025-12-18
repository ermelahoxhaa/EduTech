import DataAccessLayer from '../../dataAccess/DataAccessLayer.js';
import StudentReport from './reports/StudentReport.js';
import CourseReport from './reports/CourseReport.js';
import AssignmentReport from './reports/AssignmentReport.js';
import SubmissionReport from './reports/SubmissionReport.js';
import GradeReport from './reports/GradeReport.js';
import MaterialReport from './reports/MaterialReport.js';
import SubmissionStatus from './SubmissionStatus.js';

class EduCoreService {
   
  async enrollStudent(sid, cid) {
    if (!sid || !cid) {
      throw new Error('Student ID and Course ID are required');
    }

    const course = await DataAccessLayer.getCourse(cid);
    if (!course) {
      throw new Error('Course not found');
    }

    const enrollments = await DataAccessLayer.getCourseEnrollments(cid);
    const isEnrolled = enrollments.some(e => e.student_id === sid);
    
    if (isEnrolled) {
      throw new Error('Student is already enrolled in this course');
    }

    const result = await DataAccessLayer.enrollStudent(cid, sid);
    return result;
  }
 
  async assignHomework(cid, title, due, maxPoints = 100) {
    if (!cid || !title) {
      throw new Error('Course ID and title are required');
    }

    const course = await DataAccessLayer.getCourse(cid);
    if (!course) {
      throw new Error('Course not found');
    }

    const assignmentData = {
      course_id: cid,
      title: title,
      due_date: due,
      max_score: maxPoints
    };

    const assignmentId = await DataAccessLayer.createAssignment(assignmentData);
    return assignmentId;
  }
   
  async submitAssignment(aid, sid, file) {
    if (!aid || !sid) {
      throw new Error('Assignment ID and Student ID are required');
    }

    const assignment = await DataAccessLayer.getAssignment(aid);
    if (!assignment) {
      throw new Error('Assignment not found');
    }

    const now = new Date();
    const dueDate = new Date(assignment.due_date);
    const isLate = now > dueDate;

    const submissionData = {
      assignment_id: aid,
      student_id: sid,
      submission_url: file || null
    };

    const submissionId = await DataAccessLayer.createSubmission(submissionData);
    
    if (isLate) {
    }

    return submissionId;
  }
   
  async gradeSubmission(subId, grade, feedback = null) {
    if (!subId || grade === null || grade === undefined) {
      throw new Error('Submission ID and grade are required');
    }

    if (grade < 0) {
      throw new Error('Grade must be non-negative');
    }

    const submission = await DataAccessLayer.getSubmission(subId);
    if (!submission) {
      throw new Error('Submission not found');
    }

    const gradeData = {
      assignment_id: submission.assignment_id,
      student_id: submission.student_id,
      score: grade,
      feedback: feedback
    };

    const gradeId = await DataAccessLayer.createGrade(gradeData);
    
    await DataAccessLayer.updateSubmission(subId, { isGraded: true });

    return gradeId;
  }
   
  async getStudentProgress(sid) {
    if (!sid) {
      throw new Error('Student ID is required');
    }

    const student = await DataAccessLayer.getUser(sid);
    if (!student) {
      throw new Error('Student not found');
    }

    const courses = await DataAccessLayer.getStudentCourses(sid);
    
    let totalAssignments = 0;
    let completedAssignments = 0;

    for (const course of courses) {
      const assignments = await DataAccessLayer.getAssignmentsByCourseId(course.id);
      totalAssignments += assignments.length;

      for (const assignment of assignments) {
        const submission = await DataAccessLayer.getSubmissionByAssignmentAndStudent(
          assignment.id,
          sid
        );
        if (submission && submission.isGraded) {
          completedAssignments++;
        }
      }
    }

    const progressPercentage = totalAssignments > 0 
      ? Math.round((completedAssignments / totalAssignments) * 100)
      : 0;

    return new StudentReport(sid, student.name, progressPercentage);
  }

  async getCourseOverview(cid) {
    if (!cid) {
      throw new Error('Course ID is required');
    }

    const course = await DataAccessLayer.getCourse(cid);
    if (!course) {
      return null;
    }

    const teacher = await DataAccessLayer.getUser(course.teacher_id);
    const enrollments = await DataAccessLayer.getCourseEnrollments(cid);
    const studentCount = enrollments.length;

    return new CourseReport(
      course.id,
      course.title,
      teacher ? teacher.name : 'Unknown',
      studentCount
    );
  }
  
  async getAssignmentReport(aid) {
    if (!aid) {
      throw new Error('Assignment ID is required');
    }

    const assignment = await DataAccessLayer.getAssignment(aid);
    if (!assignment) {
      throw new Error('Assignment not found');
    }

    return new AssignmentReport(
      assignment.id,
      assignment.title,
      assignment.due_date,
      assignment.max_score
    );
  }
   
  async getSubmissionReport(subId) {
    if (!subId) {
      throw new Error('Submission ID is required');
    }

    const submission = await DataAccessLayer.getSubmission(subId);
    if (!submission) {
      throw new Error('Submission not found');
    }

    let status = SubmissionStatus.SUBMITTED;
    if (submission.isGraded) {
      status = SubmissionStatus.GRADED;
    } else {
      const assignment = await DataAccessLayer.getAssignment(submission.assignment_id);
      if (assignment) {
        const submitDate = new Date(submission.submitted_at);
        const dueDate = new Date(assignment.due_date);
        if (submitDate > dueDate) {
          status = SubmissionStatus.LATE;
        }
      }
    }

    const grades = await DataAccessLayer.getGradesByAssignment(submission.assignment_id);
    const grade = grades.find(g => g.student_id === submission.student_id);
    const pointsReceived = grade ? grade.score : null;

    return new SubmissionReport(
      submission.id,
      status,
      pointsReceived,
      submission.submitted_at
    );
  }
  async getGradeReport(sid, cid = null) {
    if (!sid) {
      throw new Error('Student ID is required');
    }

    const student = await DataAccessLayer.getUser(sid);
    if (!student) {
      throw new Error('Student not found');
    }

    let grades;
    let finalGrade = null;
    let courseId = cid;

    if (cid) {
      grades = await DataAccessLayer.getGradesByStudentAndCourse(sid, cid);
      const enrollments = await DataAccessLayer.getCourseEnrollments(cid);
      const enrollment = enrollments.find(e => e.student_id === sid);
      if (enrollment) {
        finalGrade = enrollment.final_grade;
      }
    } else {
      const courses = await DataAccessLayer.getStudentCourses(sid);
      grades = [];
      
      for (const course of courses) {
        const courseGrades = await DataAccessLayer.getGradesByStudentAndCourse(sid, course.id);
        grades = grades.concat(courseGrades);
        
        if (courses.length === 1) {
          courseId = course.id;
          const enrollments = await DataAccessLayer.getCourseEnrollments(course.id);
          const enrollment = enrollments.find(e => e.student_id === sid);
          if (enrollment) {
            finalGrade = enrollment.final_grade;
          }
        }
      }
    }

    const isPassed = finalGrade !== null && finalGrade >= 2.0;

    return new GradeReport(sid, courseId, finalGrade, isPassed, grades);
  }
   
  async getMaterialReport(mid) {
    if (!mid) {
      throw new Error('Material ID is required');
    }

    const material = await DataAccessLayer.getMaterial(mid);
    if (!material) {
      throw new Error('Material not found');
    }

    return new MaterialReport(
      material.id,
      material.title,
      material.type,
      material.url
    );
  }
  async getCourses() {
    return await DataAccessLayer.getCourses();
  }
  async getCourse(id) {
    return await DataAccessLayer.getCourse(id);
  }
  async createCourse(courseData) {
    return await DataAccessLayer.createCourse(courseData);
  }
   
  async updateCourse(id, courseData) {
    return await DataAccessLayer.updateCourse(id, courseData);
  }
   
  async deleteCourse(id) {
    return await DataAccessLayer.deleteCourse(id);
  }

  async getStudentCourses(studentId) {
    return await DataAccessLayer.getStudentCourses(studentId);
  }

  async getTeacherCourses(teacherId) {
    return await DataAccessLayer.getTeacherCourses(teacherId);
  }

  async getCourseEnrollments(courseId) {
    return await DataAccessLayer.getCourseEnrollments(courseId);
  }

  async unenrollStudent(courseId, studentId) {
    return await DataAccessLayer.unenrollStudent(courseId, studentId);
  }

  async updateFinalGrade(courseId, studentId, finalGrade) {
    return await DataAccessLayer.updateFinalGrade(courseId, studentId, finalGrade);
  }

  async createAssignment(assignmentData) {
    return await DataAccessLayer.createAssignment(assignmentData);
  }

  async getAssignment(id) {
    return await DataAccessLayer.getAssignment(id);
  }

  async getAssignmentsByCourseId(courseId) {
    return await DataAccessLayer.getAssignmentsByCourseId(courseId);
  }

  async getAllAssignments() {
    return await DataAccessLayer.getAssignments();
  }

  async updateAssignment(id, assignmentData) {
    return await DataAccessLayer.updateAssignment(id, assignmentData);
  }

  async deleteAssignment(id) {
    return await DataAccessLayer.deleteAssignment(id);
  }

  async getSubmission(id) {
    return await DataAccessLayer.getSubmission(id);
  }

  async getSubmissionByAssignmentAndStudent(assignmentId, studentId) {
    return await DataAccessLayer.getSubmissionByAssignmentAndStudent(assignmentId, studentId);
  }

  async getSubmissionsByAssignment(assignmentId) {
    return await DataAccessLayer.getSubmissionsByAssignment(assignmentId);
  }

  async updateSubmission(id, submissionData) {
    return await DataAccessLayer.updateSubmission(id, submissionData);
  }

  async deleteSubmission(id) {
    return await DataAccessLayer.deleteSubmission(id);
  }

  async getGradesByStudentAndCourse(studentId, courseId) {
    return await DataAccessLayer.getGradesByStudentAndCourse(studentId, courseId);
  }

  async getGradesByAssignment(assignmentId) {
    return await DataAccessLayer.getGradesByAssignment(assignmentId);
  }

  async getGrade(id) {
    return await DataAccessLayer.getGrade(id);
  }

  async createGrade(gradeData) {
    return await DataAccessLayer.createGrade(gradeData);
  }

  async updateGrade(id, gradeData) {
    return await DataAccessLayer.updateGrade(id, gradeData);
  }

  async deleteGradesByStudentAndCourse(studentId, courseId) {
    return await DataAccessLayer.deleteGradesByStudentAndCourse(studentId, courseId);
  }

  async getMaterialsByCourseId(courseId) {
    return await DataAccessLayer.getMaterialsByCourseId(courseId);
  }

  async getMaterial(id) {
    return await DataAccessLayer.getMaterial(id);
  }

  async createMaterial(materialData) {
    return await DataAccessLayer.createMaterial(materialData);
  }

  async updateMaterial(id, materialData) {
    return await DataAccessLayer.updateMaterial(id, materialData);
  }

  async deleteMaterial(id) {
    return await DataAccessLayer.deleteMaterial(id);
  }
}

export default new EduCoreService();

