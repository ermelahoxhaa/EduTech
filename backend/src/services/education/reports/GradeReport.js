
class GradeReport {
  constructor(studentId, courseId, finalGrade, isPassed, grades) {
    this.studentId = studentId;
    this.courseId = courseId;
    this.finalGrade = finalGrade;
    this.isPassed = isPassed;
    this.grades = grades || []; 
  }
}

export default GradeReport;

