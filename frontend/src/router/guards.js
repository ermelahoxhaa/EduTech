import { useAuth } from '../composables/useAuth'

export function setupRouterGuards(router) {
  router.beforeEach((to, from, next) => {
    const { isAuthenticated, user, hasRole } = useAuth()
    
    const publicRoutes = ['/', '/login', '/signup']
    const isPublicRoute = publicRoutes.includes(to.path)

    if (!isAuthenticated.value && !isPublicRoute) {
      return next({ path: '/login', query: { redirect: to.fullPath } })
    }

    if (isAuthenticated.value && (to.path === '/login' || to.path === '/signup')) {
      return next('/dashboard')
    }

    if (isAuthenticated.value && to.meta.requiresAuth) {
      const requiredRoles = to.meta.roles || []
      
      if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
        const userRole = user.value?.role
        if (userRole === 'admin') {
          return next('/dashboard')
        } else if (userRole === 'teacher') {
          return next('/course')
        } else if (userRole === 'student') {
          return next('/dashboard')
        } else {
          return next('/')
        }
      }
    }

    next()
  })
}

