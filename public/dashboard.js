// DOM Elements
const currentDateEl = document.getElementById('currentDate');
const periodSelect = document.getElementById('periodSelect');
const refreshBtn = document.getElementById('refreshBtn');
const totalOrdersEl = document.getElementById('totalOrders');
const totalRevenueEl = document.getElementById('totalRevenue');
const averageOrderEl = document.getElementById('averageOrder');
const totalItemsEl = document.getElementById('totalItems');
const ordersChartEl = document.getElementById('ordersChart');
const revenueChartEl = document.getElementById('revenueChart');
const topProductsEl = document.getElementById('topProducts');
const categoryBreakdownEl = document.getElementById('categoryBreakdown');
const navItems = document.querySelectorAll('.nav-item');

// Menu Editor Elements
const overviewSection = document.getElementById('overviewSection');
const menuEditorSection = document.getElementById('menuEditorSection');
const categoryTabs = document.querySelectorAll('.category-tab');
const currentCategoryNameEl = document.getElementById('currentCategoryName');
const productsEditorList = document.getElementById('productsEditorList');
const addProductBtn = document.getElementById('addProductBtn');
const productModal = document.getElementById('productModal');
const productForm = document.getElementById('productForm');
const productModalTitle = document.getElementById('productModalTitle');
const closeProductModal = document.getElementById('closeProductModal');
const cancelProductBtn = document.getElementById('cancelProductBtn');
const deleteProductBtn = document.getElementById('deleteProductBtn');

// State
let salesHistory = [];
let currentPeriod = 'today';
let currentSection = 'overview';
let editingCategory = 'cafe';
let editingProductId = null;

// Default products data
const defaultProducts = {
  cafe: [
    { id: 'c1', name: 'Espresso', price: 2.50, hasOptions: true },
    { id: 'c2', name: 'Long Black', price: 3.00, hasOptions: true },
    { id: 'c3', name: 'Cappuccino', price: 4.00, hasOptions: true },
    { id: 'c4', name: 'Mocha', price: 4.50, hasOptions: true },
    { id: 'c5', name: 'Latte', price: 4.00, hasOptions: true },
    { id: 'c6', name: 'Flat White', price: 4.00, hasOptions: true },
    { id: 'c7', name: 'Americano', price: 3.50, hasOptions: true },
    { id: 'c8', name: 'Macchiato', price: 3.50, hasOptions: true }
  ],
  breakfast: [
    { id: 'b1', name: 'Croissant', price: 2.50, hasOptions: false },
    { id: 'b2', name: 'Pain au chocolat', price: 2.80, hasOptions: false },
    { id: 'b3', name: 'Toast Avocat', price: 8.50, hasOptions: false },
    { id: 'b4', name: 'Eggs Benedict', price: 12.00, hasOptions: false },
    { id: 'b5', name: 'Pancakes', price: 9.50, hasOptions: false },
    { id: 'b6', name: 'Granola Bowl', price: 7.50, hasOptions: false }
  ],
  lunch: [
    { id: 'l1', name: 'Salade Cesar', price: 11.50, hasOptions: false },
    { id: 'l2', name: 'Club Sandwich', price: 10.50, hasOptions: false },
    { id: 'l3', name: 'Quiche Lorraine', price: 8.50, hasOptions: false },
    { id: 'l4', name: 'Burger Classic', price: 13.50, hasOptions: false },
    { id: 'l5', name: 'Poke Bowl', price: 14.00, hasOptions: false },
    { id: 'l6', name: 'Soupe du jour', price: 6.50, hasOptions: false }
  ],
  soft: [
    { id: 's1', name: 'Eau minerale', price: 2.00, hasOptions: false },
    { id: 's2', name: 'Coca-Cola', price: 3.00, hasOptions: false },
    { id: 's3', name: 'Jus d\'orange', price: 3.50, hasOptions: false },
    { id: 's4', name: 'Limonade', price: 3.50, hasOptions: false },
    { id: 's5', name: 'The glace', price: 3.50, hasOptions: false },
    { id: 's6', name: 'Smoothie', price: 5.50, hasOptions: false }
  ]
};

// Load products from localStorage or use defaults
function loadProducts() {
  const stored = localStorage.getItem('posProducts');
  if (stored) {
    return JSON.parse(stored);
  }
  return { ...defaultProducts };
}

