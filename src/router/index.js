import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Transaction from '../views/Transaction.vue'
import Send from '../views/Send.vue'
import Signup from '../views/Auth/Signup.vue'
import Login from '../views/Auth/Login.vue'
import Home from '../views/Home.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: { requiresAuth: true }
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: Transaction,
      meta: { requiresAuth: true }
    },
    {
      path: '/send',
      name: 'send',
      component: Send,
      meta: { requiresAuth: true }
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
      meta: { requiresGuest: true }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { requiresGuest: true }
    },
  ],

})

router.beforeEach(async (to, from, next) => {
  //import the store inside the function to ensure its available
  const { useAuthStore } = await import("@/stores/auth");
  const authStore = useAuthStore()

  //try to get user if we have a token
  if (localStorage.getItem('token')) {
    await authStore.getUser()
  }

  //check if route requires authentication
  if (to.meta.requiresAuth && !authStore.user) {
    next({ name: 'login' });
    return;
  }
  //check if route requires guest (non-authenticated)
  if (to.meta.requiresGuest && authStore.user) {
    next({ name: 'dashboard' });
    return;
  }

  next();
})


export default router
