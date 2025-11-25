<script setup>
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'

const authStore = useAuthStore()
</script>

<template>
  <header class="header">
    <div class="logo-section">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
      <h1>Wallet Dashboard</h1>
    </div>

    <div v-if="authStore.user" class="user-section">
      <div class="notifications">
        <span class="notif-badge">3</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="bell-icon">
          <path fill="currentColor" d="M12 2C8.1 2 5 5.1 5 9v5H3v2h18v-2h-2V9c0-3.9-3.1-7-7-7z" />
        </svg>
      </div>
      <div class="user-info">
        <img src="@/assets/user.jpg" alt="User" class="avatar" />
        <span>Welcome back {{ authStore.user.name }}</span>
      </div>
      <form action="" @submit.prevent="authStore.logout()">
        <button class="logout">Logout</button>
      </form>
    </div>

    <div v-else class="link">
      <router-link to="/login" class="btn login-btn">Login</router-link>

      <router-link to="/signup" class="btn signup-btn">Sign Up</router-link>
    </div>
  </header>
</template>



<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 25px;
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  width: 40px;
  height: 40px;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.notifications {
  position: relative;
}

.notif-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: red;
  color: #fff;
  font-size: 10px;
  padding: 2px 5px;
  border-radius: 50%;
}

.bell-icon {
  width: 24px;
  height: 24px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
}

.link {
  display: flex;
  gap: 20px;
}

.welcome {
  display: flex;
  gap: 20px;
}

.logout {
  margin-top: 20px;
}
</style>
