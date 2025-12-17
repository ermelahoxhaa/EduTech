<template>
  <div class="dashboard-wrapper" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    <nav class="sidebar">
      <div class="sidebar-header">
        <h5 v-if="!isSidebarCollapsed"><i>EduTech Admin</i></h5>
        <h5 v-else><i>ET</i></h5>
      </div>
      <button class="sidebar-toggle" @click="toggleSidebar">
        <i :class="isSidebarCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
      </button>
      <ul class="nav-menu">
        <li class="nav-item">
          <router-link to="/dashboard" class="nav-link" active-class="active">
            <i class="fas fa-home"></i>
            <span class="nav-text">Dashboard</span>
          </router-link>
        </li>
        <li class="nav-item" v-if="hasRole(['admin'])">
          <router-link to="/manage-users" class="nav-link" active-class="active">
            <i class="fas fa-users"></i>
            <span class="nav-text">Manage Users</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/course" class="nav-link" active-class="active">
            <i class="fas fa-book"></i>
            <span class="nav-text">Manage Courses</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/createnotification" class="nav-link" active-class="active">
            <i class="fas fa-bell"></i>
            <span class="nav-text">Notifications</span>
          </router-link>
        </li>
        <li class="nav-item logout-item">
          <a class="nav-link" href="#" @click.prevent="handleLogout">
            <i class="fas fa-sign-out-alt"></i>
            <span class="nav-text">Logout</span>
          </a>
        </li>
      </ul>
    </nav>

    <main class="main-content">
      <div class="content-header">
        <h2>{{ isEditing ? 'Edit' : 'Create' }} Notification</h2>
      </div>

      <div class="form-card">
        <div class="form-card-header">
          <h5>Notification Details</h5>
        </div>
        <div class="form-card-body">
          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label class="form-label">Title</label>
              <input 
                v-model="form.title" 
                type="text" 
                class="form-control form-control-lg" 
                placeholder="Enter notification title" 
                required 
              />
            </div>
            <div class="form-group">
              <label class="form-label">Message</label>
              <textarea 
                v-model="form.message" 
                class="form-control" 
                placeholder="Enter your message here..." 
                rows="4" 
                required
              ></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Audience</label>
              <select v-model="form.audience" class="form-select" required>
                <option value="" disabled>Select Audience</option>
                <option value="all">All Users</option>
                <option value="students">Students Only</option>
                <option value="teachers">Teachers Only</option>
              </select>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-primary-custom">
                {{ isEditing ? 'Update' : 'Create' }} Notification
              </button>
              <button v-if="isEditing" type="button" class="btn-secondary-custom" @click="resetForm">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <div v-if="notifications.length" class="table-card">
        <div class="table-card-header">
          <h5>Recent Notifications</h5>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
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
                <tr v-if="note" :key="note.id">
                  <td data-label="Title" class="fw-semibold">{{ note?.title || 'Untitled' }}</td>
                  <td data-label="Message" class="text-muted">{{ note?.message ? (note.message.length > 30 ? note.message.substring(0, 30) + '...' : note.message) : 'No message' }}</td>
                  <td data-label="Audience">
                    <span class="badge" :class="getBadgeClass(note?.audience)">
                      {{ formatAudience(note?.audience) }}
                    </span>
                  </td>
                  <td data-label="Date" class="text-nowrap">{{ note?.created_at ? formatDate(note.created_at) : 'N/A' }}</td>
                  <td data-label="Actions" class="actions-cell">
                    <button v-if="note?.id" @click="editNotification(note)" class="btn-icon" title="Edit">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button v-if="note?.id" @click="deleteNotification(note.id)" class="btn-icon btn-danger" title="Delete">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else class="empty-card">
        <p>No notifications yet. Create your first one!</p>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios'
import { useToast } from 'vue-toast-notification'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

