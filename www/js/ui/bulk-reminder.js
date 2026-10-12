// HISAAB — BULK WHATSAPP REMINDER

let allPending = [];
let selected = new Set();
let currentFilter = 'all';

document.addEventListener("DOMContentLoaded", () => {
  loadPendingCustomers();
  renderList();
  updateSummary();
});

function loadPendingCustomers() {
  const customers = Storage.getCustomers();
  allPending = customers
    .map(c => ({ customer: c, balance: Storage.getCustomerBalance(c.id) }))
    .filter(x => x.balance > 0 && x.customer.phone)
    .sort((a, b) => b.balance - a.balance);
}

function filterList(type) {
  currentFilter = type;
  document.querySelectorAll('.chip').forEach(c => {
    c.classList.toggle('active', c.dataset.filter === type);
  });
  renderList();
}

function getFilteredList() {
  if (currentFilter === 'above1000') return allPending.filter(x => x.balance >= 1000);
  if (currentFilter === 'above500') return allPending.filter(x => x.balance >= 500);
  return allPending;
}

function renderList() {
  const container = document.getElementById('customerList');
  const list = getFilteredList();

  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty">
        <div class="empty-icon">🎉</div>
        <div class="empty-text">No customers to remind</div>
        <div class="empty-hint">All balances are settled</div>
      </div>`;
    return;
  }

  container.innerHTML = list.map(({ customer, balance }) => {
    const isSelected = selected.has(customer.id);
    return `
      <div class="customer-card" onclick="toggleSelect('${customer.id}')" style="${isSelected ? 'border-color:var(--primary);background:var(--card2)' : ''}">
        <div class="customer-avatar" style="background:${isSelected ? 'var(--primary)' : 'var(--card2)'};color:${isSelected ? '#fff' : 'var(--text)'}">
          ${isSelected ? '✓' : initials(customer.name)}
        </div>
        <div class="customer-info">
          <div class="customer-name">${escapeHtml(customer.name)}</div>
          <div class="customer-phone">📱 ${customer.phone}</div>
        </div>
        <div class="customer-balance">
          <div class="customer-amount positive">₹${fmt(balance)}</div>
          <div class="customer-label">PENDING</div>
        </div>
      </div>
    `;
  }).join('');
}

function toggleSelect(id) {
  if (selected.has(id)) selected.delete(id);
  else selected.add(id);
  renderList();
  updateSummary();
}

function selectAll() {
  const list = getFilteredList();
  if (selected.size === list.length) {
    selected.clear();
  } else {
    list.forEach(x => selected.add(x.customer.id));
  }
  renderList();
  updateSummary();
}

function updateSummary() {
  const list = getFilteredList();
  const selectedList = list.filter(x => selected.has(x.customer.id));
  const totalSelected = selectedList.reduce((sum, x) => sum + x.balance, 0);

  document.getElementById('totalPending').textContent = '₹' + fmt(totalSelected);
  document.getElementById('customerCount').textContent = selectedList.length + ' customers selected';
  document.getElementById('selectedCount').textContent = selectedList.length;
}

function sendAllReminders() {
  const list = getFilteredList();
  const selectedList = list.filter(x => selected.has(x.customer.id));

  if (selectedList.length === 0) {
    alert('Select at least one customer');
    return;
  }

  if (!confirm('Send reminder to ' + selectedList.length + ' customers?')) return;

  // Send WhatsApp messages one at a time
  let i = 0;
  const sendNext = () => {
    if (i >= selectedList.length) {
      if (typeof Toast !== 'undefined') Toast.show('All ' + selectedList.length + ' reminders opened');
      return;
    }
    const { customer, balance } = selectedList[i];
    const msg = generateMessage(customer, balance);
    const url = 'https://wa.me/91' + customer.phone + '?text=' + encodeURIComponent(msg);
    window.open(url, '_blank');
    i++;
    // Give time between opens
    setTimeout(sendNext, 800);
  };

  sendNext();
}

function generateMessage(customer, balance) {
  const biz = Storage.getBusinessInfo();
  const amount = Math.abs(balance);
  
  if (typeof UPIService !== 'undefined' && UPIService.isConfigured()) {
    const upiLink = UPIService.generateForCustomer(customer, balance);
    return 'Hello ' + customer.name + ',\n\nYour pending amount is ₹' + amount + '.\n\n💳 Pay now:\n' + upiLink + '\n\nThank you! 🙏\n- ' + (biz.shopName || biz.ownerName || 'Hisaab');
  }
  
  return 'Hello ' + customer.name + ',\n\nYour pending amount is ₹' + amount + '. Please pay when convenient.\n\nThank you! 🙏\n- ' + (biz.shopName || biz.ownerName || 'Hisaab');
}

function fmt(n) { if (!n && n !== 0) return '0'; return Number(n).toLocaleString('en-IN'); }
function initials(n) { if (!n) return '?'; const p = n.trim().split(' '); return ((p[0] ? p[0][0] : '') + (p[1] ? p[1][0] : '')).toUpperCase() || '?'; }
function escapeHtml(s) { if (!s) return ''; return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
