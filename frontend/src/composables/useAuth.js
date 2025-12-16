import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const user = ref(null)
const token = ref(localStorage.getItem('token') || null)
const isAuthenticated = computed(() => !!token.value && !!user.value)

const storedUser = localStorage.getItem('user')
if (storedUser) {
  try {
    user.value = JSON.parse(storedUser)
  } catch (e) {
    console.error('Error parsing stored user:', e)
  }
}

export function useAuth() {
  const router = useRouter()

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', 
        { email, password },
        { withCredentials: true }
      )
      
      if (!response.data || !response.data.token || !response.data.user) {
        return { 
          success: false, 
          message: 'Invalid response from server. Please try again.' 
        }
      }
      
      token.value = response.data.token
      user.value = response.data.user
      
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))
      
      return { success: true, user: user.value }
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Login failed. Please check your credentials and try again.'
      
      return { 
        success: false, 
        message: errorMessage
      }
    }
  }

  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, {
        withCredentials: true
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/login')
    }
  }

  const checkAuth = async () => {
    if (!token.value) {
      return false
    }

    try {
      const response = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { 'x-auth-token': token.value },
        withCredentials: true
      })
      
      user.value = response.data.user
      localStorage.setItem('user', JSON.stringify(user.value))
      return true
    } catch (error) {
      token.value = null
      user.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return false
    }
  }

  const hasRole = (roles) => {
    if (!user.value || !user.value.role) return false
    if (Array.isArray(roles)) {
      return roles.includes(user.value.role)
    }
    return user.value.role === roles
  }

  const isAdmin = computed(() => hasRole('admin'))
  const isTeacher = computed(() => hasRole('teacher'))
  const isStudent = computed(() => hasRole('student'))
  const isParent = computed(() => hasRole('parent'))

  return {
    user: computed(() => user.value),
    token: computed(() => token.value),
    isAuthenticated,
    isAdmin,
    isTeacher,
    isStudent,
    isParent,
    login,
    logout,
    checkAuth,
    hasRole
  }
}

