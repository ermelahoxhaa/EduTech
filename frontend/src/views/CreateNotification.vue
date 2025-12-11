<template>
  <div class="container py-4 notification-container">
    <div class="card shadow-sm border-0">
      <div class="card-header" style="background-color: #4F6466; color: white;">
        <button 
    @click="$router.push('/dashboard')" 
    class="btn btn-sm btn-outline-light me-3"
    title="Back to Dashboard"
  >
    <i class="bi bi-arrow-left"></i>
  </button>
        <h2 class="h4 mb-0">{{ isEditing ? 'Edit' : 'Create' }} Notification</h2>
      </div>
      <div class="card-body">
        <form @submit.prevent="submitForm" class="mb-4">
          <div class="mb-3">
            <label class="form-label">Title</label>
            <input 
              v-model="form.title" 
              type="text" 
              class="form-control form-control-lg" 
              placeholder="Enter notification title" 
              required 
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Message</label>
            <textarea 
              v-model="form.message" 
              class="form-control" 
              placeholder="Enter your message here..." 
              rows="4" 
              required
            ></textarea>
          </div>
          <div class="mb-4">
            <label class="form-label">Audience</label>
            <select 
              v-model="form.audience" 
              class="form-select" 
              required
            >
              <option value="" disabled>Select Audience</option>
              <option value="all">All Users</option>
              <option value="students">Students Only</option>
              <option value="teachers">Teachers Only</option>
            </select>
          </div>

          <div class="d-flex gap-2">
            <button 
              type="submit" 
              class="btn text-white" 
              style="background-color: #4F6466;"
            >
              {{ isEditing ? 'Update' : 'Create' }} Notification
            </button>
            <button 
              v-if="isEditing" 
              type="button" 
              class="btn btn-outline-secondary" 
              @click="resetForm"
            >
              Cancel
            </button>
          </div>
        </form>

        <div v-if="notifications.length" class="mt-5">
          <h3 class="h5 mb-3">Recent Notifications</h3>
          <div class="table-responsive">
            <table class="table table-hover align-middle">
              <thead style="background-color: #4F6466; color: white;">
                <tr>
                  <th>Title</th>
                  <th>Message</th>
                  <th>Audience</th>
                  <th>Date</th>
                  <th class="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="note in notifications">
                  <tr v-if="note" :key="note.id" class="bg-white">
                    <td class="fw-semibold">{{ note?.title || 'Untitled' }}</td>
                    <td class="text-muted">{{ note?.message ? (note.message.length > 30 ? note.message.substring(0, 30) + '...' : note.message) : 'No message' }}</td>
                    <td>
                      <span class="badge" :style="getBadgeStyle(note?.audience)">
                        {{ formatAudience(note?.audience) }}
                      </span>
                    </td>
                    <td class="text-nowrap">{{ note?.created_at ? formatDate(note.created_at) : 'N/A' }}</td>
                    <td class="text-nowrap text-end">
                      <button 
                        v-if="note?.id"
                        @click="editNotification(note)" 
                        class="btn btn-sm btn-outline-secondary me-1"
                        title="Edit"
                      >
                        Edit
                      </button>
                      <button 
                        v-if="note?.id"
                        @click="deleteNotification(note.id)" 
                        class="btn btn-sm btn-outline-danger"
                        title="Delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
        <div v-else class="text-center py-5 bg-light rounded">
          <p class="text-muted">No notifications yet. Create your first one!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useToast } from 'vue-toast-notification';

