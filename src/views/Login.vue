<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2>Login</h2>
      <div class="input-group">
        <label>Email</label>
        <input type="email" v-model="email" placeholder="Enter your email" />
      </div>
      <div class="input-group">
        <label>Password</label>
        <input type="password" v-model="password" placeholder="Enter your password" />
      </div>
      <button @click="handleLogin">Login</button>
      <div class="auth-footer">
        Don't have an account? <router-link to="/signup">Sign Up</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')

const handleLogin = async() => {
    errorMessage.value = ''
    try {
        const response = await api.post('/login', {
            email: email.value,
            password: password.value
        })
        localStorage.setItem('token', response.data.token)
        console.log('login successful:', response.data)

        router.push('/dashboard')
    } catch (error) {
        if (error.response) {
            errorMessage.value = error.response.data.message || 'Login failed'
        } else {
            errorMessage.value = 'Network error'
        }
    }
  
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f3f3f3;
}

.auth-box {
  background-color: #fff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.auth-box h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: bold;
  color: #555;
}

.input-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

.input-group input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
}

button {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.auth-footer {
  margin-top: 20px;
  text-align: center;
  color: #555;
}

.auth-footer a {
  color: #007bff;
  text-decoration: none;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>
