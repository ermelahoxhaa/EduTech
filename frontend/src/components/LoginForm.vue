<template>
  <div class="auth-wrapper">
    <div class="auth-container">
      <div class="auth-header">
        <p class="eyebrow">Welcome Back</p>
        <h2>Login to EduTech</h2>
        <p class="subtitle">Enter your credentials to access your account</p>
      </div>
      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email"
            v-model="form.email" 
            type="email" 
            placeholder="Enter your email"
            required 
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            id="password"
            v-model="form.password" 
            type="password" 
            placeholder="Enter your password"
            required 
          />
        </div>
        <button type="submit" class="btn-primary">Login</button>
      </form>
      <p class="auth-link">
        Don't have an account? <router-link to="/signup">Sign Up</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  email: '',
  password: ''
})

import { useAuth } from '@/composables/useAuth'

const { login } = useAuth()

const handleLogin = async () => {
  try {
    const result = await login(form.value.email, form.value.password)
    
    if (result.success) {
      const userRole = result.user.role
      if (userRole === 'admin' || userRole === 'teacher') {
        router.push('/dashboard')
      } else if (userRole === 'student') {
        router.push('/my-courses')
      } else {
        router.push('/')
      }
    } else {
      alert(result.message || 'Login failed! Please check your credentials.')
    }
  } catch (error) {
    console.error('Login error:', error)
    alert('An error occurred during login. Please try again.')
  }
}
</script>

<style scoped>
.auth-wrapper {
  background: #f8f9fa;
  min-height: calc(100vh - 200px);
  padding: 3rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-container {
  max-width: 480px;
  width: 100%;
  background: #ffffff;
  padding: 2.5rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.75rem;
  font-weight: 700;
  color: #0b56d1;
  margin-bottom: 0.75rem;
}

h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0d1930;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.subtitle {
  color: #6c757d;
  font-size: 0.95rem;
  margin: 0;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #42506b;
  font-size: 0.9rem;
}

input {
  padding: 0.85rem 1rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  background: #ffffff;
  color: #0d1930;
}

input:focus {
  outline: none;
  border-color: #4F6466;
  box-shadow: 0 0 0 3px rgba(79, 100, 102, 0.1);
}

input::placeholder {
  color: #6c757d;
}

.btn-primary {
  padding: 0.85rem 1.5rem;
  background: #4F6466;
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 0.5rem 1rem rgba(79, 100, 102, 0.2);
  background: #3d4f51;
}

.btn-primary:active {
  transform: translateY(0);
}

.auth-link {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: #6c757d;
}

.auth-link a {
  color: #4F6466;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
}

.auth-link a:hover {
  color: #0b56d1;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .auth-wrapper {
    padding: 2rem 1rem;
  }

  .auth-container {
    padding: 2rem 1.5rem;
  }

  h2 {
    font-size: 1.5rem;
  }
}

</style>
