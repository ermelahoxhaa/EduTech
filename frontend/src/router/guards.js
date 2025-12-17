import { useAuth } from '../composables/useAuth'

export function setupRouterGuards(router) {
  router.beforeEach((to, from, next) => {
    const { isAuthenticated, user, hasRole } = useAuth()
    
    const guestOnlyRoutes = ['/', '/features', '/login', '/signup']
    const isGuestOnlyRoute = guestOnlyRoutes.includes(to.path)

    if (isAuthenticated.value && isGuestOnlyRoute) {
      const userRole = user.value?.role
      if (userRole === 'student') {
        return next('/my-courses')
      } else if (userRole === 'admin') {
        return next('/dashboard')
      } else if (userRole === 'teacher') {
        return next('/my-teaching-courses')
      }
    }

    if (!isAuthenticated.value && !isGuestOnlyRoute) {
      return next({ path: '/login', query: { redirect: to.fullPath } })
    }

    if (isAuthenticated.value && to.meta.requiresAuth) {
      const requiredRoles = to.meta.roles || []
      
      if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
        const userRole = user.value?.role
        if (userRole === 'admin') {
          return next('/dashboard')
        } else if (userRole === 'teacher') {
          return next('/my-teaching-courses')
        } else if (userRole === 'student') {
          return next('/my-courses')
        } else {
          return next('/login')
        }
      }
    }

    next()
  })
}
