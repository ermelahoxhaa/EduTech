<template>
  <div class="auth-container">
    <h2>Sign Up</h2>
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
        <label for="retryPassword">Retry Password</label>
        <input 
          id="retryPassword"
          v-model="form.retryPassword" 
          type="password" 
          placeholder="Confirm your password"
          required 
        />
        <span v-if="passwordMismatch" class="error">Passwords do not match</span>
      </div>
      <button type="submit" :disabled="passwordMismatch">Sign Up</button>
    </form>
    <p class="auth-link">
      Already have an account? <router-link to="/login">Login</router-link>
    </p>
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

const handleSignup = () => {
  if (passwordMismatch.value) return
  
  console.log('Signup data:', form.value)
  // Here you would normally send data to your API
  alert('Account created successfully!')
  router.push('/login')
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #42b983;
}

.error {
  color: #ff4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

button {
  padding: 0.75rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
}

button:hover {
  background-color: #0b56d1;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.auth-link {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.875rem;
}

.auth-link a {
  color: #0b56d1;
  text-decoration: none;
}

.auth-link a:hover {
  text-decoration: underline;
}
</style>
