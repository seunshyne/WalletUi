<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTransactionStore } from '@/stores/transaction'
import { watch } from 'vue'

const authStore = useAuthStore()
const transactionStore = useTransactionStore()

const form = ref({
  amount: '',
  description: '',
  recipient: '', // email or wallet address
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
  //wallet must be loaded
  if (!authStore.wallet) {
    errorMessage.value = 'Wallet not loaded. Please wait.'
    return
  }
  // recipient input must not be empty
  if (!form.value.recipient) {
    errorMessage.value = 'Please enter a recipient email or wallet address.'
    return
  }
  // recipient must be resolved(email or wallet)
  if (!transactionStore.recipientPreview) {
    errorMessage.value = 'Please enter a valid recipient email or wallet address.'
    return
  }
  //Block unverified recipient emails
  if (
    transactionStore.recipientPreview.type === 'email' &&
    !transactionStore.recipientPreview.verified
  ) {
    errorMessage.value = 'Recipient email is not verified.'
    return
  }
  //clear states
  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true

  const payload = {
    //wallet_id: authStore.wallet.id,
    recipient: form.value.recipient.trim(),
    amount: form.value.amount.toString(),
    description: form.value.description,
    client_idempotency_key: transactionStore.generateIdempotencyKey(),
  }

  try {
    const result = await transactionStore.sendMoney(payload)

    if (result && result.status === 'success') {
      // Update local wallet balance
      authStore.updateWalletBalance(result.sender_wallet_balance)

      successMessage.value = `Successfully sent ₦${payload.amount} to ${transactionStore.recipientPreview.name}`

      // Reset form
      form.value.amount = ''
      form.value.description = ''
      form.value.recipient = ''
    } else {
      errorMessage.value = result?.message || 'Failed to send money'
    }
  } catch (e) {
    console.error(e)
    errorMessage.value = 'Network error. Try again.'
  }

  loading.value = false
}

let debounceTimer = null

watch(
  () => form.value.recipient,
  (value) => {
    transactionStore.recipientPreview = null
    transactionStore.recipientError = null

    if (!value || value.trim().length < 3) return

    clearTimeout(debounceTimer)

    debounceTimer = setTimeout(async () => {
      transactionStore.resolveRecipient(value.trim())
    }, 500)
  }
)
</script>

<template>
  <div class="send-money-container">
    <h2>Send Money</h2>

    <div v-if="walletLoading" style="color: orange">Loading wallet… please wait.</div>

    <form v-if="!walletLoading" @submit.prevent="submitTransaction">
      <input v-model="form.amount" type="text" inputmode="decimal" placeholder="Amount" required />

      <input v-model="form.description" type="text" placeholder="Description" required />

      <input
        v-model="form.recipient"
        type="text"
        placeholder="Recipient Email or Wallet Address"
        required
      />

      <div v-if="transactionStore.resolving" style="color: orange">Checking recipient…</div>

      <div v-if="transactionStore.recipientPreview">
        <div style="color: green">📧 {{ transactionStore.recipientPreview.email }}</div>

        <p>💼 {{ transactionStore.recipientPreview.wallet_address }}</p>

        <p v-if="transactionStore.recipientPreview.name">
          👤 Name: {{ transactionStore.recipientPreview.name }}
        </p>

        <p
          v-if="
            transactionStore.recipientPreview.type === 'email' &&
            !transactionStore.recipientPreview.verified
          "
          style="color: red"
        >
          ⚠️ Recipient email not verified
        </p>
      </div>

      <p v-if="transactionStore.recipientError" class="error">
        {{ transactionStore.recipientError }}
      </p>

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
