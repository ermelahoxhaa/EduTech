import { createRouter, createWebHistory } from 'vue-router'
import { setupRouterGuards } from './guards'

import HomeLanding from '../components/HomeLanding.vue'
import FeaturesPage from '@/views/FeaturesPage.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'
import StudentCourses from '@/views/StudentCourses.vue'
import StudentNotifications from '@/views/StudentNotifications.vue'
import CreateNotification from '@/views/CreateNotification.vue'
import CourseTable from '@/components/CourseTable.vue' 
import LoginForm from '@/components/LoginForm.vue'
import SignupForm from '@/components/SignupForm.vue'
import ManageUsers from '@/views/ManageUsers.vue'
import TeacherCourses from '@/views/TeacherCourses.vue'
import TeacherCourseDetail from '@/views/TeacherCourseDetail.vue'

const routes = [
  { path: '/', component: HomeLanding },
  { path: '/features', component: FeaturesPage },
  { path: '/login', component: LoginForm },
  { path: '/signup', component: SignupForm },
  { 
    path: '/dashboard', 
    component: AdminDashboard,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/my-teaching-courses',
    component: TeacherCourses,
    meta: { requiresAuth: true, roles: ['teacher'] }
  },
  {
    path: '/teacher/course/:id',
    component: TeacherCourseDetail,
    meta: { requiresAuth: true, roles: ['teacher'] }
  },
  { 
    path: '/my-courses', 
    component: StudentCourses,
    meta: { requiresAuth: true, roles: ['student'] }
  },
  { 
    path: '/my-notifications', 
    component: StudentNotifications,
    meta: { requiresAuth: true, roles: ['student'] }
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

setupRouterGuards(router)

export default router