export default {
  name: 'CreateNotification',
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      form: {
        id: null,
        title: '',
        message: '',
        audience: ''
      },
      notifications: [],
      isEditing: false
    };
  },
  created() {
    this.fetchNotifications();
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      try {
        return new Date(dateString).toLocaleString();
      } catch (e) {
        console.error('Error formatting date:', e);
        return 'Invalid date';
      }
    },
    formatAudience(audience) {
      const audiences = {
        all: 'All Users',
        students: 'Students',
        teachers: 'Teachers'
      };
      return audiences[audience] || audience || 'N/A';
    },
    getBadgeStyle(audience) {
      const styles = {
        all: 'background-color: #e3f2fd; color: #0d6efd;',
        students: 'background-color: #e8f5e9; color: #2e7d32;',
        teachers: 'background-color: #fff3e0; color: #ef6c00;'
      };
      return styles[audience] || 'background-color: #f5f5f5; color: #333;';
    },
    resetForm() {
      this.form = {
        id: null,
        title: '',
        message: '',
        audience: ''
      };
      this.isEditing = false;
    },
    async fetchNotifications() {
      try {
        const res = await axios.get('http://localhost:5000/api/notifications', { withCredentials: true });
        this.notifications = (Array.isArray(res.data) ? res.data : []).filter(note => note != null);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch notifications';
        this.toast.error(errorMessage);
        this.notifications = [];
      }
    },
    editNotification(note) {
      if (!note) {
        this.toast.error('Invalid notification data');
        return;
      }
      this.form = { 
        id: note.id || null,
        title: note.title || '',
        message: note.message || '',
        audience: note.audience || ''
      };
      this.isEditing = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    async submitForm() {
      try {
        if (!this.form.title || !this.form.message || !this.form.audience) {
          this.toast.error('Please fill in all required fields');
          return;
        }

        const url = this.isEditing 
          ? `http://localhost:5000/api/notifications/${this.form.id}`
          : 'http://localhost:5000/api/notifications';
        
        const method = this.isEditing ? 'put' : 'post';
        
        const res = await axios[method](url, this.form, { withCredentials: true });
        
        if (this.isEditing) {
          this.notifications = this.notifications.map(n => 
            n.id === this.form.id ? { ...res.data } : n
          );
        } else {
          this.notifications.unshift(res.data);
        }
        
        this.resetForm();
        this.toast.success(`Notification ${this.isEditing ? 'updated' : 'created'} successfully!`);
      } catch (err) {
        console.error('Error saving notification:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to save notification';
        this.toast.error(errorMessage);
      }
    },
    async deleteNotification(id) {
      if (!id) {
        this.toast.error('Invalid notification ID');
        return;
      }
      
      if (!confirm('Are you sure you want to delete this notification?')) return;
      
      try {
        await axios.delete(`http://localhost:5000/api/notifications/${id}`, { withCredentials: true });
        this.notifications = this.notifications.filter(n => n?.id !== id);
        this.toast.success('Notification deleted successfully!');
      } catch (err) {
        console.error('Error deleting notification:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to delete notification';
        this.toast.error(errorMessage);
      }
    }
  }
};
</script>

<style scoped>
.notification-container {
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.card-header {
  border-bottom: none;
  padding: 1rem 1.5rem;
}

.form-control:focus, .form-select:focus {
  border-color: #4F6466;
  box-shadow: 0 0 0 0.25rem rgba(79, 100, 102, 0.25);
}

.table th {
  font-weight: 500;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
  padding: 1rem;
}

.table td {
  padding: 0.75rem 1rem;
  vertical-align: middle;
}

.badge {
  padding: 0.35em 0.65em;
  border-radius: 0.25rem;
  font-weight: 500;
  font-size: 0.8rem;
}

.btn {
  transition: all 0.2s ease;
  border-radius: 0.375rem;
  font-weight: 500;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.btn-outline-secondary {
  border-color: #dee2e6;
}

.btn-outline-secondary:hover {
  background-color: #f8f9fa;
  border-color: #dee2e6;
  color: #4F6466;
}

.table-hover tbody tr {
  transition: background-color 0.2s ease;
}

.table-hover tbody tr:hover {
  background-color: #f8f9fa !important;
}

@media (max-width: 768px) {
  .table-responsive {
    font-size: 0.875rem;
  }
  
  .btn {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
  }
  
  .card-header h2 {
    font-size: 1.25rem;
  }
  
  .form-control, .form-select {
    font-size: 0.9375rem;
  }
}
</style>