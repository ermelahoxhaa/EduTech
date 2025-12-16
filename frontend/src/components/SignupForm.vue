<template>
  <div class="auth-wrapper">
    <div class="auth-container">
      <div class="auth-header">
        <p class="eyebrow">Join EduTech</p>
        <h2>Create Your Account</h2>
        <p class="subtitle">Sign up as a student to start your learning journey</p>
      </div>
      <form @submit.prevent="handleSignup" class="auth-form">
        <div class="form-group">
          <label for="name">First Name</label>
          <input 
            id="name"
            v-model="form.name" 
            type="text" 
            placeholder="Enter your first name"
            required 
          />
        </div>
        <div class="form-group">
          <label for="surname">Last Name</label>
          <input 
            id="surname"
            v-model="form.surname" 
            type="text" 
            placeholder="Enter your last name"
            required 
          />
        </div>
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
        <div class="form-group">
          <label for="retryPassword">Confirm Password</label>
          <input 
            id="retryPassword"
            v-model="form.retryPassword" 
            type="password" 
            placeholder="Confirm your password"
            required 
          />
          <span v-if="passwordMismatch" class="error">Passwords do not match</span>
        </div>
        <button type="submit" class="btn-primary" :disabled="passwordMismatch">Sign Up</button>
      </form>
      <p class="auth-link">
        Already have an account? <router-link to="/login">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  name: '',
  surname: '',
  email: '',
  password: '',
  retryPassword: ''
})

const passwordMismatch = computed(() => {
  return form.value.password && form.value.retryPassword && 
         form.value.password !== form.value.retryPassword
})

import axios from 'axios'

const handleSignup = async () => {
  if (passwordMismatch.value) return
  
  const signupData = {
    name: `${form.value.name} ${form.value.surname}`.trim(),
    email: form.value.email,
    password: form.value.password
  }
  
  try {
    await axios.post('http://localhost:5000/api/auth/signup', signupData, {
      withCredentials: true
    })
    alert('Account created successfully!')
    router.push('/login')
  } catch (error) {
    alert(error.response?.data?.message || 'Signup failed!')
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

.error {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  font-weight: 500;
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

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 0.5rem 1rem rgba(79, 100, 102, 0.2);
  background: #3d4f51;
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
  transform: none;
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
