// Products Data
const products = {
  cafe: [
    { id: 'espresso', name: 'Espresso', price: 2.50, hasOptions: true },
    { id: 'long-black', name: 'Long Black', price: 3.00, hasOptions: true },
    { id: 'cappuccino', name: 'Cappuccino', price: 4.00, hasOptions: true },
    { id: 'latte', name: 'Latte', price: 4.00, hasOptions: true },
    { id: 'flat-white', name: 'Flat White', price: 4.00, hasOptions: true },
    { id: 'mocha', name: 'Mocha', price: 4.50, hasOptions: true },
    { id: 'macchiato', name: 'Macchiato', price: 3.50, hasOptions: true },
    { id: 'americano', name: 'Americano', price: 3.00, hasOptions: true },
  ],
  breakfast: [
    { id: 'croissant', name: 'Croissant', price: 2.50, hasOptions: false },
    { id: 'pain-chocolat', name: 'Pain au chocolat', price: 2.80, hasOptions: false },
    { id: 'muffin', name: 'Muffin', price: 3.00, hasOptions: false },
    { id: 'toast-avocat', name: 'Toast Avocat', price: 8.50, hasOptions: false },
    { id: 'eggs-benedict', name: 'Eggs Benedict', price: 12.00, hasOptions: false },
    { id: 'pancakes', name: 'Pancakes', price: 9.00, hasOptions: false },
    { id: 'granola', name: 'Granola Bowl', price: 7.50, hasOptions: false },
    { id: 'omelette', name: 'Omelette', price: 10.00, hasOptions: false },
  ],
  lunch: [
    { id: 'club-sandwich', name: 'Club Sandwich', price: 11.00, hasOptions: false },
    { id: 'caesar-salad', name: 'Salade César', price: 10.50, hasOptions: false },
    { id: 'burger', name: 'Burger', price: 13.00, hasOptions: false },
    { id: 'quiche', name: 'Quiche du jour', price: 9.50, hasOptions: false },
    { id: 'poke-bowl', name: 'Poké Bowl', price: 14.00, hasOptions: false },
    { id: 'wrap', name: 'Wrap Poulet', price: 9.00, hasOptions: false },
    { id: 'soup', name: 'Soupe du jour', price: 6.50, hasOptions: false },
    { id: 'croque', name: 'Croque Monsieur', price: 8.50, hasOptions: false },
  ],
  soft: [
    { id: 'eau', name: 'Eau minérale', price: 2.00, hasOptions: false },
    { id: 'eau-gazeuse', name: 'Eau gazeuse', price: 2.50, hasOptions: false },
    { id: 'coca', name: 'Coca-Cola', price: 3.00, hasOptions: false },
    { id: 'orangina', name: 'Orangina', price: 3.00, hasOptions: false },
    { id: 'jus-orange', name: 'Jus d\'orange', price: 4.00, hasOptions: false },
    { id: 'jus-pomme', name: 'Jus de pomme', price: 3.50, hasOptions: false },
    { id: 'limonade', name: 'Limonade maison', price: 4.50, hasOptions: false },
    { id: 'the-glace', name: 'Thé glacé', price: 4.00, hasOptions: false },
  ]
};

// State
let orders = [{ id: 1, items: [] }];
let activeOrderId = 1;
let nextOrderNumber = 2; // Track the next order number globally
let currentCategory = 'cafe';
let selectedProduct = null;
let selectedOptions = {
  size: { name: 'medium', price: 0.50 },
  milk: { name: 'regular', price: 0 },
  extras: []
};
let selectedPaymentMethod = null;

// DOM Elements
const orderTabs = document.getElementById('orderTabs');
const addTabBtn = document.getElementById('addTabBtn');
const categoryBtns = document.querySelectorAll('.category-btn');
const productGrid = document.getElementById('productGrid');
const categoryTitle = document.getElementById('categoryTitle');
const orderItemsList = document.getElementById('orderItemsList');
const clearOrderBtn = document.getElementById('clearOrderBtn');
const subtotalEl = document.getElementById('subtotal');
const taxEl = document.getElementById('tax');
const totalAmountEl = document.getElementById('totalAmount');
const payBtn = document.getElementById('payBtn');

