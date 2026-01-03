<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'

const router = useRouter()
const authStore = useAuthStore()

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
  try {
    const msg = await authStore.resendVerification(email)
    message.value = msg || 'Verification email resent successfully'
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

      <button class="mt-6" @click="resend">'Resend verification email'</button>

      <button class="mt-6" @click="goToLogin">Go to Login</button>
    </div>
  </div>
</template>
