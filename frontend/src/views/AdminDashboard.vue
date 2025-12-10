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
            <router-link to="/manage-courses" class="nav-link text-white" active-class="active">
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const stats = ref([
  { title: 'Total Users', value: 25, icon: 'fas fa-users stat-icon' },
  { title: 'Total Courses', value: 10, icon: 'fas fa-book stat-icon' },
  { title: 'Total Notifications', value: 5, icon: 'fas fa-bell stat-icon' },
])

const handleLogout = () => {
  alert('Logging out...')
  router.push('/login') 
}
</script>

<style scoped>
.bg-custom {
  background-color: rgb(128, 97, 114);
}

.sidebar {
  width: 250px;
  min-width: 250px;
}

.sidebar .nav-link {
  margin-bottom: 20px;
  font-size: 17px;
}

.sidebar .nav-link.active {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 0.25rem;
}

.stat-icon {
  font-size: 1.5rem; 
  color: rgb(128, 97, 114);
  margin-bottom: 10px;
}

@media (max-width: 768px) {
  .sidebar {
    width: 80px;
    font-size: 14px;
  }
  .sidebar .nav-link {
    font-size: 12px;
    padding: 0.4rem 0.5rem;
  }
  .card-title {
    font-size: 14px;
  }
  .card-text {
    font-size: 12px;
  }
  h2 {
    font-size: 18px;
  }
}
</style>
