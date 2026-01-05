<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { onUnmounted, ref } from 'vue'

const router = useRouter()
const authStore = useAuthStore()

onUnmounted(() => {
  // Clear timer on component unmount
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})

const cooldown = ref(0)
let timer = null

// Get email from query string (passed from login/register)
const email = new URLSearchParams(window.location.search).get('email') || ''

const message = ref('')

const goToLogin = () => {
  router.push({ name: 'login' })
}

const resend = async () => {
  if (!email) {
    alert('Email not found. Please login again to resend verification email.')
    return
  }
  // Prevent clicking during cooldown
  if (cooldown.value > 0) {
    return
  }
  try {
    const msg = await authStore.resendVerification(email)
    message.value = msg || 'Verification email resent successfully'

    // Start cooldown (e.g., 60 seconds)
    cooldown.value = 60
    timer = setInterval(() => {
      cooldown.value--

      if (cooldown.value <= 0) {
        clearInterval(timer)
        timer = null
      }
    }, 1000)
  } catch (err) {
    message.value = err.message || 'Failed to resend verification email'
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-box text-center">
      <h2>Verify your email</h2>

      <p class="mt-4">We’ve sent a verification link to your email address.</p>

      <p class="mt-2 text-sm text-gray-600">
        Please check your inbox and click the link to activate your account.
      </p>

      <button class="mt-6" :disabled="cooldown > 0" @click="resend">
        <span v-if="cooldown === 0">Resend verification email</span>
        <span v-else>Resend in {{ cooldown }}s</span>
      </button>

      <button class="mt-6" @click="goToLogin">Go to Login</button>
    </div>
  </div>
</template>
