<script setup>
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'

const { errors, message, user, wallet } = storeToRefs(useAuthStore())
const { authenticate } = useAuthStore()
const router = useRouter()

const formData = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const handleSubmit = async () => {
  const success = await authenticate('register', formData)
  if (success) {
    // Wallet is automatically created and stored in the auth store
    console.log('Wallet created successfully:', wallet.value)
    console.log('Wallet address:', wallet.value?.address)
    console.log('Wallet balance:', wallet.value?.balance)

    // Show success message with wallet info
    if (wallet.value) {
      alert(`Registration successful! Your wallet address: ${wallet.value.address}`)
    }

    // Redirect to dashboard
    router.replace({ name: 'dashboard' })
  } else {
    console.log('Authentication failed, not redirecting')
  }
}

onMounted(() => {
  errors.value = {}
  message.value = ''
})
</script>

<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2>Sign Up</h2>

      <!-- Show success message -->
      <p v-if="message" class="text-green-500 mb-4">{{ message }}</p>

      <!-- Show general errors -->
      <p v-if="errors.general" class="text-red-500 mb-4">{{ errors.general }}</p>
      <p v-if="errors.storage" class="text-red-500 mb-4">{{ errors.storage }}</p>
      <p v-if="errors.network" class="text-red-500 mb-4">{{ errors.network }}</p>

      <form @submit.prevent="handleSubmit">
        <div class="input-group">
          <label>Name</label>
          <input type="text" v-model="formData.name" placeholder="Enter your Name" />
          <p v-if="errors.name" class="text-red-500">{{ errors.name[0] }}</p>
        </div>

        <div class="input-group">
          <label>Email</label>
          <input type="email" v-model="formData.email" placeholder="Enter your email" />
          <p v-if="errors.email" class="text-red-500">{{ errors.email[0] }}</p>
        </div>

        <div class="input-group">
          <label>Password</label>
          <input type="password" v-model="formData.password" placeholder="Enter your password" />
          <p v-if="errors.password" class="text-red-500">{{ errors.password[0] }}</p>
        </div>

        <div class="input-group">
          <label>Confirm Password</label>
          <input
            type="password"
            v-model="formData.password_confirmation"
            placeholder="Confirm Password"
          />
        </div>
        <button>Sign Up</button>

        <div class="auth-footer">
          Already have an account? <router-link to="/login">Login</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

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
