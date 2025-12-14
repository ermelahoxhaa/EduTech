<template>
  <div class="assignments-container">
    <div class="header">
      <h2>Assignments</h2>
      <button v-if="isProfessorOrAdmin" class="btn btn-primary" @click="showCreateModal = true">
        Create Assignment
      </button>
    </div>

    <div class="filters">
      <select v-model="selectedCourse" class="form-control">
        <option value="">Select Course</option>
        <option v-for="course in courses" :key="course.id" :value="course.id">
          {{ course.name }}
        </option>
      </select>
    </div>

    <div v-if="loading" class="loading">Loading assignments...</div>
    
    <div v-else>
      <div v-if="assignments.length === 0" class="no-assignments">
        No assignments found for the selected course.
      </div>
      
      <div v-else class="assignments-list">
        <div v-for="assignment in assignments" :key="assignment.id" class="assignment-card">
          <div class="assignment-header">
            <h3>{{ assignment.title }}</h3>
            <div class="due-date">
              <i class="fas fa-calendar-alt"></i>
              Due: {{ formatDate(assignment.due_date) }}
            </div>
          </div>
          <p class="description">{{ assignment.description }}</p>
          <div class="assignment-footer">
            <span class="max-score">Max Score: {{ assignment.max_score }}</span>
            <div v-if="isProfessorOrAdmin" class="actions">
              <button class="btn-icon" @click="editAssignment(assignment)" title="Edit">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn-icon danger" @click="confirmDelete(assignment)" title="Delete">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showCreateModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ editingAssignment ? 'Edit Assignment' : 'Create New Assignment' }}</h3>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveAssignment">
            <div class="form-group">
              <label>Title</label>
              <input v-model="assignmentForm.title" type="text" required />
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea v-model="assignmentForm.description" rows="4" required></textarea>
            </div>
            <div class="form-group">
              <label>Course</label>
              <select v-model="assignmentForm.course_id" required :disabled="!!editingAssignment">
                <option v-for="course in courses" :key="course.id" :value="course.id">
                  {{ course.name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Due Date</label>
              <input v-model="assignmentForm.due_date" type="datetime-local" required />
            </div>
            <div class="form-group">
              <label>Maximum Score</label>
              <input v-model="assignmentForm.max_score" type="number" min="1" required />
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="closeModal">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                {{ saving ? 'Saving...' : 'Save Assignment' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>Confirm Deletion</h3>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete this assignment? This action cannot be undone.</p>
          <div class="form-actions">
            <button class="btn btn-secondary" @click="showDeleteModal = false">
              Cancel
            </button>
            <button class="btn btn-danger" @click="deleteAssignment" :disabled="deleting">
              {{ deleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { format } from 'date-fns';

export default {
  name: 'AssignmentsView',
  setup() {
    const store = useStore();
    const assignments = ref([]);
    const courses = ref([]);
    const loading = ref(false);
    const saving = ref(false);
    const deleting = ref(false);
    const showCreateModal = ref(false);
    const showDeleteModal = ref(false);
    const selectedCourse = ref('');
    const editingAssignment = ref(null);
    const assignmentToDelete = ref(null);

    const assignmentForm = ref({
      title: '',
      description: '',
      course_id: '',
      due_date: '',
      max_score: 100
    });

    const isProfessorOrAdmin = computed(() => {
      const user = store.getters.currentUser;
      return user && (user.role === 'admin' || user.role === 'professor');
    });

    watch(selectedCourse, (newCourseId) => {
      if (newCourseId) {
        fetchAssignments(newCourseId);
      } else {
        assignments.value = [];
      }
    });

    const formatDate = (dateString) => {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    };

    const fetchAssignments = async (courseId) => {
      try {
        loading.value = true;
        assignments.value = [
          {
            id: 1,
            title: 'Assignment 1',
            description: 'Complete the following exercises...',
            course_id: courseId,
            due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            max_score: 100
          }
        ];
      } catch (error) {
        console.error('Error fetching assignments:', error);
      } finally {
        loading.value = false;
      }
    };

    const fetchCourses = async () => {
      try {
        courses.value = [
          { id: 1, name: 'Mathematics 101' },
          { id: 2, name: 'Computer Science 101' }
        ];
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    const createNewAssignment = () => {
      assignmentForm.value = {
        title: '',
        description: '',
        course_id: selectedCourse.value || '',
        due_date: '',
        max_score: 100
      };
      editingAssignment.value = null;
      showCreateModal.value = true;
    };

    const editAssignment = (assignment) => {
      assignmentForm.value = { ...assignment };
      editingAssignment.value = assignment.id;
      showCreateModal.value = true;
    };

    const saveAssignment = async () => {
      try {
        saving.value = true;
        
        if (editingAssignment.value) {
          console.log('Updating assignment:', assignmentForm.value);
        } else {
          console.log('Creating assignment:', assignmentForm.value);
        }
        
        if (assignmentForm.value.course_id) {
          await fetchAssignments(assignmentForm.value.course_id);
        }
        
        closeModal();
      } catch (error) {
        console.error('Error saving assignment:', error);
      } finally {
        saving.value = false;
      }
    };

    const confirmDelete = (assignment) => {
      assignmentToDelete.value = assignment.id;
      showDeleteModal.value = true;
    };

    const deleteAssignment = async () => {
      try {
        deleting.value = true;
        console.log('Deleting assignment:', assignmentToDelete.value);
        
        if (selectedCourse.value) {
          await fetchAssignments(selectedCourse.value);
        }
        
        showDeleteModal.value = false;
      } catch (error) {
        console.error('Error deleting assignment:', error);
      } finally {
        deleting.value = false;
      }
    };

    const closeModal = () => {
      showCreateModal.value = false;
      showDeleteModal.value = false;
      editingAssignment.value = null;
      assignmentToDelete.value = null;
    };

    onMounted(() => {
      fetchCourses();
    });

    return {
      assignments,
      courses,
      loading,
      saving,
      deleting,
      showCreateModal,
      showDeleteModal,
      selectedCourse,
      assignmentForm,
      editingAssignment,
      isProfessorOrAdmin,
      formatDate,
      createNewAssignment,
      editAssignment,
      saveAssignment,
      confirmDelete,
      deleteAssignment,
      closeModal
    };
  }
};
</script>

<style scoped>
.assignments-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filters {
  margin-bottom: 20px;
}

.form-control {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 300px;
  max-width: 100%;
}

.assignments-list {
  display: grid;
  gap: 20px;
}

.assignment-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.assignment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.assignment-header h3 {
  margin: 0;
  color: #2c3e50;
}

.due-date {
  color: #666;
  font-size: 0.9em;
}

.description {
  color: #555;
  margin-bottom: 15px;
}

.assignment-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.max-score {
  font-weight: 500;
  color: #2c3e50;
}

.actions {
  display: flex;
  gap: 10px;
}

.btn-icon {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.btn-icon:hover {
  background-color: #f5f5f5;
}

.btn-icon.danger {
  color: #e74c3c;
}

.btn-icon.danger:hover {
  background-color: #fde8e6;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  line-height: 1;
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.btn-primary:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #333;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background-color: #c0392b;
}

.btn-danger:disabled {
  background-color: #e0a7a1;
  cursor: not-allowed;
}

.loading,
.no-assignments {
  text-align: center;
  padding: 40px;
  color: #666;
}
</style>