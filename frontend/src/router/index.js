import { createRouter, createWebHistory } from 'vue-router'

import HomeLanding from '../components/HomeLanding.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'
import CreateNotification from '@/views/CreateNotification.vue'
import CourseTable from '@/components/CourseTable.vue' 

const routes = [
  { path: '/', component: HomeLanding },
{ path: '/dashboard', component: AdminDashboard },
{ path: '/createnotification', component: CreateNotification},
{path: '/course', component: CourseTable}

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
