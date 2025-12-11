<template>
  <div class="auth-container">
    <h2>Login</h2>
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
      <button type="submit">Login</button>
    </form>
    <p class="auth-link">
      Don't have an account? <router-link to="/signup">Sign Up</router-link>
    </p>
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

const handleLogin = () => {
  console.log('Login data:', form.value)
  alert('Login successful!')
  router.push('/')
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
  border-color: #0b56d1;
}

button {
  padding: 0.75rem;
  background-color: #0b56d1;
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

.auth-link {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.875rem;
}

</style>
