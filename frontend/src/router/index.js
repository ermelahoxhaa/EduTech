import { createRouter, createWebHistory } from 'vue-router'

import HomeLanding from '../components/HomeLanding.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'
import CreateNotification from '@/views/CreateNotification.vue'

const routes = [
  { path: '/', component: HomeLanding },
{ path: '/dashboard', component: AdminDashboard },
{ path: '/createnotification', component: CreateNotification},

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
