import { createRouter, createWebHistory } from 'vue-router'

import HomeLanding from '../components/HomeLanding.vue'
import StudentDashboard from '../views/StudentDashboard.vue'

const routes = [
  { path: '/', component: HomeLanding },
  { path: '/dashboard', component: StudentDashboard }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
