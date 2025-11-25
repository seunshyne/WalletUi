<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTransactionStore } from '@/stores/transaction'

const authStore = useAuthStore()
const transactionStore = useTransactionStore()

const form = ref({
  amount: '',
  description: '',
  recipient_address: '',
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const walletLoading = ref(true)

onMounted(async () => {
  try {
    if (!authStore.wallet) {
      await authStore.fetchWallet()
    }
  } catch (e) {
    errorMessage.value = 'Failed to load wallet. Please refresh.'
  }
  walletLoading.value = false
})

async function submitTransaction() {
  if (!authStore.wallet) {
    errorMessage.value = 'Wallet not loaded. Please wait.'
    return
  }

  if (!form.value.recipient_address) {
    errorMessage.value = 'Please enter a recipient address.'
    return
  }

  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true

  const payload = {
    wallet_id: authStore.wallet.id,
    recipient_address: form.value.recipient_address,
    amount: Number(form.value.amount),
    description: form.value.description,
    client_idempotency_key: transactionStore.generateIdempotencyKey(),
  }

  try {
    const result = await transactionStore.sendMoney(payload)

    if (result && result.status === 'success') {
      // Update local wallet balance
      authStore.updateWalletBalance(result.sender_wallet_balance)

      successMessage.value = `Successfully sent ₦${payload.amount} to ${payload.recipient_address}`

      // Reset form
      form.value.amount = ''
      form.value.description = ''
      form.value.recipient_address = ''
    } else {
      errorMessage.value = result?.message || 'Failed to send money'
    }
  } catch (e) {
    console.error(e)
    errorMessage.value = 'Network error. Try again.'
  }

  loading.value = false
}
</script>

<template>
  <div class="send-money-container">
    <h2>Send Money</h2>

    <div v-if="walletLoading" style="color: orange">Loading wallet… please wait.</div>

    <form v-if="!walletLoading" @submit.prevent="submitTransaction">
      <input
        v-model="form.amount"
        type="number"
        min="0.01"
        step="0.01"
        placeholder="Amount"
        required
      />

      <input v-model="form.description" type="text" placeholder="Description" required />

      <input
        v-model="form.recipient_address"
        type="text"
        placeholder="Recipient Wallet Address"
        required
      />

      <button type="submit" :disabled="loading">
        {{ loading ? 'Sending…' : 'Send' }}
      </button>
    </form>

    <p v-if="successMessage" class="success">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.send-money-container {
  max-width: 400px;
  margin: auto;
}
input {
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
  box-sizing: border-box;
}
button {
  padding: 10px;
  width: 100%;
}
.success {
  color: green;
  margin-top: 10px;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
