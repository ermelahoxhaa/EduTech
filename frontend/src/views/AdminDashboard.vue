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
        <li class="nav-item" v-if="isAdmin">
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
      <h2>Welcome to the Admin Dashboard</h2>

      <div class="stats-grid">
        <div class="stat-card" v-for="stat in stats" :key="stat.title">
          <div class="stat-icon">
            <i :class="stat.icon"></i>
          </div>
          <h5>{{ stat.title }}</h5>
          <p>{{ stat.value }}</p>
        </div>
      </div>

      <div class="activity-card">
        <h5>Weekly Activity</h5>
        <p>This section will display activity statistics once the backend is ready.</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { logout, isAuthenticated, checkAuth, hasRole } = useAuth()

const isSidebarCollapsed = ref(false)

const isAdmin = computed(() => hasRole(['admin']))

const stats = ref([
  { title: 'Total Users', value: 25, icon: 'fas fa-users' },
  { title: 'Total Courses', value: 10, icon: 'fas fa-book' },
  { title: 'Total Notifications', value: 5, icon: 'fas fa-bell' },
])

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const checkScreenSize = () => {
  isSidebarCollapsed.value = window.innerWidth < 992
}

onMounted(async () => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)

  if (!isAuthenticated.value) {
    const isAuth = await checkAuth()
    if (!isAuth) {
      router.push('/login')
      return
    }
  }

  if (!hasRole(['admin', 'teacher'])) {
    if (hasRole(['student'])) {
      router.push('/my-courses')
    } else {
      alert('You do not have permission to access this page.')
      router.push('/login')
    }
    return
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})

const handleLogout = async () => {
  await logout()
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

h2 {
  color: #4F6466;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 1rem;
  background-color: rgba(79, 100, 102, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon i {
  font-size: 1.75rem;
  color: #4F6466;
}

.stat-card h5 {
  color: #4F6466;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.stat-card p {
  color: #6c757d;
  margin: 0;
}

.activity-card {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.activity-card h5 {
  color: #4F6466;
  font-weight: 600;
  margin-bottom: 1rem;
}

.activity-card p {
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

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  h2 {
    font-size: 1.25rem;
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

  .stat-card {
    padding: 1rem;
  }

  .stat-icon {
    width: 50px;
    height: 50px;
  }

  .stat-icon i {
    font-size: 1.5rem;
  }
}
</style>
