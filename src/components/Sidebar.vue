<script setup>
import { ref, onMounted } from 'vue'
import { Motion } from '@oku-ui/motion'
import { useRouter } from 'vue-router'

const router = useRouter()

// Sidebar state
const sidebarOpen = ref(false)
const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})

// Toggle sidebar manually
function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

// Close sidebar
function closeSidebar() {
  sidebarOpen.value = false
}

// Close when clicking a link
function handleLinkClick(path) {
  router.push(path)
  closeSidebar()
}
</script>

<template>
  <!-- Sidebar motion wrapper -->
  <Motion
    v-if="isMounted && sidebarOpen"
    :initial="{ x: -250, opacity: 0 }"
    :animate="{ x: sidebarOpen ? 0 : -250, opacity: sidebarOpen ? 1 : 0 }"
    :transition="{ duration: 0.3, ease: 'easeOut' }"
    class="sidebar"
    @mouseleave="closeSidebar"
  >
    <!-- <h2>Wallet</h2> -->
    <nav>
      <a class="nav-link" @click="handleLinkClick('/dashboard')">Dashboard</a>
      <a class="nav-link" @click="handleLinkClick('/transactions')">Transactions</a>
      <a class="nav-link" @click="handleLinkClick('/send')">Send</a>
      <a class="nav-link" @click="handleLinkClick('/receive')">Receive</a>
      <a class="nav-link" @click="handleLinkClick('/settings')">Settings</a>
    </nav>
  </Motion>

  <!-- Burger button -->
  <button class="burger-btn" @click="toggleSidebar">☰</button>
</template>

<style scoped>
.sidebar {
  width: 220px;
  min-height: 100vh;
  background-color: rgba(44, 62, 80, 0.85); /* transparent dark */
  color: #fff;
  padding: 20px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  backdrop-filter: blur(6px); /* glass effect */
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar h2 {
  font-size: 24px;
  margin-bottom: 30px;
}

.nav-link {
  display: block;
  padding: 10px 15px;
  margin-bottom: 10px;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Burger button */
.burger-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 200;
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
  color: #fff;
}
</style>
