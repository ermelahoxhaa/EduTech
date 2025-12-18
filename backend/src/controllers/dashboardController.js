import EduCoreService from '../services/education/EduCoreService.js';
import DataAccessLayer from '../dataAccess/DataAccessLayer.js'; 

export const getDashboardStats = async (req, res) => {
  try {
    const [users, courses, notifications] = await Promise.all([
      DataAccessLayer.getAllUsers(),
      EduCoreService.getCourses(),
      DataAccessLayer.getNotifications()
    ]);
    
    const allAssignments = await EduCoreService.getAllAssignments();

    const stats = {
      totalUsers: users?.length || 0,
      totalCourses: courses?.length || 0,
      totalNotifications: notifications?.length || 0,
      totalAssignments: allAssignments?.length || 0,
      totalStudents: users?.filter(u => u.role === 'student').length || 0,
      totalTeachers: users?.filter(u => u.role === 'teacher').length || 0,
      recentActivity: []
    };

    res.json(stats);
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({ error: err.message });
  }
};
