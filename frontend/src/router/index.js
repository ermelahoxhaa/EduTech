import { createRouter, createWebHistory } from 'vue-router'
import { setupRouterGuards } from './guards'

import HomeLanding from '../components/HomeLanding.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'
import CreateNotification from '@/views/CreateNotification.vue'
import CourseTable from '@/components/CourseTable.vue' 
import LoginForm from '@/components/LoginForm.vue'
import SignupForm from '@/components/SignupForm.vue'
import ManageUsers from '@/views/ManageUsers.vue'

const routes = [
  { path: '/', component: HomeLanding },
  { 
    path: '/dashboard', 
    component: AdminDashboard,
    meta: { requiresAuth: true, roles: ['admin', 'teacher', 'student'] }
  },
  { 
    path: '/manage-users', 
    component: ManageUsers,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  { 
    path: '/createnotification', 
    component: CreateNotification,
    meta: { requiresAuth: true, roles: ['admin', 'teacher'] }
  },
  { 
    path: '/course', 
    component: CourseTable,
    meta: { requiresAuth: true, roles: ['admin', 'teacher'] }
  },
  { path: '/login', component: LoginForm },
  { path: '/signup', component: SignupForm }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

setupRouterGuards(router)

export default router
