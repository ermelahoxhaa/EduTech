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
            <a class="nav-link text-white" href="#" @click="handleLogout">
              <i class="fas fa-sign-out-alt me-2"></i>Logout
            </a>
          </li>
        </ul>
      </nav>

      <main class="col py-4 bg-light" style="overflow-x:auto;">
        <h2 class="mb-4">Welcome to the Admin Dashboard</h2>

        <div class="row mb-4">
          <div class="col-12 col-sm-6 col-md-4 mb-3" v-for="stat in stats" :key="stat.title">
            <div class="card text-center h-100 shadow-sm border-0">
              <div class="card-body d-flex flex-column align-items-center">
                <div class="mb-2 d-flex justify-content-center gap-2">
                  <i :class="stat.icon"></i>
                </div>
                <h5 class="card-title">{{ stat.title }}</h5>
                <p class="card-text text-muted">{{ stat.value }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card shadow-sm p-3">
          <h5 class="card-title">Weekly Activity</h5>
          <p class="text-muted mb-0">This section will display activity statistics once the backend is ready.</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { logout, isAuthenticated, checkAuth, hasRole } = useAuth()

const stats = ref([
  { title: 'Total Users', value: 25, icon: 'fas fa-users stat-icon' },
  { title: 'Total Courses', value: 10, icon: 'fas fa-book stat-icon' },
  { title: 'Total Notifications', value: 5, icon: 'fas fa-bell stat-icon' },
])

onMounted(async () => {
  if (!isAuthenticated.value) {
    const isAuth = await checkAuth();
    if (!isAuth) {
      router.push('/login');
      return;
    }
  }

  if (!hasRole(['admin', 'teacher', 'student'])) {
    alert('You do not have permission to access this page.');
    router.push('/login');
    return;
  }
})

const handleLogout = async () => {
  await logout()
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

.sidebar .nav-link i {
  width: 24px;
  text-align: center;
  margin-right: 0.5rem;
}

.card {
  border: none;
  border-radius: 0.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1) !important;
}

.card-title {
  color: #4F6466;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.stat-icon {
  font-size: 1.75rem;
  color: #4F6466;
  margin-bottom: 1rem;
  background-color: rgba(79, 100, 102, 0.1);
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin: 0 auto 1rem;
}

@media (max-width: 768px) {
  .sidebar {
    width: 70px;
    min-width: 70px;
    font-size: 0.8rem;
  }
  
  .sidebar .nav-text {
    display: none;
  }
  
  .sidebar .nav-link {
    text-align: center;
    padding: 0.75rem 0.25rem;
    margin: 0.25rem 0.25rem;
    font-size: 0.7rem;
  }
  
  .sidebar .nav-link i {
    display: block;
    margin: 0 auto 0.25rem;
    font-size: 1.2rem;
  }
  
  .stat-icon {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }
}

main {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 2rem;
}

h2 {
  color: #4F6466;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.card {
  margin-bottom: 1.5rem;
  border: none;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.card-title {
  font-weight: 600;
  color: #4F6466;
  margin-bottom: 1rem;
}
</style>
