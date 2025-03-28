const API_URL = "http://localhost:3000/transactions";

// DOM Elements
const menuItems = document.querySelectorAll('.side-menu li');
const pages = document.querySelectorAll('.page');
const transactionForm = document.getElementById('transaction-form');
const balanceElement = document.getElementById('balance');
const transactionsList = document.getElementById('transactions-list');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

// Initialize App
document.addEventListener('DOMContentLoaded', init);

function init() {
  setupMenuNavigation();
  setupFormSubmission();
  setupSearch();
  loadTransactions();
}

function setupMenuNavigation() {
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      menuItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      const pageId = item.getAttribute('data-page');
      pages.forEach(page => {
        page.classList.remove('active');
        if (page.id === pageId) page.classList.add('active');
      });
    });
  });
}

function setupFormSubmission() {
  transactionForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const transaction = {
      date: new Date().toLocaleDateString('en-KE'),
      type: document.getElementById('type').value,
      amount: parseFloat(document.getElementById('amount').value),
      description: document.getElementById('description').value
    };

    addTransaction(transaction);
  });
}

function setupSearch() {
  searchBtn.addEventListener('click', searchTransactions);
  searchInput.addEventListener('keyup', function(e) {
    if (e.key === 'Enter') searchTransactions();
  });
}

// Search transactions
function searchTransactions() {
  const searchTerm = searchInput.value.toLowerCase();
  
  fetch(API_URL)
    .then(response => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then(transactions => {
      if (!searchTerm) {
        renderTransactions(transactions);
        return;
      }
      
      const filtered = transactions.filter(transaction => 
        transaction.description.toLowerCase().includes(searchTerm) ||
        transaction.amount.toString().includes(searchTerm) ||
        transaction.type.toLowerCase().includes(searchTerm) ||
        transaction.date.toLowerCase().includes(searchTerm)
      );
      
      renderTransactions(filtered);
    })
    .catch(error => {
      console.error("Error searching transactions:", error);
      transactionsList.innerHTML = '<p>Error searching transactions. Please try again.</p>';
    });
}

// Load transactions from server
function loadTransactions() {
  fetch(API_URL)
    .then(response => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then(transactions => {
      updateBalance(transactions);
      renderTransactions(transactions);
    })
    .catch(error => {
      console.error("Error loading transactions:", error);
      transactionsList.innerHTML = '<p>Error loading transactions. Please try again.</p>';
    });
}

// Add new transaction
function addTransaction(transaction) {
  fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transaction)
  })
    .then(response => {
      if (!response.ok) throw new Error("Failed to add transaction");
      return response.json();
    })
    .then(() => {
      loadTransactions(); // Refresh the list
      transactionForm.reset();
    })
    .catch(error => {
      console.error("Error adding transaction:", error);
      alert("Failed to add transaction. Please check console for details.");
    });
}

// Delete transaction
function deleteTransaction(id) {
  fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  })
    .then(response => {
      if (!response.ok) throw new Error("Failed to delete transaction");
      loadTransactions(); // Refresh the list
    })
    .catch(error => {
      console.error("Error deleting transaction:", error);
      alert("Failed to delete transaction. Please check console for details.");
    });
}

// Update balance display
function updateBalance(transactions) {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;
  balanceElement.textContent = `Ksh. ${balance.toFixed(2)}`;
  balanceElement.style.color = balance >= 0 ? '#27ae60' : '#e74c3c';
}

// Render transactions list
function renderTransactions(transactions) {
  if (transactions.length === 0) {
    transactionsList.innerHTML = '<p>No transactions found.</p>';
    return;
  }

  transactionsList.innerHTML = transactions.map(transaction => `
    <div class="transaction">
      <div>
        <span class="${transaction.type}">
          ${transaction.type === 'income' ? '+' : '-'}Ksh. ${transaction.amount.toFixed(2)}
        </span>
        <p>${transaction.description}</p>
        <small>${transaction.date}</small>
      </div>
      <button class="delete-btn" data-id="${transaction.id}">X</button>
    </div>
  `).join('');

  // Add event listeners to delete buttons
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm("Are you sure you want to delete this transaction?")) {
        deleteTransaction(btn.dataset.id);
      }
    });
  });
}