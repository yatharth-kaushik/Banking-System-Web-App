/* ==========================================================
   MYBANK - BANKING MANAGEMENT SYSTEM
   Pure JavaScript + LocalStorage powered banking app
   ========================================================== */

/* ---------------- LOCALSTORAGE KEYS ---------------- */
const STORAGE_KEYS = {
  ACCOUNTS: "mybank_accounts",
  TRANSACTIONS: "mybank_transactions",
  CURRENT_USER: "mybank_currentUser",
  TXN_COUNTER: "mybank_txn_counter"
};

/* ---------------- DOM REFERENCES ---------------- */
const authPage = document.getElementById("authPage");
const registerPage = document.getElementById("registerPage");
const successPage = document.getElementById("successPage");
const dashboardPage = document.getElementById("dashboardPage");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const depositForm = document.getElementById("depositForm");
const withdrawForm = document.getElementById("withdrawForm");
const transferForm = document.getElementById("transferForm");
const changePinForm = document.getElementById("changePinForm");

/* ==========================================================
   STORAGE HELPER FUNCTIONS
   ========================================================== */

// Get all accounts from LocalStorage
function getAccounts() {
  const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
  return data ? JSON.parse(data) : [];
}

// Save accounts array to LocalStorage
function saveAccounts(accounts) {
  localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
}

// Get all transactions from LocalStorage
function getTransactions() {
  const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  return data ? JSON.parse(data) : [];
}

// Save transactions array to LocalStorage
function saveTransactions(transactions) {
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
}

// Get the next unique transaction ID
function getNextTransactionId() {
  let counter = parseInt(localStorage.getItem(STORAGE_KEYS.TXN_COUNTER) || "0", 10);
  counter += 1;
  localStorage.setItem(STORAGE_KEYS.TXN_COUNTER, String(counter));
  return counter;
}

// Get the currently logged-in user's account number
function getCurrentUser() {
  const accNum = sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER) ||
                 localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (!accNum) return null;
  const accounts = getAccounts();
  return accounts.find(acc => String(acc.accountNumber) === String(accNum)) || null;
}

// Set the current logged in user (persist across refresh)
function setCurrentUser(accountNumber) {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, String(accountNumber));
  sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, String(accountNumber));
}

// Clear the current logged in user session
function clearCurrentUser() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

/* ==========================================================
   UTILITY FUNCTIONS
   ========================================================== */

