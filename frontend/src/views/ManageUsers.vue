<template>
  <div class="container-fluid min-vh-100">
    <div class="row flex-nowrap">
      <nav
        class="col-auto col-md-3 col-xl-2 px-3 bg-custom sidebar text-white d-flex flex-column"
        style="min-height: 100vh;"
      >
        <h5 class="text-center my-4"><i>EduTech Admin</i></h5>
        <ul class="nav nav-pills flex-column mb-auto">
          <li class="nav-item mb-2">
            <router-link to="/dashboard" class="nav-link text-white" active-class="active">
              <i class="fas fa-home me-2"></i>Dashboard
            </router-link>
          </li>
          <li class="nav-item mb-2">
            <router-link to="/manage-users" class="nav-link text-white" active-class="active">
              <i class="fas fa-users me-2"></i>Manage Users
            </router-link>
          </li>
          <li class="nav-item mb-2">
            <router-link to="/course" class="nav-link text-white" active-class="active">
              <i class="fas fa-book me-2"></i>Manage Courses
            </router-link>
          </li>
          <li class="nav-item mb-2">
            <router-link to="/createnotification" class="nav-link text-white" active-class="active">
              <i class="fas fa-bell me-2"></i>Manage Notifications
            </router-link>
          </li>
          <li class="nav-item mt-auto">
            <a class="nav-link text-white" href="#" @click.prevent="handleLogout">
              <i class="fas fa-sign-out-alt me-2"></i>Logout
            </a>
          </li>
        </ul>
      </nav>

      <main class="col py-4 bg-light" style="overflow-x:auto;">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="mb-0">Manage Users</h2>
          <button 
            @click="showAddUser = true" 
            class="btn text-white"
            style="background-color: #4F6466;"
          >
            <i class="fas fa-plus me-2"></i>Add New User
          </button>
        </div>

        <div v-if="showAddUser || editingUser" class="card shadow-sm mb-4">
          <div class="card-header" style="background-color: #4F6466; color: white;">
            <h5 class="mb-0">{{ editingUser ? 'Edit User' : 'Add New User' }}</h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="saveUser">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Name</label>
                  <input 
                    v-model="currentUser.name" 
                    type="text" 
                    class="form-control" 
                    placeholder="Enter full name" 
                    required 
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Email</label>
                  <input 
                    v-model="currentUser.email" 
                    type="email" 
                    class="form-control" 
                    placeholder="Enter email" 
                    required 
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Password</label>
                  <input 
                    v-model="currentUser.password" 
                    type="password" 
                    class="form-control" 
                    placeholder="Enter password"
                    :required="!editingUser"
                  />
                  <small class="text-muted" v-if="editingUser">Leave blank to keep current password</small>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Role</label>
                  <select 
                    v-model="currentUser.role" 
                    class="form-select" 
                    required
                  >
                    <option value="" disabled>Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="teacher">Teacher</option>
                    <option value="student">Student</option>
                  </select>
                </div>
                <div class="col-12">
                  <div class="d-flex gap-2">
                    <button type="submit" class="btn text-white" style="background-color: #4F6466;">
                      {{ editingUser ? 'Update' : 'Create' }} User
                    </button>
                    <button 
                      type="button" 
                      class="btn btn-outline-secondary" 
                      @click="closeModal"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div class="card shadow-sm">
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover align-middle">
                <thead style="background-color: #4F6466; color: white;">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th class="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in users" :key="user.id" class="bg-white">
                    <td>{{ user.id }}</td>
                    <td class="fw-semibold">{{ user.name }}</td>
                    <td>{{ user.email }}</td>
                    <td>
                      <span class="badge" :class="getRoleBadgeClass(user.role)">
                        {{ user.role }}
                      </span>
                    </td>
                    <td class="text-nowrap text-end">
                      <button 
                        @click="editUser(user)" 
                        class="btn btn-sm btn-outline-secondary me-1"
                        title="Edit"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                      <button 
                        @click="confirmDelete(user.id)" 
                        class="btn btn-sm btn-outline-danger"
                        title="Delete"
                        :disabled="user.role === 'admin' && users.filter(u => u.role === 'admin').length === 1"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="users.length === 0">
                    <td colspan="5" class="text-center text-muted py-4">
                      No users found
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import axios from 'axios'

const router = useRouter()
const { logout: authLogout, isAdmin } = useAuth()

const users = ref([])
const showAddUser = ref(false)
const editingUser = ref(null)
const currentUser = ref({
  id: null,
  name: '',
  email: '',
  password: '',
  role: ''
})

const apiBaseUrl = 'http://localhost:5000/api'

onMounted(async () => {
  if (!isAdmin.value) {
    alert('You do not have permission to access this page.')
    router.push('/dashboard')
    return
  }
  
  await fetchUsers()
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
    admin: 'bg-danger',
    teacher: 'bg-primary',
    student: 'bg-success'
  }
  return classes[role] || 'bg-secondary'
}

const handleLogout = async () => {
  await authLogout()
}
</script>

<style scoped>
.bg-custom {
  background-color: #4F6466;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
}

.sidebar {
  min-height: 100vh;
  transition: all 0.3s ease;
}

.sidebar .nav-link {
  color: #fff;
  padding: 0.75rem 1rem;
  margin: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.sidebar .nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.sidebar .nav-link.active {
  background-color: #3a4a4b;
  color: #fff;
  font-weight: 500;
}

.table th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

.badge {
  padding: 0.35em 0.65em;
  font-weight: 500;
}

.form-control:focus, .form-select:focus {
  border-color: #4F6466;
  box-shadow: 0 0 0 0.25rem rgba(79, 100, 102, 0.25);
}
</style>