// Save products to localStorage
function saveProducts(products) {
  localStorage.setItem('posProducts', JSON.stringify(products));
}

// Format date
function formatDate(date) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('fr-FR', options);
}

// Initialize
function init() {
  // Set current date
  currentDateEl.textContent = formatDate(new Date());
  
  // Load data
  loadSalesHistory();
  updateDashboard();
  
  // Event listeners
  periodSelect.addEventListener('change', (e) => {
    currentPeriod = e.target.value;
    updateDashboard();
  });
  
  refreshBtn.addEventListener('click', () => {
    refreshBtn.classList.add('spinning');
    setTimeout(() => refreshBtn.classList.remove('spinning'), 500);
    loadSalesHistory();
    updateDashboard();
  });
  
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      const section = item.dataset.section;
      switchSection(section);
    });
  });
  
  // Menu editor event listeners
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      categoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      editingCategory = tab.dataset.category;
      renderProductsList();
    });
  });
  
  addProductBtn.addEventListener('click', () => openProductModal(null));
  closeProductModal.addEventListener('click', closeModal);
  cancelProductBtn.addEventListener('click', closeModal);
  deleteProductBtn.addEventListener('click', deleteProduct);
  productForm.addEventListener('submit', saveProduct);
  
  productModal.addEventListener('click', (e) => {
    if (e.target === productModal) closeModal();
  });
  
  // Listen for storage changes
  window.addEventListener('storage', (e) => {
    if (e.key === 'salesHistory') {
      loadSalesHistory();
      updateDashboard();
    }
  });
}

// Load sales history from localStorage
function loadSalesHistory() {
  const stored = localStorage.getItem('salesHistory');
  if (stored) {
    salesHistory = JSON.parse(stored);
  } else {
    salesHistory = [];
  }
}

// Filter data by period
function filterByPeriod(data) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch (currentPeriod) {
    case 'today':
      return data.filter(item => new Date(item.timestamp) >= today);
    case 'week':
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return data.filter(item => new Date(item.timestamp) >= weekAgo);
    case 'month':
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return data.filter(item => new Date(item.timestamp) >= monthAgo);
    case 'all':
    default:
      return data;
  }
}

// Update dashboard
function updateDashboard() {
  const filteredData = filterByPeriod(salesHistory);
  
  // Calculate stats
  const totalOrders = filteredData.length;
  const totalRevenue = filteredData.reduce((sum, order) => sum + order.total, 0);
  const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalItems = filteredData.reduce((sum, order) => {
    return sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
  }, 0);
  
  // Update stat cards
  totalOrdersEl.textContent = totalOrders;
  totalRevenueEl.textContent = `${totalRevenue.toFixed(2)} \u20AC`;
  averageOrderEl.textContent = `${averageOrder.toFixed(2)} \u20AC`;
  totalItemsEl.textContent = totalItems;
  
  // Update charts
  updateOrdersChart(filteredData);
  updateRevenueChart(filteredData);
  
  // Update products
  updateTopProducts(filteredData);
  updateCategoryBreakdown(filteredData);
}

// Group data by day
function groupByDay(data) {
  const groups = {};
  
  data.forEach(order => {
    const date = new Date(order.timestamp);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    if (!groups[key]) {
      groups[key] = { orders: 0, revenue: 0, date: key };
    }
    
    groups[key].orders++;
    groups[key].revenue += order.total;
  });
  
  // Sort by date and get last 7 days
  return Object.values(groups)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7);
}

// Update orders chart
function updateOrdersChart(data) {
  const dailyData = groupByDay(data);
  
  if (dailyData.length === 0) {
    ordersChartEl.innerHTML = '<p class="empty-state">Aucune donnee disponible</p>';
    return;
  }
  
  const maxOrders = Math.max(...dailyData.map(d => d.orders), 1);
  
  ordersChartEl.innerHTML = dailyData.map(day => {
    const height = (day.orders / maxOrders) * 150;
    const dayName = formatDayShort(day.date);
    return `
      <div class="chart-bar-wrapper">
        <span class="chart-value">${day.orders}</span>
        <div class="chart-bar" style="height: ${height}px;"></div>
        <span class="chart-label">${dayName}</span>
      </div>
    `;
  }).join('');
}