// Modals
const customModal = document.getElementById('customModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalProductName = document.getElementById('modalProductName');
const modalTotalPrice = document.getElementById('modalTotalPrice');
const addToOrderBtn = document.getElementById('addToOrderBtn');
const sizeOptions = document.getElementById('sizeOptions');
const milkOptions = document.getElementById('milkOptions');
const extrasOptions = document.getElementById('extrasOptions');

const paymentModal = document.getElementById('paymentModal');
const closePaymentBtn = document.getElementById('closePaymentBtn');
const paymentTotalAmount = document.getElementById('paymentTotalAmount');
const paymentBtns = document.querySelectorAll('.payment-btn');
const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');

const successModal = document.getElementById('successModal');
const successMessage = document.getElementById('successMessage');
const newOrderBtn = document.getElementById('newOrderBtn');

// Initialize
function init() {
  renderTabs();
  renderProducts();
  setupEventListeners();
  setupMobileTotal();
}

// Render Functions
function renderTabs() {
  orderTabs.innerHTML = orders.map(order => `
    <div class="tab ${order.id === activeOrderId ? 'active' : ''}" data-id="${order.id}">
      <span>Commande ${order.id}</span>
      ${orders.length > 1 ? `
        <button class="tab-close" data-id="${order.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      ` : ''}
    </div>
  `).join('');
  
  // Tab click events
  orderTabs.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      if (!e.target.closest('.tab-close')) {
        activeOrderId = parseInt(tab.dataset.id);
        renderTabs();
        renderOrderItems();
        updateTotals();
      }
    });
  });
  
  // Tab close events
  orderTabs.querySelectorAll('.tab-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      orders = orders.filter(o => o.id !== id);
      if (activeOrderId === id) {
        activeOrderId = orders[0].id;
      }
      renderTabs();
      renderOrderItems();
      updateTotals();
    });
  });
}

function renderProducts() {
  const categoryProducts = products[currentCategory];
  const categoryNames = {
    cafe: 'Café',
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    soft: 'Soft'
  };
  
  categoryTitle.textContent = categoryNames[currentCategory];
  
  productGrid.innerHTML = categoryProducts.map(product => `
    <button class="product-btn" data-id="${product.id}">
      <span class="product-name">${product.name}</span>
      <span class="product-price">${product.price.toFixed(2)} €</span>
    </button>
  `).join('');
  
  // Product click events
  productGrid.querySelectorAll('.product-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const productId = btn.dataset.id;
      const product = categoryProducts.find(p => p.id === productId);
      
      if (product.hasOptions) {
        openCustomModal(product, currentCategory);
      } else {
        addItemToOrder({
          ...product,
          category: currentCategory,
          quantity: 1,
          totalPrice: product.price
        });
      }
    });
  });
}

function renderOrderItems() {
  const order = orders.find(o => o.id === activeOrderId);
  
  if (!order || order.items.length === 0) {
    orderItemsList.innerHTML = `
      <div class="empty-order">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="8" cy="21" r="1"/>
          <circle cx="19" cy="21" r="1"/>
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
        </svg>
        <p>Aucun article</p>
      </div>
    `;
    return;
  }
  
  orderItemsList.innerHTML = order.items.map((item, index) => `
    <div class="order-item" data-index="${index}">
      <div class="order-item-info">
        <div class="order-item-name">${item.name}</div>
        ${item.options ? `
          <div class="order-item-details">
            ${item.options.size ? item.options.size.name : ''}
            ${item.options.milk && item.options.milk.name !== 'regular' ? ` • ${getMilkLabel(item.options.milk.name)}` : ''}
            ${item.options.extras && item.options.extras.length > 0 ? ` • ${item.options.extras.map(e => getExtraLabel(e.name)).join(', ')}` : ''}
          </div>
        ` : ''}
      </div>
      <div class="order-item-qty">
        <button class="qty-btn" data-action="decrease" data-index="${index}">-</button>
        <span class="qty-value">${item.quantity}</span>
        <button class="qty-btn" data-action="increase" data-index="${index}">+</button>
      </div>
      <div class="order-item-price">${(item.totalPrice * item.quantity).toFixed(2)} €</div>
      <button class="order-item-remove" data-index="${index}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 6h18"/>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
        </svg>
      </button>
    </div>
  `).join('');
  
  // Quantity button events
  orderItemsList.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.index);
      const action = btn.dataset.action;
      const order = orders.find(o => o.id === activeOrderId);
      
      if (action === 'increase') {
        order.items[index].quantity++;
      } else if (action === 'decrease') {
        if (order.items[index].quantity > 1) {
          order.items[index].quantity--;
        } else {
          order.items.splice(index, 1);
        }
      }
      
      renderOrderItems();
      updateTotals();
    });
  });
  
  // Remove button events
  orderItemsList.querySelectorAll('.order-item-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.index);
      const order = orders.find(o => o.id === activeOrderId);
      order.items.splice(index, 1);
      renderOrderItems();
      updateTotals();
    });
  });
}

function getMilkLabel(milk) {
  const labels = {
    regular: 'Normal Milk',
    skimmed: 'Skimmed Milk',
    oat: 'Oat Milk',
    almond: 'Almond Milk',
    soy: 'Soy Milk '
  };
  return labels[milk] || milk;
}

function getExtraLabel(extra) {
  const labels = {
    extraShot: 'Extra Shot',
    vanilla: 'Vanilla',
    caramel: 'Caramel',
    hazelnut: 'Hazelnut',
    chocolate: 'Chocolat',
    whippedCream: 'Whipped Cream'
  };
  return labels[extra] || extra;
}

function updateTotals() {
  const order = orders.find(o => o.id === activeOrderId);
  let subtotal = 0;
  
  if (order && order.items.length > 0) {
    subtotal = order.items.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0);
  }
  
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  
  subtotalEl.textContent = subtotal.toFixed(2) + ' €';
  taxEl.textContent = tax.toFixed(2) + ' €';
  totalAmountEl.textContent = total.toFixed(2) + ' €';
  payBtn.disabled = subtotal === 0;
  
  // Update mobile total
  const mobileTotal = document.querySelector('.order-total-mobile');
  if (mobileTotal) {
    mobileTotal.querySelector('.total-amount').textContent = total.toFixed(2) + ' €';
    mobileTotal.querySelector('.btn-pay').disabled = subtotal === 0;
  }
}

// Modal Functions
let selectedProductCategory = null;

function openCustomModal(product, category) {
  selectedProduct = product;
  selectedProductCategory = category;
  selectedOptions = {
    size: { name: 'medium', price: 0.50 },
    milk: { name: 'regular', price: 0 },
    extras: []
  };
  
  modalProductName.textContent = product.name;
  updateModalPrice();
  
  // Reset selections
  sizeOptions.querySelectorAll('.option-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.size === 'medium');
  });
  milkOptions.querySelectorAll('.option-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.milk === 'regular');
  });
  extrasOptions.querySelectorAll('.option-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  customModal.classList.add('active');
}

function closeCustomModal() {
  customModal.classList.remove('active');
  selectedProduct = null;
}

function updateModalPrice() {
  if (!selectedProduct) return;
  
  let total = selectedProduct.price;
  total += selectedOptions.size.price;
  total += selectedOptions.milk.price;
  total += selectedOptions.extras.reduce((sum, e) => sum + e.price, 0);
  
  modalTotalPrice.textContent = total.toFixed(2) + ' €';
}

function addItemToOrder(item) {
  const order = orders.find(o => o.id === activeOrderId);
  
  // Check if similar item exists (without options)
  if (!item.options) {
    const existingIndex = order.items.findIndex(i => 
      i.id === item.id && !i.options
    );
    
    if (existingIndex !== -1) {
      order.items[existingIndex].quantity++;
    } else {
      order.items.push(item);
    }
  } else {
    order.items.push(item);
  }
  
  renderOrderItems();
  updateTotals();
}

// Payment Functions
function openPaymentModal() {
  const order = orders.find(o => o.id === activeOrderId);
  let subtotal = order.items.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0);
  const total = subtotal * 1.1;
  
  paymentTotalAmount.textContent = total.toFixed(2) + ' €';
  selectedPaymentMethod = null;
  
  paymentBtns.forEach(btn => btn.classList.remove('active'));
  confirmPaymentBtn.disabled = true;
  
  paymentModal.classList.add('active');
}

function closePaymentModal() {
  paymentModal.classList.remove('active');
}

function confirmPayment() {
  closePaymentModal();
  
  const order = orders.find(o => o.id === activeOrderId);
  let subtotal = order.items.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0);
  const total = subtotal * 1.1;
  
  const methodLabels = {
    cash: 'Cash',
    card: 'Card',
    contactless: 'Contactless',
    mobile: 'Mobile'
  };
  
  // Send order to barista queue
  sendOrderToBarista(order);
  
  successMessage.textContent = `${total.toFixed(2)} € - ${methodLabels[selectedPaymentMethod]}`;
  document.getElementById('successOrderNumber').textContent = `Commande n°${order.id}`;
  successModal.classList.add('active');
}

// Send order to barista display via localStorage
function sendOrderToBarista(order) {
  // Get existing pending orders
  let pendingOrders = [];
  const stored = localStorage.getItem('pendingOrders');
  if (stored) {
    pendingOrders = JSON.parse(stored);
  }
  
  // Format order for barista display
  const baristaOrder = {
    id: order.id,
    timestamp: Date.now(),
    items: order.items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      size: item.options?.size?.name || null,
      milk: item.options?.milk?.name || null,
      extras: item.options?.extras?.map(e => e.name) || []
    }))
  };
  
  // Add to pending orders
  pendingOrders.push(baristaOrder);
  localStorage.setItem('pendingOrders', JSON.stringify(pendingOrders));
  
  // Save to sales history for dashboard
  saveSaleToHistory(order);
}

// Save sale to history for dashboard statistics
function saveSaleToHistory(order) {
  let salesHistory = [];
  const stored = localStorage.getItem('salesHistory');
  if (stored) {
    salesHistory = JSON.parse(stored);
  }
  
  // Calculate total with tax
  const subtotal = order.items.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0);
  const total = subtotal * 1.1;
  
  const saleRecord = {
    orderId: order.id,
    timestamp: Date.now(),
    total: total,
    items: order.items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
      category: item.category || 'unknown'
    }))
  };
  
  salesHistory.push(saleRecord);
  localStorage.setItem('salesHistory', JSON.stringify(salesHistory));
}

function startNewOrder() {
  successModal.classList.remove('active');
  
  // Remove the paid order from orders list
  orders = orders.filter(o => o.id !== activeOrderId);
  
  // Create a new order with the next order number
  const newOrder = { id: nextOrderNumber, items: [] };
  orders.push(newOrder);
  activeOrderId = nextOrderNumber;
  nextOrderNumber++;
  
  renderTabs();
  renderOrderItems();
  updateTotals();
}

// Mobile Total Bar
function setupMobileTotal() {
  const checkMobile = () => {
    const isMobile = window.innerWidth <= 900;
    let mobileTotal = document.querySelector('.order-total-mobile');
    
    if (isMobile && !mobileTotal) {
      mobileTotal = document.createElement('div');
      mobileTotal.className = 'order-total-mobile';
      mobileTotal.innerHTML = `
        <div class="total-amount">0.00 €</div>
        <button class="btn-pay" disabled>Payer</button>
      `;
      document.querySelector('.center-content').appendChild(mobileTotal);
      
      mobileTotal.querySelector('.btn-pay').addEventListener('click', openPaymentModal);
      updateTotals();
    } else if (!isMobile && mobileTotal) {
      mobileTotal.remove();
    }
  };
  
  checkMobile();
  window.addEventListener('resize', checkMobile);
}

// Event Listeners
function setupEventListeners() {
  // Add tab
  addTabBtn.addEventListener('click', () => {
    const newOrder = { id: nextOrderNumber, items: [] };
    orders.push(newOrder);
    activeOrderId = nextOrderNumber;
    nextOrderNumber++;
    renderTabs();
    renderOrderItems();
    updateTotals();
  });
  
  // Category buttons
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      renderProducts();
    });
  });
  
  // Clear order
  clearOrderBtn.addEventListener('click', () => {
    const order = orders.find(o => o.id === activeOrderId);
    order.items = [];
    renderOrderItems();
    updateTotals();
  });
  
  // Pay button
  payBtn.addEventListener('click', openPaymentModal);
  
  // Custom modal
  closeModalBtn.addEventListener('click', closeCustomModal);
  customModal.addEventListener('click', (e) => {
    if (e.target === customModal) closeCustomModal();
  });
  
  // Size options
  sizeOptions.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sizeOptions.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedOptions.size = {
        name: btn.dataset.size,
        price: parseFloat(btn.dataset.price)
      };
      updateModalPrice();
    });
  });
  
  // Milk options
  milkOptions.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      milkOptions.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedOptions.milk = {
        name: btn.dataset.milk,
        price: parseFloat(btn.dataset.price)
      };
      updateModalPrice();
    });
  });
  
  // Extras options (toggle)
  extrasOptions.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      const extraName = btn.dataset.extra;
      const extraPrice = parseFloat(btn.dataset.price);
      
      if (btn.classList.contains('active')) {
        selectedOptions.extras.push({ name: extraName, price: extraPrice });
      } else {
        selectedOptions.extras = selectedOptions.extras.filter(e => e.name !== extraName);
      }
      updateModalPrice();
    });
  });
  
  // Add to order
  addToOrderBtn.addEventListener('click', () => {
    if (!selectedProduct) return;
    
    let totalPrice = selectedProduct.price;
    totalPrice += selectedOptions.size.price;
    totalPrice += selectedOptions.milk.price;
    totalPrice += selectedOptions.extras.reduce((sum, e) => sum + e.price, 0);
    
    addItemToOrder({
      ...selectedProduct,
      category: selectedProductCategory,
      quantity: 1,
      totalPrice,
      options: { ...selectedOptions }
    });
    
    closeCustomModal();
  });
  
  // Payment modal
  closePaymentBtn.addEventListener('click', closePaymentModal);
  paymentModal.addEventListener('click', (e) => {
    if (e.target === paymentModal) closePaymentModal();
  });
  
  // Payment method selection
  paymentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      paymentBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedPaymentMethod = btn.dataset.method;
      confirmPaymentBtn.disabled = false;
    });
  });
  
  // Confirm payment
  confirmPaymentBtn.addEventListener('click', confirmPayment);
  
  // New order after success
  newOrderBtn.addEventListener('click', startNewOrder);
  successModal.addEventListener('click', (e) => {
    if (e.target === successModal) startNewOrder();
  });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCustomModal();
      closePaymentModal();
    }
  });
}

// Start the app
init();
