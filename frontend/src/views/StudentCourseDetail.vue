<template>
  <div class="student-course-page">
    <main class="page-main">
      <div class="main-container">
        <div class="course-header-section">
          <div class="header-top">
            <button @click="goBack" class="btn-back">
              <i class="fas fa-arrow-left"></i> Back to Courses
            </button>
            <button @click="handleLogout" class="btn-logout">
              <i class="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
          <div v-if="course" class="course-info">
            <h1>{{ getCourseTitle(course) }}</h1>
            <p class="course-description">{{ getCourseDescription(course) }}</p>
            <div class="course-stats">
              <div class="stat-item">
                <span class="stat-value">{{ materials.length }}</span>
                <span class="stat-label">Materials</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ assignments.length }}</span>
                <span class="stat-label">Assignments</span>
              </div>
            </div>
          </div>
        </div>

        <div class="tabs-section">
          <div class="tabs">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              :class="['tab-button', { active: activeTab === tab.id }]"
              @click="activeTab = tab.id"
            >
              <i :class="tab.icon"></i>
              <span>{{ tab.label }}</span>
            </button>
          </div>
        </div>

        <div class="content-section">
          <div v-if="loading" class="loading-container">
            <div class="loading-spinner"></div>
            <p>Loading course data...</p>
          </div>

          <div v-else>
            <div v-if="activeTab === 'materials'" class="tab-content">
              <div class="section-header">
                <h2>📚 Course Materials</h2>
                <p class="section-subtitle">Access learning materials and resources for this course</p>
              </div>

              <div v-if="materials.length === 0" class="empty-state">
                <div class="empty-icon">📄</div>
                <h3>No Materials Yet</h3>
                <p>Your teacher hasn't added any materials to this course yet.</p>
              </div>

              <div v-else class="materials-grid">
                <div v-for="material in materials" :key="material.id" class="material-card">
                  <div class="material-icon">{{ getMaterialIcon(material.type) }}</div>
                  <div class="material-content">
                    <h3>{{ material.title }}</h3>
                    <p class="material-type">{{ material.type }}</p>
                    <button @click.stop="viewMaterial(material, $event)" class="material-link-btn">
                      <i class="fas fa-eye"></i> View Material
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="activeTab === 'assignments'" class="tab-content">
              <div class="section-header">
                <h2>📝 Assignments</h2>
                <p class="section-subtitle">View and submit your assignments</p>
              </div>

              <div v-if="assignments.length === 0" class="empty-state">
                <div class="empty-icon">📋</div>
                <h3>No Assignments Yet</h3>
                <p>Your teacher hasn't created any assignments for this course yet.</p>
              </div>

              <div v-else class="assignments-list">
                <div v-for="assignment in assignments" :key="assignment.id" class="assignment-card">
                  <div class="assignment-header">
                    <h3>{{ assignment.title }}</h3>
                    <span class="assignment-status" :class="getAssignmentStatusClass(assignment)">
                      {{ getAssignmentStatus(assignment) }}
                    </span>
                  </div>
                  <p class="assignment-description">{{ assignment.description || 'No description provided.' }}</p>
                  <div class="assignment-meta">
                    <div class="meta-item">
                      <i class="fas fa-calendar"></i>
                      <span>Due: {{ formatDate(assignment.due_date) }}</span>
                    </div>
                    <div class="meta-item">
                      <i class="fas fa-star"></i>
                      <span>Max Score: {{ assignment.max_score || 100 }}</span>
                    </div>
                    <div v-if="getGradeForAssignment(assignment.id)" class="meta-item">
                      <i class="fas fa-check-circle"></i>
                      <span>Grade: {{ getGradeForAssignment(assignment.id) }}/{{ assignment.max_score || 100 }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="activeTab === 'grades'" class="tab-content">
              <div class="section-header">
                <h2>📊 My Grades</h2>
                <p class="section-subtitle">View your grades for all assignments</p>
              </div>

              <div v-if="assignments.length === 0" class="empty-state">
                <div class="empty-icon">📊</div>
                <h3>No Grades Yet</h3>
                <p>You don't have any graded assignments yet.</p>
              </div>

              <div v-else class="grades-table-container">
                <table class="grades-table">
                  <thead>
                    <tr>
                      <th>Assignment</th>
                      <th>Due Date</th>
                      <th>Max Score</th>
                      <th>Your Grade</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="assignment in assignments" :key="assignment.id">
                      <td class="student-name">{{ assignment.title }}</td>
                      <td>{{ formatDate(assignment.due_date) }}</td>
                      <td>{{ assignment.max_score || 100 }}</td>
                      <td>
                        <span v-if="getGradeForAssignment(assignment.id)" class="grade-value">
                          {{ getGradeForAssignment(assignment.id) }}
                        </span>
                        <span v-else class="grade-pending">-</span>
                      </td>
                      <td>
                        <span class="assignment-status" :class="getAssignmentStatusClass(assignment)">
                          {{ getAssignmentStatus(assignment) }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="3" class="final-grade-label"><strong>Average Grade:</strong></td>
                      <td colspan="2" class="final-grade">{{ calculateAverageGrade() }}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div v-if="showViewMaterialModal && viewingMaterial" class="material-modal-overlay" @click.self="closeViewMaterialModal">
      <div class="material-view-modal" @click.stop>
        <div class="material-modal-header">
          <h3>{{ viewingMaterial.title }}</h3>
          <button @click="closeViewMaterialModal" class="material-close-btn" type="button">&times;</button>
        </div>
        <div class="material-view-body">
          <div class="material-view-info">
            <span class="material-type-badge">{{ viewingMaterial.type }}</span>
            <a v-if="isExternalLink(viewingMaterial.url)" :href="getMaterialUrl(viewingMaterial.url)" target="_blank" class="external-link-btn">
              <i class="fas fa-external-link-alt"></i> Open in New Tab
            </a>
          </div>
          <div class="material-content-viewer">
            <div v-if="viewingMaterial.type === 'PDF'" class="pdf-viewer">
              <iframe :src="getMaterialUrl(viewingMaterial.url)" class="material-iframe" frameborder="0"></iframe>
            </div>
            <div v-else-if="viewingMaterial.type === 'Video'" class="video-viewer">
              <video :src="getMaterialUrl(viewingMaterial.url)" controls class="material-video">
                Your browser does not support the video tag.
              </video>
            </div>
            <div v-else-if="viewingMaterial.type === 'Link'" class="link-viewer">
              <iframe :src="getMaterialUrl(viewingMaterial.url)" class="material-iframe" frameborder="0"></iframe>
            </div>
            <div v-else-if="viewingMaterial.type === 'Document'" class="document-viewer">
              <iframe :src="getMaterialUrl(viewingMaterial.url)" class="material-iframe" frameborder="0"></iframe>
            </div>
            <div v-else class="material-error">
              <p>Document URL not available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuth } from '@/composables/useAuth';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

export default {
  name: 'StudentCourseDetail',
  setup() {
    const { user, isAuthenticated, checkAuth, hasRole, logout } = useAuth();
    const router = useRouter();
    const route = useRoute();
    return { user, isAuthenticated, checkAuth, hasRole, router, route, logout };
  },
  data() {
    return {
      course: null,
      assignments: [],
      materials: [],
      grades: {},
      loading: true,
      activeTab: 'materials',
      showViewMaterialModal: false,
      viewingMaterial: null,
      tabs: [
        { id: 'materials', label: 'Materials', icon: 'fas fa-book' },
        { id: 'assignments', label: 'Assignments', icon: 'fas fa-tasks' },
        { id: 'grades', label: 'Grades', icon: 'fas fa-chart-line' }
      ],
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
      this.router.push('/my-courses');
      return;
    }

    await this.fetchCourseData();
  },
  methods: {
    async fetchCourseData() {
      try {
        this.loading = true;
        const token = localStorage.getItem('token');
        const headers = { 'x-auth-token': token };
        const courseId = this.route.params.id;

        const [courseRes, assignmentsRes, materialsRes, gradesRes] = await Promise.all([
          axios.get(`${this.apiBaseUrl}/courses/${courseId}`, { headers, withCredentials: true }).catch(() => ({ data: null })),
          axios.get(`${this.apiBaseUrl}/assignments/course/${courseId}`, { headers, withCredentials: true }).catch(() => ({ data: { data: [] } })),
          axios.get(`${this.apiBaseUrl}/materials/course/${courseId}`, { headers, withCredentials: true }).catch(() => ({ data: { data: [] } })),
          axios.get(`${this.apiBaseUrl}/grades/student/${this.user.id}/course/${courseId}`, { headers, withCredentials: true }).catch(() => ({ data: { data: [] } }))
        ]);

        if (courseRes.data) {
          this.course = {
            id: courseRes.data.id,
            title: courseRes.data.title || '',
            description: courseRes.data.description || '',
            teacher_id: courseRes.data.teacher_id
          };
        }
        this.assignments = assignmentsRes.data?.data || assignmentsRes.data || [];
        this.materials = materialsRes.data?.data || materialsRes.data || [];
        
        const gradesData = gradesRes.data?.data || gradesRes.data || [];
        gradesData.forEach(grade => {
          if (grade.assignment_id && grade.score !== null && grade.score !== undefined) {
            this.grades[grade.assignment_id] = grade.score;
          }
        });
      } catch (error) {
        console.error('Error fetching course data:', error);
        alert('Failed to load course data');
      } finally {
        this.loading = false;
      }
    },
    goBack() {
      this.router.push('/my-courses');
    },
    getCourseTitle(course) {
      if (!course) return 'Course';
      if (typeof course === 'string') return course;
      if (typeof course !== 'object') return 'Course';
      
      let title = course.title || '';
      if (!title) return 'Course';
      
      title = title.trim();
      
      if (title.includes('Course Title Teacher Description')) {
        title = title.replace('Course Title Teacher Description', '').trim();
      }
      
      if (title.includes('Teacher')) {
        const parts = title.split('Teacher');
        title = parts[0].trim();
      }
      
      if (title.includes('Description')) {
        const parts = title.split('Description');
        title = parts[0].trim();
      }
      
      const words = title.split(/\s+/);
      if (words.length > 0 && words[0]) {
        return words[0];
      }
      
      return title || 'Course';
    },
    getCourseDescription(course) {
      if (!course) return '';
      if (typeof course === 'string') return '';
      if (typeof course !== 'object') return '';
      
      const desc = course.description || '';
      return desc.trim();
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    getMaterialIcon(type) {
      const icons = {
        'PDF': '📄',
        'Link': '🔗',
        'Video': '🎥',
        'Document': '📝'
      };
      return icons[type] || '📚';
    },
    viewMaterial(material, event) {
      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }
      if (!material) return;
      this.viewingMaterial = { ...material };
      this.showViewMaterialModal = true;
    },
    closeViewMaterialModal() {
      this.showViewMaterialModal = false;
      this.viewingMaterial = null;
    },
    getMaterialUrl(url) {
      if (!url) return '';
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }
      if (url.startsWith('/uploads/')) {
        return `${this.apiBaseUrl.replace('/api', '')}${url}`;
      }
      return url;
    },
    isExternalLink(url) {
      if (!url) return false;
      return url.startsWith('http://') || url.startsWith('https://');
    },
    getGradeForAssignment(assignmentId) {
      return this.grades[assignmentId] || null;
    },
    getAssignmentStatus(assignment) {
      if (!assignment || !assignment.due_date) return 'Pending';
      const dueDate = new Date(assignment.due_date);
      const now = new Date();
      if (now > dueDate) {
        return this.getGradeForAssignment(assignment.id) ? 'Graded' : 'Overdue';
      }
      return 'Active';
    },
    getAssignmentStatusClass(assignment) {
      const status = this.getAssignmentStatus(assignment);
      return {
        'status-active': status === 'Active',
        'status-overdue': status === 'Overdue',
        'status-graded': status === 'Graded',
        'status-pending': status === 'Pending'
      };
    },
    calculateAverageGrade() {
      if (!Array.isArray(this.assignments) || this.assignments.length === 0) return '-';
      let total = 0;
      let count = 0;
      this.assignments.forEach(assignment => {
        if (!assignment || !assignment.id) return;
        const grade = this.grades[assignment.id];
        if (grade !== undefined && grade !== null && grade !== '') {
          const numGrade = parseFloat(grade);
          if (!isNaN(numGrade)) {
            total += numGrade;
            count++;
          }
        }
      });
      return count > 0 ? (total / count).toFixed(1) : '-';
    },
    async handleLogout() {
      await this.logout();
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.student-course-page {
  min-height: 100vh;
  background: #f8f9fa;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  overflow-x: hidden;
  width: 100%;
  max-width: 100vw;
}

.page-main {
  padding: 2rem;
  padding-top: 120px;
}

.main-container {
  max-width: 1400px;
  margin: 0 auto;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: transparent;
  color: #4F6466;
  border: 1px solid #4F6466;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 1.5rem;
  transition: all 0.2s ease;
}

.btn-back:hover {
  background: #4F6466;
  color: white;
}

.course-header-section {
  background: linear-gradient(135deg, #4F6466 0%, #3a4a4b 100%);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  color: white;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.btn-logout {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-logout:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.course-info {
  width: 100%;
}

.course-info h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.course-info .course-description {
  opacity: 0.9;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
}

.course-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: 800;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

.tabs-section {
  background: white;
  border-radius: 12px;
  padding: 0.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.tabs {
  display: flex;
  gap: 0.5rem;
}

.tab-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-button:hover {
  background: #f8f9fa;
  color: #4F6466;
}

.tab-button.active {
  background: #4F6466;
  color: white;
}

.content-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.section-header {
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.5rem;
  color: #1a1a2e;
  margin-bottom: 0.5rem;
}

.section-subtitle {
  color: #6c757d;
  font-size: 0.9rem;
  margin: 0;
}

.materials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.material-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.material-icon {
  font-size: 2.5rem;
}

.material-content {
  flex: 1;
}

.material-content h3 {
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
  color: #1a1a2e;
}

.material-type {
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
}

.material-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #4F6466;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.5rem;
}

.material-link-btn:hover {
  background: #3a4a4b;
  transform: translateY(-1px);
}

.assignments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.assignment-card {
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.assignment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.assignment-header h3 {
  font-size: 1.2rem;
  color: #1a1a2e;
}

.assignment-status {
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-active {
  background: #d1fae5;
  color: #065f46;
}

.status-overdue {
  background: #fee2e2;
  color: #991b1b;
}

.status-graded {
  background: #dbeafe;
  color: #1e40af;
}

.status-pending {
  background: #fef3c7;
  color: #92400e;
}

.assignment-description {
  color: #6c757d;
  margin-bottom: 1rem;
}

.assignment-meta {
  display: flex;
  gap: 1.5rem;
  font-size: 0.9rem;
  color: #6c757d;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.grades-table-container {
  overflow-x: auto;
}

.grades-table {
  width: 100%;
  border-collapse: collapse;
}

.grades-table th {
  background: #4F6466;
  color: white;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
}

.grades-table td {
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.grade-value {
  font-weight: 600;
  color: #1a1a2e;
}

.grade-pending {
  color: #6c757d;
}

.student-name {
  font-weight: 600;
  color: #1a1a2e;
}

.final-grade-label {
  text-align: right;
  padding-right: 1rem;
}

.final-grade {
  font-weight: 700;
  color: #4F6466;
  font-size: 1.1rem;
}

.empty-state {
  text-align: center;
  padding: 4rem;
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

@media (max-width: 768px) {
  .page-main {
    padding: 1rem;
    padding-top: 100px;
  }
  
  .main-container {
    max-width: 100%;
  }

  .header-top {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .btn-back,
  .btn-logout {
    width: 100%;
    justify-content: center;
    white-space: nowrap;
  }
  
  .course-info h1 {
    font-size: clamp(1.25rem, 4vw, 1.5rem);
  }
  
  .course-info p {
    font-size: clamp(0.9rem, 2vw, 1rem);
  }

  .tabs {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .tab-button {
    flex: 1;
    min-width: 120px;
    font-size: 0.85rem;
    padding: 0.65rem 0.75rem;
  }

  .course-stats {
    flex-direction: column;
    gap: 1rem;
  }

  .materials-grid {
    grid-template-columns: 1fr;
  }

  .grades-table-container {
    font-size: 0.85rem;
    overflow-x: auto;
  }
}

@media (max-width: 480px) {
  .page-main {
    padding: 0.75rem;
    padding-top: 90px;
  }
  
  .course-header-section {
    padding: 1.25rem;
  }
  
  .course-info h1 {
    font-size: clamp(1.1rem, 4vw, 1.25rem);
  }
  
  .tab-button {
    font-size: 0.8rem;
    padding: 0.6rem 0.65rem;
    min-width: 100px;
  }
  
  .tab-button span {
    display: none;
  }
  
  .tab-button i {
    margin: 0;
  }
}
</style>

<style>
.material-modal-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  background: rgba(0, 0, 0, 0.6) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 999999 !important;
  width: 100vw !important;
  height: 100vh !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.material-view-modal {
  background: white !important;
  border-radius: 12px !important;
  width: 95% !important;
  max-width: 1200px !important;
  max-height: 90vh !important;
  overflow: hidden !important;
  z-index: 1000000 !important;
  position: relative !important;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3) !important;
  display: flex !important;
  flex-direction: column !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.material-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.material-modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #1a1a2e;
}

.material-close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.material-close-btn:hover {
  color: #1a1a2e;
}

.material-view-body {
  display: flex;
  flex-direction: column;
  height: calc(90vh - 80px);
  overflow: hidden;
}

.material-view-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
}

.material-type-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #4F6466;
  color: white;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.external-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  color: #4F6466;
  border: 2px solid #4F6466;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.2s;
}

.external-link-btn:hover {
  background: #4F6466;
  color: white;
}

.material-content-viewer {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.material-iframe {
  width: 100%;
  height: 100%;
  min-height: 600px;
  border: none;
}

.material-video {
  width: 100%;
  height: 100%;
  max-height: calc(90vh - 200px);
  object-fit: contain;
}

.pdf-viewer,
.document-viewer,
.link-viewer,
.video-viewer {
  width: 100%;
  height: 100%;
  min-height: 600px;
}

.material-error {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 400px;
  color: #6c757d;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .material-view-modal {
    width: 98%;
    max-height: 95vh;
  }

  .material-view-body {
    height: calc(95vh - 80px);
  }

  .material-iframe,
  .material-video {
    min-height: 400px;
  }

  .material-view-info {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .external-link-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>

