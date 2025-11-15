<template>
  <div class="home-container">
    <div class="home-box">
      <h1>Welcome to My Wallet App</h1>
      <p>Your secure place to manage your funds.</p>
      <div class="button-group">
        <router-link to="/login" class="btn login-btn">Login</router-link>
        <router-link to="/signup" class="btn signup-btn">Sign Up</router-link>
      </div>
    </div>
  </div>
</template>

<script setup></script>
  import 
<style scoped>
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to bottom right, #007bff, #00c6ff);
  color: white;
  text-align: center;
}

.home-box {
  background-color: rgba(0, 0, 0, 0.5);
  padding: 50px 30px;
  border-radius: 10px;
  max-width: 450px;
}

.home-box h1 {
  font-size: 32px;
  margin-bottom: 20px;
}

.home-box p {
  font-size: 16px;
  margin-bottom: 30px;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.btn {
  padding: 12px 25px;
  border-radius: 6px;
  font-size: 16px;
  text-decoration: none;
  font-weight: bold;
  transition: background 0.3s ease;
}

.login-btn {
  background-color: #ffffff;
  color: #007bff;
}

.login-btn:hover {
  background-color: #f0f0f0;
}

.signup-btn {
  background-color: #007bff;
  color: white;
}

.signup-btn:hover {
  background-color: #0056b3;
}
</style>
