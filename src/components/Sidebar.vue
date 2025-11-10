<template>
  <aside class="sidebar">
    <h2>Wallet</h2>
    <nav>
      <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
      <router-link to="/transactions" class="nav-link">Transactions</router-link>
      <router-link to="/send" class="nav-link">Send</router-link>
      <router-link to="/receive" class="nav-link">Receive</router-link>
      <router-link to="/settings" class="nav-link">Settings</router-link>
    </nav>
  </aside>
</template>

<script>
export default {
  name: "Sidebar"
}
</script>

<style scoped>
.sidebar {
  width: 220px;
  min-height: 100vh;
  background-color: #2c3e50;
  color: #fff;
  padding: 20px;
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
}

.nav-link:hover {
  background-color: #34495e;
}
</style>