export default {
  name: 'CreateNotification',
  setup() {
    const toast = useToast()
    const { isAuthenticated, hasRole, checkAuth, logout } = useAuth()
    const router = useRouter()
    return { toast, isAuthenticated, hasRole, checkAuth, router, logout }
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
      isEditing: false,
      isSidebarCollapsed: false
    }
  },
  async created() {
    this.checkScreenSize()
    window.addEventListener('resize', this.checkScreenSize)

    if (!this.isAuthenticated) {
      const isAuth = await this.checkAuth()
      if (!isAuth) {
        this.router.push('/login')
        return
      }
    }

    if (!this.hasRole(['admin', 'teacher'])) {
      alert('You do not have permission to access this page.')
      this.router.push('/dashboard')
      return
    }

    this.fetchNotifications()
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkScreenSize)
  },
  methods: {
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed
    },
    checkScreenSize() {
      this.isSidebarCollapsed = window.innerWidth < 992
    },
    async handleLogout() {
      await this.logout()
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      try {
        return new Date(dateString).toLocaleString()
      } catch (e) {
        return 'Invalid date'
      }
    },
    formatAudience(audience) {
      const audiences = {
        all: 'All Users',
        students: 'Students',
        teachers: 'Teachers'
      }
      return audiences[audience] || audience || 'N/A'
    },
    getBadgeClass(audience) {
      const classes = {
        all: 'badge-all',
        students: 'badge-students',
        teachers: 'badge-teachers'
      }
      return classes[audience] || 'badge-default'
    },
    resetForm() {
      this.form = {
        id: null,
        title: '',
        message: '',
        audience: ''
      }
      this.isEditing = false
    },
    async fetchNotifications() {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get('http://localhost:5000/api/notifications', { 
          headers: { 'x-auth-token': token },
          withCredentials: true 
        })
        this.notifications = (Array.isArray(res.data) ? res.data : []).filter(note => note != null)
      } catch (err) {
        if (err.response?.status === 401) {
          alert('Your session has expired. Please login again.')
          this.router.push('/login')
        } else {
          const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch notifications'
          this.toast.error(errorMessage)
        }
        this.notifications = []
      }
    },
    editNotification(note) {
      if (!note) {
        this.toast.error('Invalid notification data')
        return
      }
      this.form = { 
        id: note.id || null,
        title: note.title || '',
        message: note.message || '',
        audience: note.audience || ''
      }
      this.isEditing = true
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    async submitForm() {
      try {
        if (!this.form.title || !this.form.message || !this.form.audience) {
          this.toast.error('Please fill in all required fields')
          return
        }

        const url = this.isEditing 
          ? `http://localhost:5000/api/notifications/${this.form.id}`
          : 'http://localhost:5000/api/notifications'
        
        const method = this.isEditing ? 'put' : 'post'
        
        const token = localStorage.getItem('token')
        const res = await axios[method](url, this.form, { 
          headers: { 'x-auth-token': token },
          withCredentials: true 
        })
        
        if (this.isEditing) {
          this.notifications = this.notifications.map(n => 
            n.id === this.form.id ? { ...res.data } : n
          )
        } else {
          this.notifications.unshift(res.data)
        }
        
        this.resetForm()
        this.toast.success(`Notification ${this.isEditing ? 'updated' : 'created'} successfully!`)
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to save notification'
        this.toast.error(errorMessage)
      }
    },
    async deleteNotification(id) {
      if (!id) {
        this.toast.error('Invalid notification ID')
        return
      }
      
      if (!confirm('Are you sure you want to delete this notification?')) return
      
      try {
        const token = localStorage.getItem('token')
        await axios.delete(`http://localhost:5000/api/notifications/${id}`, { 
          headers: { 'x-auth-token': token },
          withCredentials: true 
        })
        this.notifications = this.notifications.filter(n => n?.id !== id)
        this.toast.success('Notification deleted successfully!')
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to delete notification'
        this.toast.error(errorMessage)
      }
    }
  }
}
</script>

