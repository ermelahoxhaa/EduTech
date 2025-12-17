<template>
  <div class="student-page">
    <main class="page-main">
      <div class="main-container">
        <section class="welcome-section">
          <div class="welcome-content">
            <h1>Welcome back, {{ user?.name?.split(' ')[0] || 'Student' }}! 👋</h1>
            <p>Continue your learning journey. Here are your enrolled courses.</p>
          </div>
          <div class="welcome-stats">
            <div class="stat-card">
              <span class="stat-value">{{ enrolledCourses.length }}</span>
              <span class="stat-label">Courses</span>
            </div>
          </div>
        </section>

        <section class="courses-section">
          <div class="section-header">
            <h2>📖 My Courses</h2>
          </div>

          <div v-if="loading" class="loading-container">
            <div class="loading-spinner"></div>
            <p>Loading your courses...</p>
          </div>

          <div v-else-if="enrolledCourses.length === 0" class="empty-state">
            <div class="empty-icon">📚</div>
            <h3>No Courses Yet</h3>
            <p>You haven't enrolled in any courses yet. Contact your administrator to get enrolled.</p>
          </div>

          <div v-else class="courses-grid">
            <article v-for="course in enrolledCourses" :key="course.id" class="course-card">
              <div class="course-header">
                <div class="course-icon">{{ getCourseIcon(course.title) }}</div>
                <span class="course-badge">{{ getCourseCategory(course.title) }}</span>
              </div>
              <h3 class="course-title">{{ course.title }}</h3>
              <p class="course-description">
                {{ course.description || 'An exciting course to enhance your knowledge and skills.' }}
              </p>
              <div class="course-meta">
                <div class="meta-item">
                  <span class="meta-icon">👨‍🏫</span>
                  <span>{{ getTeacherName(course.teacher_id) }}</span>
                </div>
              </div>
              <div class="course-progress">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: getRandomProgress() + '%' }"></div>
                </div>
                <span class="progress-text">In Progress</span>
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script>
import { useAuth } from '@/composables/useAuth';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  name: 'StudentCourses',
  setup() {
    const { user, isAuthenticated, checkAuth, hasRole } = useAuth();
    const router = useRouter();
    return { user, isAuthenticated, checkAuth, hasRole, router };
  },
  data() {
    return {
      enrolledCourses: [],
      teachers: [],
      loading: true,
      apiBaseUrl: 'http://localhost:5000/api'
    };
  },
  async created() {
    if (!this.isAuthenticated) {
      const isAuth = await this.checkAuth();
      if (!isAuth) {
        this.router.push('/login');
        return;
      }
    }

    if (!this.hasRole(['student'])) {
      this.router.push('/dashboard');
      return;
    }

    await this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        this.loading = true;
        const token = localStorage.getItem('token');
        const headers = { 'x-auth-token': token };

        const [coursesRes, teachersRes] = await Promise.all([
          axios.get(`${this.apiBaseUrl}/courses/student/enrolled`, { headers, withCredentials: true }).catch(() => ({ data: [] })),
          axios.get(`${this.apiBaseUrl}/users/teachers`, { headers, withCredentials: true }).catch(() => ({ data: [] }))
        ]);

        this.enrolledCourses = coursesRes.data || [];
        this.teachers = teachersRes.data || [];
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        this.loading = false;
      }
    },
    getTeacherName(teacherId) {
      const teacher = this.teachers.find(t => t.id === teacherId);
      return teacher ? teacher.name : 'Staff Instructor';
    },
    getCourseIcon(title) {
      const titleLower = (title || '').toLowerCase();
      if (titleLower.includes('math')) return '🔢';
      if (titleLower.includes('science') || titleLower.includes('physics') || titleLower.includes('chemistry')) return '🔬';
      if (titleLower.includes('english') || titleLower.includes('language') || titleLower.includes('literature')) return '📖';
      if (titleLower.includes('history')) return '🏛️';
      if (titleLower.includes('art') || titleLower.includes('music')) return '🎨';
      if (titleLower.includes('computer') || titleLower.includes('programming') || titleLower.includes('tech')) return '💻';
      if (titleLower.includes('biology')) return '🧬';
      if (titleLower.includes('geography')) return '🌍';
      if (titleLower.includes('sport') || titleLower.includes('physical')) return '⚽';
      return '📚';
    },
    getCourseCategory(title) {
      const titleLower = (title || '').toLowerCase();
      if (titleLower.includes('math')) return 'Mathematics';
      if (titleLower.includes('science')) return 'Science';
      if (titleLower.includes('english')) return 'Language';
      if (titleLower.includes('history')) return 'History';
      if (titleLower.includes('computer') || titleLower.includes('programming')) return 'Technology';
      return 'General';
    },
    getRandomProgress() {
      return Math.floor(Math.random() * 60) + 20;
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.student-page {
  min-height: 100vh;
  background: #f8f9fa;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
}

.page-main {
  padding: 2rem;
  padding-top: 120px;
}

.main-container {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #4F6466 0%, #3a4a4b 100%);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  color: white;
}

.welcome-content h1 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.welcome-content p {
  opacity: 0.9;
  font-size: 0.95rem;
  margin: 0;
}

.welcome-stats {
  display: flex;
  gap: 1rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.15);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: 800;
}

.stat-label {
  font-size: 0.85rem;
  opacity: 0.9;
}

.section-header {
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.5rem;
  color: #1a1a2e;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.course-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.course-icon {
  font-size: 2.5rem;
}

.course-badge {
  padding: 0.35rem 0.85rem;
  background: #e3f2fd;
  color: #0b56d1;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.course-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #1a1a2e;
}

.course-description {
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-meta {
  margin-bottom: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6c757d;
  font-size: 0.9rem;
}

.course-progress {
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  padding-top: 1rem;
}

.progress-bar {
  height: 6px;
  background: #f8f9fa;
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: #4F6466;
  border-radius: 999px;
  transition: width 0.5s ease;
}

.progress-text {
  font-size: 0.8rem;
  color: #6c757d;
}

.loading-container {
  text-align: center;
  padding: 4rem;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(0, 0, 0, 0.08);
  border-top-color: #4F6466;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 4rem;
  background: #ffffff;
  border-radius: 16px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #1a1a2e;
}

.empty-state p {
  color: #6c757d;
}

@media (max-width: 768px) {
  .page-main {
    padding: 1rem;
    padding-top: 100px;
  }
  
  .welcome-section {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
    padding: 1.5rem;
  }
  
  .welcome-content h1 {
    font-size: 1.25rem;
  }
  
  .courses-grid {
    grid-template-columns: 1fr;
  }
  
  .course-card {
    padding: 1.25rem;
  }
}

@media (max-width: 480px) {
  .page-main {
    padding: 0.75rem;
    padding-top: 90px;
  }
  
  .welcome-section {
    padding: 1rem;
  }
  
  .welcome-content h1 {
    font-size: 1.1rem;
  }
  
  .section-header h2 {
    font-size: 1.25rem;
  }
}
</style>