// Update revenue chart
function updateRevenueChart(data) {
  const dailyData = groupByDay(data);
  
  if (dailyData.length === 0) {
    revenueChartEl.innerHTML = '<p class="empty-state">Aucune donnee disponible</p>';
    return;
  }
  
  const maxRevenue = Math.max(...dailyData.map(d => d.revenue), 1);
  
  revenueChartEl.innerHTML = dailyData.map(day => {
    const height = (day.revenue / maxRevenue) * 150;
    const dayName = formatDayShort(day.date);
    return `
      <div class="chart-bar-wrapper">
        <span class="chart-value">${day.revenue.toFixed(0)}\u20AC</span>
        <div class="chart-bar revenue" style="height: ${height}px;"></div>
        <span class="chart-label">${dayName}</span>
      </div>
    `;
  }).join('');
}

// Format day short
function formatDayShort(dateStr) {
  const date = new Date(dateStr);
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  return days[date.getDay()];
}

// Update top products
function updateTopProducts(data) {
  const products = {};
  
  data.forEach(order => {
    order.items.forEach(item => {
      if (!products[item.name]) {
        products[item.name] = { name: item.name, quantity: 0, revenue: 0 };
      }
      products[item.name].quantity += item.quantity;
      products[item.name].revenue += item.totalPrice * item.quantity;
    });
  });
  
  const sorted = Object.values(products)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);
  
  if (sorted.length === 0) {
    topProductsEl.innerHTML = '<p class="empty-state">Aucune donnee disponible</p>';
    return;
  }
  
  topProductsEl.innerHTML = sorted.map((product, index) => {
    let rankClass = '';
    if (index === 0) rankClass = 'gold';
    else if (index === 1) rankClass = 'silver';
    else if (index === 2) rankClass = 'bronze';
    
    return `
      <div class="product-item">
        <div class="product-info">
          <span class="product-rank ${rankClass}">${index + 1}</span>
          <span class="product-name">${product.name}</span>
        </div>
        <div class="product-stats">
          <span class="product-quantity">${product.quantity} vendus</span>
          <span class="product-revenue">${product.revenue.toFixed(2)} \u20AC</span>
        </div>
      </div>
    `;
  }).join('');
}

// Update category breakdown
function updateCategoryBreakdown(data) {
  const categories = {
    cafe: { name: 'Cafe', quantity: 0, revenue: 0, icon: 'cafe' },
    breakfast: { name: 'Breakfast', quantity: 0, revenue: 0, icon: 'breakfast' },
    lunch: { name: 'Lunch', quantity: 0, revenue: 0, icon: 'lunch' },
    soft: { name: 'Soft', quantity: 0, revenue: 0, icon: 'soft' }
  };
  
  data.forEach(order => {
    order.items.forEach(item => {
      if (item.category && categories[item.category]) {
        categories[item.category].quantity += item.quantity;
        categories[item.category].revenue += item.totalPrice * item.quantity;
      }
    });
  });
  
  const sorted = Object.values(categories)
    .filter(c => c.quantity > 0)
    .sort((a, b) => b.revenue - a.revenue);
  
  if (sorted.length === 0) {
    categoryBreakdownEl.innerHTML = '<p class="empty-state">Aucune donnee disponible</p>';
    return;
  }
  
  const categoryIcons = {
    cafe: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M17 8h1a4 4 0 1 1 0 8h-1"/>
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
    </svg>`,
    breakfast: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v6l4 2"/>
    </svg>`,
    lunch: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
      <path d="M7 2v20"/>
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
    </svg>`,
    soft: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M8 2h8"/>
      <path d="M9 2v2.789a4 4 0 0 1-.672 2.219l-.656.984A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.788a4 4 0 0 0-.672-2.22l-.656-.984A4 4 0 0 1 15 4.79V2"/>
    </svg>`
  };
  
  categoryBreakdownEl.innerHTML = sorted.map(category => {
    return `
      <div class="category-item">
        <div class="category-info">
          <span class="category-icon ${category.icon}">${categoryIcons[category.icon]}</span>
          <span class="category-name">${category.name}</span>
        </div>
        <div class="category-stats">
          <span class="category-quantity">${category.quantity} articles</span>
          <span class="category-revenue">${category.revenue.toFixed(2)} \u20AC</span>
        </div>
      </div>
    `;
  }).join('');
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', init);