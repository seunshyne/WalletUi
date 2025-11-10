<template>
  <div class="app-container">
    <Sidebar />
    <div class="main-content">
      <Header />
      <main>
        <router-view />
      </main>
      <Footer />
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Sidebar from "@/components/Sidebar.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "App",
  components: { 
    Header, 
    Sidebar, 
    Footer }
};
</script>

<style>
.app-container {
  display: flex;
  height: 100vh;
  background-color: #ecf0f1;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
main {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>
