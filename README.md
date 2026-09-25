# 🏦 MyBank – Banking Management System

A modern, responsive **Banking Management System** built using **HTML, CSS, and Pure JavaScript**. The application provides a complete frontend banking experience with account creation, login, balance management, deposits, withdrawals, money transfers, transaction history, account details, and PIN management.

The application uses **LocalStorage** and **SessionStorage** to store and manage account and transaction data directly in the browser.

---

## 📌 Features

### 🔐 Authentication

* Create a new bank account
* Automatically generate a unique 10-digit account number
* 4-digit PIN-based login
* PIN confirmation during registration
* Logout functionality
* Persistent login using browser storage

### 💰 Account Management

* View current account balance
* View account holder name
* View account number
* View account creation date
* View complete account details

### 💵 Banking Operations

* Deposit money
* Withdraw money
* Transfer money to another account
* Automatic balance updates
* Validation for invalid transaction amounts
* Insufficient balance validation
* Prevention of transferring money to the same account

### 📊 Dashboard

* Current balance
* Total deposits
* Total withdrawals
* Total number of transactions
* Quick action buttons
* Recent transaction overview

### 🧾 Transaction Management

* Automatically generate transaction IDs
* Record deposits
* Record withdrawals
* Record sent transfers
* Record received transfers
* Display transaction amount
* Display balance after each transaction
* Display transaction date and time
* Complete transaction history

### 🔑 PIN Management

* Change existing PIN
* Verify current PIN
* Validate new 4-digit PIN
* Confirm new PIN before updating

### 📱 Responsive Design

* Responsive dashboard layout
* Mobile-friendly navigation
* Collapsible sidebar on smaller screens
* Responsive transaction tables
* Modern card-based interface

---

## 🛠️ Technologies Used

| Technology         | Purpose                                            |
| ------------------ | -------------------------------------------------- |
| **HTML5**          | Application structure and UI elements              |
| **CSS3**           | Styling, responsive design, layouts and animations |
| **JavaScript**     | Application logic and banking operations           |
| **LocalStorage**   | Persistent account and transaction data            |
| **SessionStorage** | Current user session management                    |
| **Google Fonts**   | Plus Jakarta Sans and Sora typography              |

---

## 📂 Project Structure

```text
MyBank/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

### `index.html`

Contains the complete application interface, including:

* Login page
* Registration page
* Account creation success page
* Dashboard
* Balance section
* Deposit section
* Withdrawal section
* Transfer section
* Transaction history
* Account details
* Change PIN section

### `style.css`

Contains the complete styling for the application, including:

* Dark banking interface
* Glassmorphism components
* Cards and buttons
* Dashboard layout
* Sidebar navigation
* Transaction tables
* Responsive layouts
* Mobile navigation
* Form styling

### `script.js`

Contains the main application logic, including:

* Account creation
* Login/logout
* Account number generation
* Balance management
* Deposits
* Withdrawals
* Transfers
* Transaction management
* PIN changes
* LocalStorage management
* Session management
* Dashboard rendering
* Transaction history rendering
* Input validation

---

## 🚀 Getting Started

Since this is a frontend application, no backend server or database is required.

### 1. Clone the Repository

```bash
https://github.com/yatharth-kaushik/Banking-System-Web-App
```

### 2. Open the Project

Navigate into the project directory:

```bash
cd Banking-System-Web-App
```

### 3. Run the Application

Simply open:

```text
index.html
```

in your web browser.

You can also use **VS Code Live Server** for a better development experience.

---

## 🔑 How to Use

### 1. Create an Account

From the login screen:

1. Click **Create New Account**
2. Enter your account holder name
3. Create a 4-digit PIN
4. Confirm the PIN
5. Click **Create Account**
6. A unique 10-digit account number is generated

The newly created account starts with a balance of:

```text
₹0.00
```

---

### 2. Login

Enter:

* 10-digit account number
* 4-digit PIN

Then click **Login**.

After successful authentication, the banking dashboard will be displayed.

---

### 3. Check Balance

The **Check Balance** section displays:

* Account holder name
* Account number
* Current balance

---

### 4. Deposit Money

Navigate to **Deposit Money**.

Enter the amount and click **Deposit**.

The application:

1. Validates the amount
2. Updates the account balance
3. Creates a transaction record
4. Updates the dashboard
5. Displays the updated balance

---

### 5. Withdraw Money

Navigate to **Withdraw Money**.

Enter the required amount and click **Withdraw**.

The application checks whether sufficient balance is available before completing the transaction.

If the balance is insufficient, the withdrawal is rejected.

---

### 6. Transfer Money

Navigate to **Transfer Money**.

Enter:

* Receiver's account number
* Transfer amount

The application validates the transfer and updates both accounts.

A transfer generates transaction records for:

* **Transfer Sent**
* **Transfer Received**

---

### 7. View Transaction History

The **Transaction History** section displays all transactions associated with the logged-in account.

Each transaction contains:

* Transaction ID
* Transaction type
* Amount
* Balance after transaction
* Date and time

Supported transaction types include:

```text
Deposit
Withdraw
Transfer Sent
Transfer Received
```

---

### 8. Change PIN

Navigate to **Change PIN**.

Enter:

* Current PIN
* New 4-digit PIN
* Confirm new PIN

The current PIN must be correct and the new PIN must match its confirmation.

---

### 9. Logout

Click **Logout** from the sidebar to end the current session.

---

## 💾 Data Storage

This project does not use a backend database.

Data is stored in the browser using:

### LocalStorage

The application uses LocalStorage for:

```text
mybank_accounts
mybank_transactions
mybank_currentUser
mybank_txn_counter
```

This allows account and transaction data to remain available after refreshing the page.

### SessionStorage

SessionStorage is also used for the current logged-in account.

---

## 🔄 Application Flow

```text
                 ┌─────────────────┐
                 │   MyBank App     │
                 └────────┬────────┘
                          │
                 ┌────────▼────────┐
                 │   Login Page    │
                 └────────┬────────┘
                          │
              ┌───────────┴───────────┐
              │                       │
       Create Account               Login
              │                       │
              ▼                       ▼
      Generate Account         Verify Credentials
              │                       │
              └───────────┬───────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │    Dashboard    │
                 └────────┬────────┘
                          │
        ┌─────────────────┼──────────────────┐
        │                 │                  │
        ▼                 ▼                  ▼
    Deposit           Withdraw           Transfer
        │                 │                  │
        └─────────────────┼──────────────────┘
                          │
                          ▼
                Update Account Balance
                          │
                          ▼
                  Create Transaction
                          │
                          ▼
                 Update Transaction
                      History
