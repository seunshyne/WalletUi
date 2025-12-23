<script setup>
import { ref, onMounted, watch } from 'vue'
import { Motion } from '@oku-ui/motion'
import { useAuthStore } from '@/stores/auth'
import { useTransactionStore } from '@/stores/transaction'

const authStore = useAuthStore()
const transactionStore = useTransactionStore()

// Reactive animated balance
const animatedBalance = ref(0)

// Sample transactions (replace with API data)
const transactions = ref([
  {
    date: '2025-11-10',
    desc: 'Received BTC',
    amount: '+0.25 BTC',
    status: 'Completed',
    statusClass: 'success',
  },
  {
    date: '2025-11-09',
    desc: 'Sent USD',
    amount: '-$100.00',
    status: 'Pending',
    statusClass: 'pending',
  },
  {
    date: '2025-11-08',
    desc: 'Received USD',
    amount: '+$500.00',
    status: 'Completed',
    statusClass: 'success',
  },
])

// Fetch wallet on mount
onMounted(async () => {
  if (!authStore.wallet) {
    await authStore.fetchWallet()
  }
})

// Watch for balance changes and animate count-up
watch(
  () => authStore.getWalletBalance,
  (newBalance) => {
    const numericBalance = Number(newBalance)
    if (!isNaN(numericBalance)) countUp(numericBalance)
  },
  { immediate: true }
)

// Manual count-up animation
function countUp(target) {
  animatedBalance.value = 0
  const duration = 1200 // ms
  const frameRate = 16
  const totalFrames = duration / frameRate
  const increment = target / totalFrames
  let current = 0

  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      animatedBalance.value = target
      clearInterval(timer)
    } else {
      animatedBalance.value = Math.floor(current)
    }
  }, frameRate)
}
</script>

<template>
  <div class="dashboard">
    <h2>Wallet Dashboard</h2>

    <!-- Balance cards -->
    <div class="cards">
      <div class="card">
        <h3>Total Balance</h3>
        <Motion
          :initial="{ opacity: 0, y: 10 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, ease: 'easeOut' }"
        >
          <p>{{ animatedBalance.toLocaleString() }} {{ authStore.getWalletCurrency }}</p>
        </Motion>
      </div>

      <div class="card">
        <h3>Crypto</h3>
        <Motion
          :initial="{ scale: 0.95, opacity: 0 }"
          :animate="{ scale: 1, opacity: 1 }"
          :transition="{ duration: 0.3 }"
        >
          <p>3.452 BTC</p>
        </Motion>
      </div>

      <div class="card">
        <h3>Available Funds</h3>
        <Motion
          :initial="{ scale: 0.95, opacity: 0 }"
          :animate="{ scale: 1, opacity: 1 }"
          :transition="{ duration: 0.3 }"
        >
          <p>$4,500.00</p>
        </Motion>
      </div>
    </div>

    <!-- Recent transactions -->
    <div class="transactions">
      <h3>Recent Transactions</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <Motion
            v-for="(tx, index) in transactions"
            :key="index"
            tag="tr"
            :initial="{ opacity: 0, x: -20 }"
            :animate="{ opacity: 1, x: 0 }"
            :transition="{ delay: index * 0.05, duration: 0.4 }"
          >
            <td>{{ tx.date }}</td>
            <td>{{ tx.desc }}</td>
            <td>{{ tx.amount }}</td>
            <td :class="tx.statusClass">{{ tx.status }}</td>
          </Motion>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 20px;
}

/* Cards layout */
.cards {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

/* Card styles */
.card {
  background-color: #fff;
  flex: 1;
  min-width: 200px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.card h3 {
  margin-bottom: 10px;
  font-size: 18px;
  color: #555;
}

.card p {
  font-size: 22px;
  font-weight: bold;
}

/* Transactions table */
.transactions table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.transactions th,
.transactions td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.transactions th {
  background-color: #f5f5f5;
}

.transactions tr:last-child td {
  border-bottom: none;
}

.transactions td.success {
  color: green;
  font-weight: bold;
}

.transactions td.pending {
  color: orange;
  font-weight: bold;
}
</style>