<style scoped>
.dashboard-wrapper {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

.sidebar {
  width: 250px;
  min-width: 250px;
  background-color: #4F6466;
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 1000;
  transition: all 0.3s ease;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
}

.sidebar-collapsed .sidebar {
  width: 70px;
  min-width: 70px;
}

.sidebar-header {
  padding: 1.5rem 1rem;
  text-align: center;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.sidebar-header h5 {
  margin: 0;
  font-style: italic;
  white-space: nowrap;
}

.sidebar-toggle {
  position: absolute;
  right: -12px;
  top: 50px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #4F6466;
  border: 2px solid white;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  z-index: 1001;
  transition: all 0.3s ease;
}

.sidebar-toggle:hover {
  background: #3a4a4b;
}

.nav-menu {
  list-style: none;
  padding: 1rem 0;
  margin: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.nav-item {
  margin: 0.25rem 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: white;
  text-decoration: none;
  border-radius: 0.25rem;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.sidebar-collapsed .nav-link {
  justify-content: center;
  padding: 0.75rem;
}

.sidebar-collapsed .nav-text {
  display: none;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  background-color: #3a4a4b;
  font-weight: 500;
}

.nav-link i {
  width: 20px;
  text-align: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.logout-item {
  margin-top: auto;
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 0.5rem;
}

.main-content {
  flex: 1;
  margin-left: 250px;
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
}

.sidebar-collapsed .main-content {
  margin-left: 70px;
}

.content-header {
  margin-bottom: 1.5rem;
}

.content-header h2 {
  color: #4F6466;
  font-weight: 600;
  margin: 0;
}

.btn-primary-custom {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background-color: #4F6466;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary-custom:hover {
  background-color: #3a4a4b;
  transform: translateY(-1px);
}

.btn-secondary-custom {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background-color: transparent;
  color: #6c757d;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary-custom:hover {
  background-color: #f8f9fa;
}

.form-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.form-card-header {
  background-color: #4F6466;
  color: white;
  padding: 1rem 1.5rem;
}

.form-card-header h5 {
  margin: 0;
  font-weight: 600;
}

.form-card-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #333;
}

.form-control,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-control-lg {
  padding: 1rem;
  font-size: 1.1rem;
}

.form-control:focus,
.form-select:focus {
  outline: none;
  border-color: #4F6466;
  box-shadow: 0 0 0 0.25rem rgba(79, 100, 102, 0.25);
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.table-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  overflow: hidden;
}

.table-card-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #dee2e6;
}

.table-card-header h5 {
  margin: 0;
  font-weight: 600;
  color: #4F6466;
}

.table-responsive {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background-color: #4F6466;
  color: white;
}

.data-table th {
  padding: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  text-align: left;
}

.data-table td {
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  vertical-align: middle;
}

.data-table tbody tr:hover {
  background-color: #f8f9fa;
}

.fw-semibold {
  font-weight: 600;
}

.text-muted {
  color: #6c757d;
}

.text-nowrap {
  white-space: nowrap;
}

.text-end {
  text-align: right;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.btn-icon {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  background: transparent;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-icon:hover {
  background-color: #f8f9fa;
  color: #4F6466;
}

.btn-icon.btn-danger {
  color: #dc3545;
}

.btn-icon.btn-danger:hover {
  background-color: #dc3545;
  border-color: #dc3545;
  color: white;
}

.badge {
  display: inline-block;
  padding: 0.35em 0.65em;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 0.25rem;
}

.badge-all {
  background-color: #e3f2fd;
  color: #0d6efd;
}

.badge-students {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.badge-teachers {
  background-color: #fff3e0;
  color: #ef6c00;
}

.badge-default {
  background-color: #f5f5f5;
  color: #333;
}

.empty-card {
  background: white;
  border-radius: 0.5rem;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.empty-card p {
  color: #6c757d;
  margin: 0;
}

@media (max-width: 992px) {
  .sidebar-toggle {
    display: none;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 1.5rem;
  }

  .content-header h2 {
    font-size: 1.25rem;
  }

  .data-table thead {
    display: none;
  }

  .data-table,
  .data-table tbody,
  .data-table tr,
  .data-table td {
    display: block;
    width: 100%;
  }

  .data-table tr {
    margin-bottom: 1rem;
    border: 1px solid #dee2e6;
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .data-table td {
    text-align: right;
    padding: 0.75rem 1rem;
    padding-left: 40%;
    position: relative;
    border-bottom: 1px solid #eee;
  }

  .data-table td::before {
    content: attr(data-label);
    position: absolute;
    left: 1rem;
    width: 40%;
    text-align: left;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.7rem;
    color: #6c757d;
  }

  .data-table td:last-child {
    border-bottom: 0;
  }

  .actions-cell {
    justify-content: flex-end;
  }
}

@media (max-width: 480px) {
  .sidebar-collapsed .sidebar {
    width: 60px;
    min-width: 60px;
  }

  .sidebar-collapsed .main-content {
    margin-left: 60px;
  }

  .main-content {
    padding: 1rem;
  }

  .form-card-body {
    padding: 1rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-primary-custom,
  .btn-secondary-custom {
    width: 100%;
    justify-content: center;
  }
}
</style>
