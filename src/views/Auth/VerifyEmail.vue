<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
  router.push({ name: 'login' })
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

      <button class="mt-6" @click="goToLogin">Go to Login</button>
    </div>
  </div>
</template>