// Format a number as Indian Rupees currency
function formatCurrency(amount) {
  const num = Number(amount) || 0;
  return "₹" + num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Format a date string into a readable format
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

// Generate a random unique 10-digit account number
function generateAccountNumber() {
  const accounts = getAccounts();
  let accountNumber;
  let isUnique = false;

  while (!isUnique) {
    // Generates a number between 1000000000 and 9999999999
    accountNumber = Math.floor(1000000000 + Math.random() * 9000000000);
    isUnique = !accounts.some(acc => acc.accountNumber === accountNumber);
  }
  return accountNumber;
}

// Show a toast notification (success or error)
function showToast(title, message, type = "success") {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === "success" ? "✅" : "⚠️"}</span>
    <div class="toast-body">
      <strong>${title}</strong>
      <p>${message}</p>
    </div>
  `;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// Basic input validators
function isValidPin(pin) {
  return /^\d{4}$/.test(pin);
}
function isValidAccountNumber(accNum) {
  return /^\d{10}$/.test(accNum);
}
function isValidAmount(amount) {
  return !isNaN(amount) && parseFloat(amount) > 0;
}

/* ==========================================================
   PAGE NAVIGATION
   ========================================================== */

function showPage(page) {
  [authPage, registerPage, successPage, dashboardPage].forEach(p => p.classList.add("hidden"));
  page.classList.remove("hidden");
}

function showSection(sectionId) {
  document.querySelectorAll(".content-section").forEach(sec => sec.classList.add("hidden"));
  document.getElementById(sectionId).classList.remove("hidden");

  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.toggle("active", item.dataset.section === sectionId);
  });

  // Close mobile sidebar after navigating
  closeSidebar();

  // Refresh section-specific data
  if (sectionId === "dashboard-section") renderDashboard();
  if (sectionId === "balance-section") renderBalanceSection();
  if (sectionId === "history-section") renderTransactionHistory();
  if (sectionId === "account-section") renderAccountDetails();
}

/* ==========================================================
   ACCOUNT CREATION
   ========================================================== */

function createAccount(name, pin) {
  const accounts = getAccounts();
  const newAccount = {
    accountNumber: generateAccountNumber(),
    name: name.trim(),
    pin: parseInt(pin, 10),
    balance: 0,
    createdAt: new Date().toISOString()
  };
  accounts.push(newAccount);
  saveAccounts(accounts);
  return newAccount;
}

registerForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("regName").value.trim();
  const pin = document.getElementById("regPin").value.trim();
  const confirmPin = document.getElementById("regConfirmPin").value.trim();

  if (!name) {
    showToast("Invalid Name", "Account holder name cannot be empty.", "error");
    return;
  }
  if (!isValidPin(pin)) {
    showToast("Invalid PIN", "PIN must be exactly 4 digits.", "error");
    return;
  }
  if (pin !== confirmPin) {
    showToast("PIN Mismatch", "PIN and Confirm PIN do not match.", "error");
    return;
  }

  const newAccount = createAccount(name, pin);

  document.getElementById("successAccNumber").textContent = newAccount.accountNumber;
  document.getElementById("successBalance").textContent = formatCurrency(newAccount.balance);

  registerForm.reset();
  showPage(successPage);
});

/* ==========================================================
   LOGIN / LOGOUT
   ========================================================== */

function login(accountNumber, pin) {
  const accounts = getAccounts();
  const account = accounts.find(acc =>
    String(acc.accountNumber) === String(accountNumber) && acc.pin === parseInt(pin, 10)
  );
  return account || null;
}

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const accountNumber = document.getElementById("loginAccountNumber").value.trim();
  const pin = document.getElementById("loginPin").value.trim();

  if (!isValidAccountNumber(accountNumber)) {
    showToast("Invalid Account Number", "Please enter a valid 10-digit account number.", "error");
    return;
  }
  if (!isValidPin(pin)) {
    showToast("Invalid PIN", "PIN must be exactly 4 digits.", "error");
    return;
  }

  const account = login(accountNumber, pin);

  if (account) {
    setCurrentUser(account.accountNumber);
    showToast("Login Successful", `Welcome back, ${account.name}!`, "success");
    loginForm.reset();
    openDashboard();
  } else {
    showToast("Login Failed", "Invalid Account Number or PIN.", "error");
  }
});

function logout() {
  clearCurrentUser();
  showPage(authPage);
  showToast("Logged Out", "You have been logged out successfully.", "success");
}

document.getElementById("logoutBtn").addEventListener("click", logout);

/* ==========================================================
   NAVIGATION BUTTONS (LOGIN <-> REGISTER <-> SUCCESS)
   ========================================================== */

document.getElementById("showRegisterBtn").addEventListener("click", () => showPage(registerPage));
document.getElementById("backToLoginBtn").addEventListener("click", () => showPage(authPage));
document.getElementById("goToLoginBtn").addEventListener("click", () => showPage(authPage));

/* ==========================================================
   OPEN DASHBOARD (ON LOGIN OR PAGE REFRESH)
   ========================================================== */

function openDashboard() {
  const user = getCurrentUser();
  if (!user) {
    showPage(authPage);
    return;
  }
  showPage(dashboardPage);
  showSection("dashboard-section");
}

/* ==========================================================
   BALANCE / TRANSACTION HELPERS
   ========================================================== */

// Update a specific user's balance in the accounts list
function updateBalance(accountNumber, newBalance) {
  const accounts = getAccounts();
  const idx = accounts.findIndex(acc => acc.accountNumber === accountNumber);
  if (idx !== -1) {
    accounts[idx].balance = newBalance;
    saveAccounts(accounts);
  }
}

// Add a new transaction record to the transactions list
function addTransaction(accountNumber, type, amount, balanceAfter) {
  const transactions = getTransactions();
  const record = {
    transactionId: getNextTransactionId(),
    accountNumber: accountNumber,
    transactionType: type,
    amount: parseFloat(amount),
    balanceAfter: parseFloat(balanceAfter),
    transactionDate: new Date().toISOString()
  };
  transactions.push(record);
  saveTransactions(transactions);
  return record;
}

/* ==========================================================
   DEPOSIT MONEY
   ========================================================== */

function depositMoney(accountNumber, amount) {
  const accounts = getAccounts();
  const account = accounts.find(acc => acc.accountNumber === accountNumber);
  if (!account) return { success: false, message: "Account not found." };

  const newBalance = account.balance + parseFloat(amount);
  updateBalance(accountNumber, newBalance);
  addTransaction(accountNumber, "Deposit", amount, newBalance);

  return { success: true, balance: newBalance };
}

depositForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const amountInput = document.getElementById("depositAmount");
  const amount = amountInput.value.trim();

  if (!isValidAmount(amount)) {
    showToast("Invalid Amount", "Please enter an amount greater than ₹0.", "error");
    return;
  }

  const user = getCurrentUser();
  if (!user) { logout(); return; }

  const result = depositMoney(user.accountNumber, amount);

  if (result.success) {
    showToast("Deposit Successful", `${formatCurrency(amount)} deposited. New Balance: ${formatCurrency(result.balance)}`, "success");
    depositForm.reset();
    renderDashboard();
  } else {
    showToast("Deposit Failed", result.message, "error");
  }
});

/* ==========================================================
   WITHDRAW MONEY
   ========================================================== */

function withdrawMoney(accountNumber, amount) {
  const accounts = getAccounts();
  const account = accounts.find(acc => acc.accountNumber === accountNumber);
  if (!account) return { success: false, message: "Account not found." };

  if (parseFloat(amount) > account.balance) {
    return { success: false, message: "Insufficient Balance!" };
  }

  const newBalance = account.balance - parseFloat(amount);
  updateBalance(accountNumber, newBalance);
  addTransaction(accountNumber, "Withdraw", amount, newBalance);

  return { success: true, balance: newBalance };
}

withdrawForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const amountInput = document.getElementById("withdrawAmount");
  const amount = amountInput.value.trim();

  if (!isValidAmount(amount)) {
    showToast("Invalid Amount", "Please enter an amount greater than ₹0.", "error");
    return;
  }

  const user = getCurrentUser();
  if (!user) { logout(); return; }

  const result = withdrawMoney(user.accountNumber, amount);

  if (result.success) {
    showToast("Withdrawal Successful", `${formatCurrency(amount)} withdrawn. Remaining Balance: ${formatCurrency(result.balance)}`, "success");
    withdrawForm.reset();
    renderDashboard();
  } else {
    showToast("Withdrawal Failed", result.message, "error");
  }
});

/* ==========================================================
   TRANSFER MONEY
   ========================================================== */

function transferMoney(senderAccNumber, receiverAccNumber, amount) {
  const accounts = getAccounts();
  const senderIdx = accounts.findIndex(acc => acc.accountNumber === senderAccNumber);
  const receiverIdx = accounts.findIndex(acc => acc.accountNumber === receiverAccNumber);

  if (senderIdx === -1) return { success: false, message: "Sender account not found." };
  if (receiverIdx === -1) return { success: false, message: "Receiver account not found." };
  if (senderAccNumber === receiverAccNumber) return { success: false, message: "You cannot transfer money to your own account." };
  if (parseFloat(amount) > accounts[senderIdx].balance) return { success: false, message: "Insufficient Balance!" };

  // Perform the transfer as one atomic operation
  accounts[senderIdx].balance -= parseFloat(amount);
  accounts[receiverIdx].balance += parseFloat(amount);
  saveAccounts(accounts);

  addTransaction(senderAccNumber, "Transfer Sent", amount, accounts[senderIdx].balance);
  addTransaction(receiverAccNumber, "Transfer Received", amount, accounts[receiverIdx].balance);

  return {
    success: true,
    senderBalance: accounts[senderIdx].balance,
    receiverName: accounts[receiverIdx].name
  };
}

transferForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const receiverAccNumber = document.getElementById("transferAccNumber").value.trim();
  const amount = document.getElementById("transferAmount").value.trim();

  if (!isValidAccountNumber(receiverAccNumber)) {
    showToast("Invalid Account", "Please enter a valid 10-digit receiver account number.", "error");
    return;
  }
  if (!isValidAmount(amount)) {
    showToast("Invalid Amount", "Please enter an amount greater than ₹0.", "error");
    return;
  }

  const user = getCurrentUser();
  if (!user) { logout(); return; }

  const senderAccNumber = user.accountNumber;
  const receiverNum = parseInt(receiverAccNumber, 10);

  if (senderAccNumber === receiverNum) {
    showToast("Transfer Failed", "You cannot transfer money to your own account.", "error");
    return;
  }

  const result = transferMoney(senderAccNumber, receiverNum, amount);

  if (result.success) {
    showToast(
      "Transfer Successful!",
      `Sent ${formatCurrency(amount)} to ${result.receiverName}. Remaining Balance: ${formatCurrency(result.senderBalance)}`,
      "success"
    );
    transferForm.reset();
    renderDashboard();
  } else {
    showToast("Transfer Failed", result.message, "error");
  }
});

/* ==========================================================
   CHANGE PIN
   ========================================================== */

function changePIN(accountNumber, currentPin, newPin) {
  const accounts = getAccounts();
  const idx = accounts.findIndex(acc => acc.accountNumber === accountNumber);
  if (idx === -1) return { success: false, message: "Account not found." };

  if (accounts[idx].pin !== parseInt(currentPin, 10)) {
    return { success: false, message: "Current PIN is incorrect." };
  }

  accounts[idx].pin = parseInt(newPin, 10);
  saveAccounts(accounts);
  return { success: true };
}

changePinForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const currentPin = document.getElementById("currentPin").value.trim();
  const newPin = document.getElementById("newPin").value.trim();
  const confirmNewPin = document.getElementById("confirmNewPin").value.trim();

  if (!isValidPin(newPin)) {
    showToast("Invalid PIN", "New PIN must be exactly 4 digits.", "error");
    return;
  }
  if (newPin !== confirmNewPin) {
    showToast("PIN Mismatch", "New PIN and Confirm PIN do not match.", "error");
    return;
  }

  const user = getCurrentUser();
  if (!user) { logout(); return; }

  const result = changePIN(user.accountNumber, currentPin, newPin);

  if (result.success) {
    showToast("PIN Changed", "PIN Changed Successfully!", "success");
    changePinForm.reset();
  } else {
    showToast("Change PIN Failed", result.message, "error");
  }
});

/* ==========================================================
   RENDER FUNCTIONS
   ========================================================== */

function renderDashboard() {
  const user = getCurrentUser();
  if (!user) return;

  document.getElementById("welcomeName").textContent = `Welcome back, ${user.name}!`;
  document.getElementById("dashBalance").textContent = formatCurrency(user.balance);
  document.getElementById("dashAccNumber").textContent = user.accountNumber;

  const transactions = getTransactions().filter(t => t.accountNumber === user.accountNumber);

  const totalDeposits = transactions
    .filter(t => t.transactionType === "Deposit" || t.transactionType === "Transfer Received")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawals = transactions
    .filter(t => t.transactionType === "Withdraw" || t.transactionType === "Transfer Sent")
    .reduce((sum, t) => sum + t.amount, 0);

  document.getElementById("statDeposits").textContent = formatCurrency(totalDeposits);
  document.getElementById("statWithdrawals").textContent = formatCurrency(totalWithdrawals);
  document.getElementById("statTxnCount").textContent = transactions.length;

  const recent = [...transactions].sort((a, b) => b.transactionId - a.transactionId).slice(0, 5);
  renderTransactionTable(recent, "recentTxnTableWrap");
}

function renderBalanceSection() {
  const user = getCurrentUser();
  if (!user) return;

  document.getElementById("balName").textContent = user.name;
  document.getElementById("balAccNumber").textContent = user.accountNumber;
  document.getElementById("balAmount").textContent = formatCurrency(user.balance);
}

function renderAccountDetails() {
  const user = getCurrentUser();
  if (!user) return;

  document.getElementById("profileAvatar").textContent = user.name.charAt(0).toUpperCase();
  document.getElementById("accName").textContent = user.name;
  document.getElementById("accNumber").textContent = user.accountNumber;
  document.getElementById("accBalance").textContent = formatCurrency(user.balance);
  document.getElementById("accCreated").textContent = user.createdAt ? formatDate(user.createdAt) : "N/A";
}

function showTransactionHistory() {
  renderTransactionHistory();
}

function renderTransactionHistory() {
  const user = getCurrentUser();
  if (!user) return;

  const transactions = getTransactions()
    .filter(t => t.accountNumber === user.accountNumber)
    .sort((a, b) => b.transactionId - a.transactionId);

  renderTransactionTable(transactions, "historyTableWrap");
}

// Shared function to render a transaction table into a container
function renderTransactionTable(transactions, containerId) {
  const container = document.getElementById(containerId);

  if (!transactions || transactions.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🧾</div>
        <p>No transactions found yet.</p>
      </div>
    `;
    return;
  }

  const badgeClassMap = {
    "Deposit": "badge-deposit",
    "Withdraw": "badge-withdraw",
    "Transfer Sent": "badge-sent",
    "Transfer Received": "badge-received"
  };

  let rows = transactions.map(t => `
    <tr>
      <td>#${t.transactionId}</td>
      <td><span class="badge ${badgeClassMap[t.transactionType] || ""}">${t.transactionType}</span></td>
      <td>${formatCurrency(t.amount)}</td>
      <td>${formatCurrency(t.balanceAfter)}</td>
      <td>${formatDate(t.transactionDate)}</td>
    </tr>
  `).join("");

  container.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Transaction ID</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Balance After</th>
          <th>Date &amp; Time</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

