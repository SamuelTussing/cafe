// DOM Elements
const ordersContainer = document.getElementById('ordersContainer');
const emptyState = document.getElementById('emptyState');
const orderCount = document.getElementById('orderCount');
const validateModal = document.getElementById('validateModal');
const validateOrderNumber = document.getElementById('validateOrderNumber');
const validateOrderItems = document.getElementById('validateOrderItems');
const cancelValidateBtn = document.getElementById('cancelValidateBtn');
const confirmValidateBtn = document.getElementById('confirmValidateBtn');
const refreshBtn = document.getElementById('refreshBtn');
const refreshTimer = document.getElementById('refreshTimer');

// State
let pendingOrders = [];
let selectedOrderId = null;
let countdown = 30;
let countdownInterval = null;

// Load orders from localStorage
function loadOrders() {
  const stored = localStorage.getItem('pendingOrders');
  if (stored) {
    pendingOrders = JSON.parse(stored);
  }
  renderOrders();
}

// Save orders to localStorage
function saveOrders() {
  localStorage.setItem('pendingOrders', JSON.stringify(pendingOrders));
}

// Format time
function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

// Render all orders
function renderOrders() {
  // Clear existing cards (keep empty state)
  const existingCards = ordersContainer.querySelectorAll('.order-card');
  existingCards.forEach(card => card.remove());

  // Update count
  const count = pendingOrders.length;
  orderCount.textContent = `${count} commande${count > 1 ? 's' : ''}`;

  // Show/hide empty state
  if (count === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
  }

  // Render each order
  pendingOrders.forEach(order => {
    const card = createOrderCard(order);
    ordersContainer.appendChild(card);
  });
}

// Create an order card
function createOrderCard(order) {
  const card = document.createElement('div');
  card.className = 'order-card';
  card.dataset.orderId = order.id;

  // Count total items
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  // Build items HTML
  const itemsHtml = order.items.map(item => {
    let details = [];
    if (item.size) details.push(item.size);
    if (item.milk && item.milk !== 'regular') details.push(item.milk);
    if (item.extras && item.extras.length > 0) details.push(item.extras.join(', '));
    
    return `
      <div class="order-item">
        <div class="item-info">
          <div class="item-name">${item.name}</div>
          ${details.length > 0 ? `<div class="item-details">${details.join(' - ')}</div>` : ''}
        </div>
        <span class="item-quantity">x${item.quantity}</span>
      </div>
    `;
  }).join('');

  card.innerHTML = `
    <div class="order-header">
      <span class="order-number">N°${order.id}</span>
      <span class="order-time">${formatTime(order.timestamp)}</span>
    </div>
    <div class="order-items">
      ${itemsHtml}
    </div>
    <div class="order-footer">
      <span class="item-count">${totalItems} article${totalItems > 1 ? 's' : ''}</span>
      <span class="tap-hint">Appuyer pour valider</span>
    </div>
  `;

  card.addEventListener('click', () => openValidateModal(order));

  return card;
}

// Open validation modal
function openValidateModal(order) {
  selectedOrderId = order.id;
  validateOrderNumber.textContent = `Commande n°${order.id}`;

  // Build items list
  const itemsHtml = order.items.map(item => {
    let details = [];
    if (item.size) details.push(item.size);
    if (item.milk && item.milk !== 'regular') details.push(item.milk);
    if (item.extras && item.extras.length > 0) details.push(item.extras.join(', '));

    return `
      <div class="modal-item">
        <div>
          <div class="modal-item-name">${item.name}</div>
          ${details.length > 0 ? `<div class="modal-item-details">${details.join(' - ')}</div>` : ''}
        </div>
        <span class="modal-item-qty">x${item.quantity}</span>
      </div>
    `;
  }).join('');

  validateOrderItems.innerHTML = itemsHtml;
  validateModal.classList.add('active');
}

// Close validation modal
function closeValidateModal() {
  validateModal.classList.remove('active');
  selectedOrderId = null;
}

// Confirm order validation
function confirmValidation() {
  if (selectedOrderId === null) return;

  // Find the card and animate removal
  const card = ordersContainer.querySelector(`[data-order-id="${selectedOrderId}"]`);
  if (card) {
    card.classList.add('removing');
  }

  // Remove from pending orders
  pendingOrders = pendingOrders.filter(o => o.id !== selectedOrderId);
  saveOrders();

  closeValidateModal();

  // Wait for animation then re-render
  setTimeout(() => {
    renderOrders();
  }, 300);
}

// Listen for storage changes (when POS adds new orders)
function handleStorageChange(event) {
  if (event.key === 'pendingOrders') {
    loadOrders();
  }
}

// Reset countdown and refresh
function manualRefresh() {
  // Add spin animation to button
  refreshBtn.classList.add('spinning');
  setTimeout(() => refreshBtn.classList.remove('spinning'), 500);
  
  loadOrders();
  resetCountdown();
}

// Reset the countdown timer
function resetCountdown() {
  countdown = 30;
  updateTimerDisplay();
}

// Update the timer display
function updateTimerDisplay() {
  refreshTimer.textContent = `${countdown}s`;
}

// Start the countdown interval
function startCountdown() {
  countdownInterval = setInterval(() => {
    countdown--;
    updateTimerDisplay();
    
    if (countdown <= 0) {
      loadOrders();
      resetCountdown();
    }
  }, 1000);
}

// Initialize
function init() {
  loadOrders();

  // Event listeners
  cancelValidateBtn.addEventListener('click', closeValidateModal);
  confirmValidateBtn.addEventListener('click', confirmValidation);
  refreshBtn.addEventListener('click', manualRefresh);

  validateModal.addEventListener('click', (e) => {
    if (e.target === validateModal) {
      closeValidateModal();
    }
  });

  // Listen for changes from other tabs/windows
  window.addEventListener('storage', handleStorageChange);

  // Start the 30 second countdown timer
  startCountdown();
}

// Start
init();
