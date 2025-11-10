<template>
  <div class="dashboard">
    <h2>Wallet Dashboard</h2>

    <!-- Balance cards -->
    <div class="cards">
      <div class="card">
        <h3>Total Balance</h3>
        <p>$12,340.50</p>
      </div>
      <div class="card">
        <h3>Crypto</h3>
        <p>3.452 BTC</p>
      </div>
      <div class="card">
        <h3>Available Funds</h3>
        <p>$4,500.00</p>
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
          <tr>
            <td>2025-11-10</td>
            <td>Received BTC</td>
            <td>+0.25 BTC</td>
            <td class="success">Completed</td>
          </tr>
          <tr>
            <td>2025-11-09</td>
            <td>Sent USD</td>
            <td>-$100.00</td>
            <td class="pending">Pending</td>
          </tr>
          <tr>
            <td>2025-11-08</td>
            <td>Received USD</td>
            <td>+$500.00</td>
            <td class="success">Completed</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.cards {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.card {
  background-color: #fff;
  flex: 1;
  min-width: 200px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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

.transactions table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.transactions th, .transactions td {
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
