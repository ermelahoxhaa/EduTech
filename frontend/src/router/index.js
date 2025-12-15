import { createRouter, createWebHistory } from 'vue-router'

import HomeLanding from '../components/HomeLanding.vue'
import StudentDashboard from '../views/StudentDashboard.vue'
import LoginForm from '../components/LoginForm.vue'
import SignupForm from '../components/SignupForm.vue'

const routes = [
  { path: '/', component: HomeLanding },
  { path: '/login', component: LoginForm },
  { path: '/signup', component: SignupForm },
  { path: '/dashboard', component: StudentDashboard }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