```

---

## 🧮 Transaction System

Every successful banking operation creates a transaction record.

A transaction contains information such as:

```text
Transaction ID
Account Number
Transaction Type
Amount
Balance After
Transaction Date
```

Transaction IDs are generated sequentially using a transaction counter stored in LocalStorage.

---

## 🎨 UI & Design

The application uses a modern dark-themed banking interface.

### Design Features

* Dark navy color palette
* Teal/blue accent colors
* Glass-style authentication cards
* Rounded cards and buttons
* Dashboard statistics
* Sidebar navigation
* Transaction badges
* Responsive layouts
* Mobile sidebar navigation
* Hover effects and transitions

The interface is designed to provide a clean and modern banking dashboard experience.

---

## 📱 Responsive Design

The application supports different screen sizes using responsive CSS.

The layout adapts for:

* Desktop
* Laptop
* Tablet
* Mobile devices

On smaller screens, the sidebar can be opened using the mobile menu button.

---

## ⚠️ Important Note

This project is a **frontend/demo banking application**.

It stores account information, PINs, and transaction data in the browser using LocalStorage/SessionStorage. It does **not** use a secure backend, encrypted database, server-side authentication, or real banking infrastructure.

Therefore, it should **not be used for handling real financial information or real money**.

---

## 🔒 Security Considerations

The project demonstrates basic frontend validation and authentication logic, including:

* 10-digit account number validation
* 4-digit PIN validation
* PIN confirmation
* Current PIN verification
* Insufficient balance checking
* Self-transfer prevention
* Numeric input sanitization

However, because authentication and data storage are implemented entirely on the client side, this project should be considered a **learning/demo project rather than a production banking system**.

---

## 🌱 Future Improvements

Possible future improvements include:

* Backend integration
* Secure database storage
* Password/PIN hashing
* Server-side authentication
* JWT/session-based authentication
* OTP verification
* Email/SMS notifications
* Admin dashboard
* Account deletion
* Transaction filtering and searching
* Transaction export as PDF/CSV
* Bank statement generation
* Improved security and encryption
* API-based banking services
* Multi-user backend support

---

## 📸 Application Sections

The application contains the following major sections:

```text
Login
│
├── Create New Account
│
└── Dashboard
    │
    ├── Check Balance
    ├── Deposit Money
    ├── Withdraw Money
    ├── Transfer Money
    ├── Transaction History
    ├── Account Details
    ├── Change PIN
    └── Logout
```

---

## 🎯 Project Purpose

The purpose of this project is to demonstrate how a banking management interface can be developed using **HTML, CSS, and JavaScript** without relying on a backend server.

It demonstrates practical concepts such as:

* DOM manipulation
* Event handling
* Form validation
* LocalStorage
* SessionStorage
* JavaScript functions
* Array operations
* Object-based data management
* Dynamic HTML rendering
* Responsive web design
* Client-side application state management

---

## 👨‍💻 Author

**Yatharth Kaushik**

---

## 📄 License

This project is created for **educational and learning purposes**.

You are free to study, modify, and improve the project for your own learning and development.