/* ==========================================================
   NAVIGATION EVENT LISTENERS
   ========================================================== */

document.querySelectorAll(".nav-item, .quick-btn, .link-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const sectionId = btn.dataset.section;
    if (sectionId) showSection(sectionId);
  });
});

/* ==========================================================
   MOBILE SIDEBAR TOGGLE
   ========================================================== */

const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const menuToggleBtn = document.getElementById("menuToggleBtn");

function openSidebar() {
  sidebar.classList.add("open");
  sidebarOverlay.classList.remove("hidden");
}
function closeSidebar() {
  sidebar.classList.remove("open");
  sidebarOverlay.classList.add("hidden");
}

menuToggleBtn.addEventListener("click", openSidebar);
sidebarOverlay.addEventListener("click", closeSidebar);

/* ==========================================================
   INPUT SANITIZATION (numbers only for numeric fields)
   ========================================================== */

document.querySelectorAll('input[inputmode="numeric"]').forEach(input => {
  input.addEventListener("input", () => {
    input.value = input.value.replace(/\D/g, "");
  });
});

/* ==========================================================
   APP INITIALIZATION
   ========================================================== */

function initApp() {
  const user = getCurrentUser();
  if (user) {
    openDashboard();
  } else {
    showPage(authPage);
  }
}

initApp();
