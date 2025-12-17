import DataAccessLayer from '../dataAccess/DataAccessLayer.js';


export const getCourses = async (req, res) => {
  try {
    const courses = await DataAccessLayer.getCourses();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await DataAccessLayer.getCourse(id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getPublicCourses = async (req, res) => {
  try {
    const courses = await DataAccessLayer.getCourses();
    const publicCourses = courses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      teacher_id: course.teacher_id,
      student_count: course.student_count || 0
    }));
    res.json(publicCourses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getStudentEnrolledCourses = async (req, res) => {
  try {
    const studentId = req.user.id;
    const courses = await DataAccessLayer.getStudentCourses(studentId);
    res.json(courses || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTeacherCourses = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const courses = await DataAccessLayer.getTeacherCourses(teacherId);
    res.json(courses || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { title, description, teacher_id } = req.body;

    if (!title || !teacher_id) {
      return res.status(400).json({ error: "Title and teacher ID are required" });
    }

    const courseId = await DataAccessLayer.createCourse({ title, description, teacher_id });
    const newCourse = await DataAccessLayer.getCourse(courseId);
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, teacher_id } = req.body;

    const updated = await DataAccessLayer.updateCourse(id, { title, description, teacher_id });

    if (!updated) {
      return res.status(404).json({ error: "Course not found" });
    }

    const updatedCourse = await DataAccessLayer.getCourse(id);
    res.json(updatedCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DataAccessLayer.deleteCourse(id);

    if (!deleted) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCourseEnrollments = async (req, res) => {
  try {
    const { courseId } = req.params;
    const enrollments = await DataAccessLayer.getCourseEnrollments(courseId);
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const enrollStudent = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { studentId } = req.body;

    const enrolled = await DataAccessLayer.enrollStudent(courseId, studentId);

    if (!enrolled) {
      return res.status(400).json({ error: "Student already enrolled" });
    }

    res.status(201).json({ message: "Student enrolled successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const unenrollStudent = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;
    const unenrolled = await DataAccessLayer.unenrollStudent(courseId, studentId);

    if (!unenrolled) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    res.json({ message: "Student unenrolled successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
