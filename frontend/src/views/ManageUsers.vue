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
        <li class="nav-item">
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
        <h2>Manage Users</h2>
        <button @click="showAddUser = true" class="btn-primary-custom">
          <i class="fas fa-plus"></i>
          <span>Add New User</span>
        </button>
      </div>

      <div v-if="showAddUser || editingUser" class="form-card">
        <div class="form-card-header">
          <h5>{{ editingUser ? 'Edit User' : 'Add New User' }}</h5>
        </div>
        <div class="form-card-body">
          <form @submit.prevent="saveUser">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Name</label>
                <input 
                  v-model="currentUser.name" 
                  type="text" 
                  class="form-control" 
                  placeholder="Enter full name" 
                  required 
                />
              </div>
              <div class="form-group">
                <label class="form-label">Email</label>
                <input 
                  v-model="currentUser.email" 
                  type="email" 
                  class="form-control" 
                  placeholder="Enter email" 
                  required 
                />
              </div>
              <div class="form-group">
                <label class="form-label">Password</label>
                <input 
                  v-model="currentUser.password" 
                  type="password" 
                  class="form-control" 
                  placeholder="Enter password"
                  :required="!editingUser"
                />
                <small v-if="editingUser">Leave blank to keep current password</small>
              </div>
              <div class="form-group">
                <label class="form-label">Role</label>
                <select v-model="currentUser.role" class="form-select" required>
                  <option value="" disabled>Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>
                </select>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-primary-custom">
                {{ editingUser ? 'Update' : 'Create' }} User
              </button>
              <button type="button" class="btn-secondary-custom" @click="closeModal">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="table-card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td data-label="ID">{{ user.id }}</td>
                <td data-label="Name" class="fw-semibold">{{ user.name }}</td>
                <td data-label="Email">{{ user.email }}</td>
                <td data-label="Role">
                  <span class="badge" :class="getRoleBadgeClass(user.role)">
                    {{ user.role }}
                  </span>
                </td>
                <td data-label="Actions" class="actions-cell">
                  <button @click="editUser(user)" class="btn-icon" title="Edit">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    @click="confirmDelete(user.id)" 
                    class="btn-icon btn-danger"
                    title="Delete"
                    :disabled="user.role === 'admin' && users.filter(u => u.role === 'admin').length === 1"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="users.length === 0">
                <td colspan="5" class="empty-state">No users found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import axios from 'axios'

const router = useRouter()
const { logout: authLogout, isAdmin } = useAuth()

const users = ref([])
const showAddUser = ref(false)
const editingUser = ref(null)
const isSidebarCollapsed = ref(false)
const currentUser = ref({
  id: null,
  name: '',
  email: '',
  password: '',
  role: ''
})

const apiBaseUrl = 'http://localhost:5000/api'

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const checkScreenSize = () => {
  isSidebarCollapsed.value = window.innerWidth < 992
}

onMounted(async () => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)

  if (!isAdmin.value) {
    alert('You do not have permission to access this page.')
    router.push('/dashboard')
    return
  }
  
  await fetchUsers()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})

const fetchUsers = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${apiBaseUrl}/users`, {
      headers: { 'x-auth-token': token },
      withCredentials: true
    })
    users.value = response.data || []
  } catch (error) {
    console.error('Error fetching users:', error)
    if (error.response?.status === 401) {
      alert('Your session has expired. Please login again.')
      router.push('/login')
    } else {
      alert('Failed to load users: ' + (error.response?.data?.error || error.message))
    }
  }
}

const saveUser = async () => {
  try {
    const token = localStorage.getItem('token')
    const method = editingUser.value ? 'PUT' : 'POST'
    const endpoint = editingUser.value 
      ? `${apiBaseUrl}/users/${currentUser.value.id}`
      : `${apiBaseUrl}/users`

    const userData = {
      name: currentUser.value.name,
      email: currentUser.value.email,
      role: currentUser.value.role
    }

    if (currentUser.value.password) {
      userData.password = currentUser.value.password
    }

    await axios({
      method,
      url: endpoint,
      data: userData,
      headers: { 
        'x-auth-token': token,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    })

    closeModal()
    await fetchUsers()
    alert('User saved successfully!')
  } catch (error) {
    console.error('Error saving user:', error)
    alert('Failed to save user: ' + (error.response?.data?.message || error.response?.data?.error || error.message))
  }
}

const editUser = (user) => {
  currentUser.value = { ...user, password: '' }
  editingUser.value = true
  showAddUser.value = true
}

const confirmDelete = async (userId) => {
  if (!confirm('Are you sure you want to delete this user?')) {
    return
  }

  try {
    const token = localStorage.getItem('token')
    await axios.delete(`${apiBaseUrl}/users/${userId}`, {
      headers: { 'x-auth-token': token },
      withCredentials: true
    })
    await fetchUsers()
    alert('User deleted successfully!')
  } catch (error) {
    console.error('Error deleting user:', error)
    alert('Failed to delete user: ' + (error.response?.data?.error || error.message))
  }
}

const closeModal = () => {
  showAddUser.value = false
  editingUser.value = null
  currentUser.value = {
    id: null,
    name: '',
    email: '',
    password: '',
    role: ''
  }
}

const getRoleBadgeClass = (role) => {
  const classes = {
    admin: 'badge-admin',
    teacher: 'badge-teacher',
    student: 'badge-student'
  }
  return classes[role] || 'badge-default'
}

const handleLogout = async () => {
  await authLogout()
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
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

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #333;
}

.form-control,
.form-select {
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-control:focus,
.form-select:focus {
  outline: none;
  border-color: #4F6466;
  box-shadow: 0 0 0 0.25rem rgba(79, 100, 102, 0.25);
}

.form-group small {
  color: #6c757d;
  margin-top: 0.25rem;
  font-size: 0.875rem;
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

.btn-icon:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.badge {
  display: inline-block;
  padding: 0.35em 0.65em;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 0.25rem;
  text-transform: capitalize;
}

.badge-admin {
  background-color: #dc3545;
  color: white;
}

.badge-teacher {
  background-color: #0d6efd;
  color: white;
}

.badge-student {
  background-color: #198754;
  color: white;
}

.badge-default {
  background-color: #6c757d;
  color: white;
}

.empty-state {
  text-align: center;
  color: #6c757d;
  padding: 2rem !important;
}

@media (max-width: 992px) {
  .sidebar-toggle {
    display: none;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 1.5rem;
  }

  .content-header {
    flex-direction: column;
    align-items: stretch;
  }

  .content-header h2 {
    font-size: 1.25rem;
  }

  .btn-primary-custom {
    justify-content: center;
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
