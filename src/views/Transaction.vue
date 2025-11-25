<script setup>
import { onMounted, ref, computed } from 'vue'
import { useTransactionStore } from '@/stores/transaction'
import { useAuthStore } from '@/stores/auth'

const transactionStore = useTransactionStore()
const authStore = useAuthStore()
const loading = ref(true)
const errorMessage = ref('')

// Fetch transactions on mount
onMounted(async () => {
  try {
    await transactionStore.fetchTransactions()
  } catch (e) {
    console.error('Transaction fetch error:', e)
    errorMessage.value = 'Failed to load transactions.'
  } finally {
    loading.value = false
  }
})

// Computed lists for sent and received transactions
const sentTransactions = computed(() =>
  transactionStore.transactions.filter((t) => t.type === 'debit')
)

const receivedTransactions = computed(() =>
  transactionStore.transactions.filter((t) => t.type === 'credit')
)

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(amount)
}

// Format date
function formatDate(date) {
  return new Date(date).toLocaleString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="transactions-container">
    <h1>Transactions</h1>

    <div v-if="loading" class="loading">Loading transactions...</div>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

    <div v-if="!loading && !errorMessage">
      <div class="wallet-balance">
        <h2>Wallet Balance: {{ formatCurrency(authStore.getWalletBalance) }}</h2>
        <p>Address: {{ authStore.getWalletAddress }}</p>
      </div>

      <!-- Money Received -->
      <section class="transaction-section">
        <h3>💰 Money Received</h3>
        <div v-if="receivedTransactions.length === 0" class="empty-state">
          No received transactions yet
        </div>
        <ul v-else class="transaction-list">
          <li v-for="t in receivedTransactions" :key="t.id" class="transaction-item credit">
            <div class="transaction-header">
              <strong class="amount">+ {{ formatCurrency(t.amount) }}</strong>
              <span class="date">{{ formatDate(t.created_at) }}</span>
            </div>
            <div class="transaction-details">
              <span class="label">From:</span>
              <span class="value">{{ t.sender_info?.name || 'Unknown' }}</span>
            </div>
            <div class="transaction-details">
              <span class="label">Address:</span>
              <span class="value">{{ t.sender_info?.address || 'N/A' }}</span>
            </div>
            <div v-if="t.description" class="transaction-details">
              <span class="label">Note:</span>
              <span class="value">{{ t.description }}</span>
            </div>
            <div class="transaction-footer">
              <span class="reference">Ref: {{ t.reference }}</span>
            </div>
          </li>
        </ul>
      </section>

      <!-- Money Sent -->
      <section class="transaction-section">
        <h3>📤 Money Sent</h3>
        <div v-if="sentTransactions.length === 0" class="empty-state">No sent transactions yet</div>
        <ul v-else class="transaction-list">
          <li v-for="t in sentTransactions" :key="t.id" class="transaction-item debit">
            <div class="transaction-header">
              <strong class="amount">- {{ formatCurrency(t.amount) }}</strong>
              <span class="date">{{ formatDate(t.created_at) }}</span>
            </div>
            <div class="transaction-details">
              <span class="label">To:</span>
              <span class="value">{{ t.recipient_info?.name || 'Unknown' }}</span>
            </div>
            <div class="transaction-details">
              <span class="label">Address:</span>
              <span class="value">{{ t.recipient_info?.address || 'N/A' }}</span>
            </div>
            <div v-if="t.description" class="transaction-details">
              <span class="label">Note:</span>
              <span class="value">{{ t.description }}</span>
            </div>
            <div class="transaction-footer">
              <span class="reference">Ref: {{ t.reference }}</span>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped>
.transactions-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h1 {
  color: #333;
  margin-bottom: 1.5rem;
}

.wallet-balance {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.wallet-balance h2 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.wallet-balance p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.loading {
  text-align: center;
  color: #ff9800;
  padding: 2rem;
  font-weight: 600;
}

.error {
  background: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.transaction-section {
  margin-bottom: 2rem;
}

.transaction-section h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.empty-state {
  color: #999;
  font-style: italic;
  padding: 1rem;
  text-align: center;
  background: #f9f9f9;
  border-radius: 4px;
}

.transaction-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.transaction-item {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  transition: box-shadow 0.3s;
}

.transaction-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.transaction-item.credit {
  border-left: 4px solid #4caf50;
}

.transaction-item.debit {
  border-left: 4px solid #f44336;
}

.transaction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.amount {
  font-size: 1.2rem;
  font-weight: bold;
}

.credit .amount {
  color: #4caf50;
}

.debit .amount {
  color: #f44336;
}

.date {
  color: #666;
  font-size: 0.85rem;
}

.transaction-details {
  display: flex;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.label {
  font-weight: 600;
  color: #666;
  min-width: 80px;
}

.value {
  color: #333;
}

.transaction-footer {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #eee;
}

.reference {
  font-size: 0.8rem;
  color: #999;
  font-family: monospace;
}
</style>