// ==========================================
// HISAAB — HOME PAGE (CLEAN)
// ==========================================

let allCustomers = [];

document.addEventListener("DOMContentLoaded", () => {
  updateHomeShopName();
  setGreeting();
  loadAndRender();
  
  const s = document.getElementById("searchInput");
  if (s) {
    s.addEventListener("input", (e) => {
      renderCustomers(filterCustomers(e.target.value.toLowerCase().trim()));
    });
  }
});

function updateHomeShopName() {
  const el = document.getElementById("shopNameHome");
  if (!el) return;
  const biz = Storage.getBusinessInfo();
  if (biz && biz.shopName && biz.shopName.trim()) {
    el.textContent = biz.shopName;
  } else {
    el.textContent = typeof I18n !== "undefined" ? I18n.t("your_khata") : "Your Khata";
  }
}

function setGreeting() {
  const h = new Date().getHours();
  let key = "good_morning";
  if (h >= 12 && h < 17) key = "good_afternoon";
  else if (h >= 17) key = "good_evening";
  
  const el = document.getElementById("greeting");
  if (el) {
    const text = typeof I18n !== "undefined" ? I18n.t(key) : "Hello";
    el.textContent = text;
  }
}

function loadAndRender() {
  allCustomers = Storage.getCustomers();
  renderCustomers(allCustomers);
  renderSummary();
  renderRecentActivity();
}

function filterCustomers(q) {
  if (!q) return allCustomers;
  return allCustomers.filter(c =>
    c.name.toLowerCase().includes(q) || (c.phone || "").includes(q)
  );
}

function renderSummary() {
  const total = Storage.getTotalPending();
  const pending = allCustomers.filter(c => Storage.getCustomerBalance(c.id) > 0).length;
  
  const t = document.getElementById("totalPending");
  if (t) t.textContent = "₹" + formatAmount(total);
  
  const cnt = document.getElementById("customerCount");
  if (cnt) cnt.textContent = allCustomers.length;
  
  const pc = document.getElementById("pendingCount");
  if (pc) pc.textContent = "⚡ " + pending + " pending";
}

function renderCustomers(list) {
  const container = document.getElementById("customerList");
  if (!container) return;

  // Empty state
  if (list.length === 0) {
    const isEmpty = allCustomers.length === 0;
    if (isEmpty) {
      container.innerHTML = `
        <div class="empty" style="padding:40px 20px">
          <div class="empty-icon">📒</div>
          <div class="empty-text">Welcome to Hisaab!</div>
          <div class="empty-hint">Add your first customer to get started</div>
          <div style="display:flex;flex-direction:column;gap:10px;max-width:280px;margin:24px auto 0">
            <button class="btn btn-primary btn-full" onclick="Router.go('add-customer')">+ Add First Customer</button>
          </div>
        </div>`;
    } else {
      container.innerHTML = `
        <div class="empty" style="padding:40px 20px">
          <div class="empty-icon">🔍</div>
          <div class="empty-text">No matches found</div>
        </div>`;
    }
    return;
  }

  // Render customers
  container.innerHTML = list.map(c => {
    const bal = Storage.getCustomerBalance(c.id);
    const cls = bal > 0 ? "positive" : bal < 0 ? "negative" : "settled";
    const lbl = bal > 0 ? "PENDING" : bal < 0 ? "ADVANCE" : "SETTLED";
    
    return `
      <div class="customer-card ${cls}" onclick="Router.go('customer', {id:'${c.id}'})">
        <div class="customer-avatar" style="background:${avatarColor(c.name)}">${initials(c.name)}</div>
        <div class="customer-info">
          <div class="customer-name">${escapeHtml(c.name)}</div>
          <div class="customer-phone">${c.phone ? "📱 " + c.phone : "No phone"}</div>
        </div>
        <div class="customer-balance">
          <div class="customer-amount ${cls}">₹${formatAmount(Math.abs(bal))}</div>
          <div class="customer-label">${lbl}</div>
        </div>
      </div>
    `;
  }).join("");
}

function renderRecentActivity() {
  const container = document.getElementById("recentActivity");
  if (!container) return;
  const entries = Storage.getEntries().sort((a, b) => b.date - a.date).slice(0, 10);
  if (entries.length === 0) {
    container.innerHTML = '<p class="text-muted text-center" style="padding:16px">No activity yet</p>';
    return;
  }
  container.innerHTML = entries.map(e => {
    const customer = Storage.getCustomer(e.customerId);
    const name = customer ? customer.name : "Unknown";
    const isGave = e.type === "gave";
    const icon = isGave ? "↗" : "↙";
    const date = new Date(e.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
    
    let desc = '';
    if (e.items && e.items.length > 0) {
      desc = e.items.map(it => it.name).join(', ');
    } else if (e.note) {
      desc = e.note;
    }
    if (desc.length > 30) desc = desc.substring(0, 27) + '...';
    
    return '<div class="entry-row" onclick="Router.go(\'customer\', {id:\'' + e.customerId + '\'})"><div class="entry-icon ' + e.type + '">' + icon + '</div><div class="entry-info"><div class="entry-note"><strong>' + escapeHtml(name) + '</strong>' + (desc ? ' · ' + escapeHtml(desc) : '') + '</div><div class="entry-date">' + date + '</div></div><div class="entry-amount ' + e.type + '">' + (isGave ? "+" : "-") + '₹' + formatAmount(e.amount) + '</div></div>';
  }).join("");
}

// ---------- Helpers ----------
function formatAmount(n) {
  if (!n && n !== 0) return "0";
  return Number(n).toLocaleString("en-IN");
}

function initials(n) {
  if (!n) return "?";
  const p = n.trim().split(" ");
  return ((p[0] ? p[0][0] : "") + (p[1] ? p[1][0] : "")).toUpperCase() || "?";
}

function escapeHtml(s) {
  if (!s) return "";
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function avatarColor(n) {
  const cols = ["#EF4444","#F59E0B","#10B981","#3B82F6","#8B5CF6","#EC4899","#06B6D4","#F97316"];
  if (!n) return cols[0];
  let s = 0;
  for (let i = 0; i < n.length; i++) s += n.charCodeAt(i);
  return cols[s % cols.length];
}

// Refresh on back navigation
window.addEventListener("pageshow", () => {
  allCustomers = Storage.getCustomers();
  renderCustomers(allCustomers);
  renderSummary();
});

// ============ TODAY'S BUSINESS ============
function renderTodayBusiness() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const start = today.getTime();
  const end = tomorrow.getTime();
  
  const entries = Storage.getEntries().filter(e => e.date >= start && e.date < end);
  
  let given = 0, got = 0;
  const customerIds = new Set();
  
  entries.forEach(e => {
    customerIds.add(e.customerId);
    if (e.type === 'gave') given += Number(e.amount);
    else got += Number(e.amount);
  });
  
  const net = got - given;
  
  const gEl = document.getElementById('todayGiven');
  const rEl = document.getElementById('todayGot');
  const nEl = document.getElementById('todayNet');
  const eEl = document.getElementById('todayEntries');
  const cEl = document.getElementById('todayCustomers');
  
  if (gEl) gEl.textContent = '₹' + formatAmount(given);
  if (rEl) rEl.textContent = '₹' + formatAmount(got);
  if (nEl) {
    nEl.textContent = (net >= 0 ? '+' : '-') + '₹' + formatAmount(Math.abs(net));
    nEl.className = 'daily-value ' + (net >= 0 ? 'green' : 'red');
  }
  if (eEl) eEl.textContent = entries.length + ' entr' + (entries.length === 1 ? 'y' : 'ies');
  if (cEl) cEl.textContent = customerIds.size + ' customer' + (customerIds.size === 1 ? '' : 's');
}

// Hook into page load
document.addEventListener("DOMContentLoaded", () => {
  renderTodayBusiness();
});

// ============ TODAY'S BUSINESS UPGRADE ============
function updateTodayCard() {
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  var start = today.getTime();
  var end = tomorrow.getTime();

  var entries = Storage.getEntries().filter(function(e) {
    return e.date >= start && e.date < end;
  });

  var given = 0, received = 0;
  var customerSet = new Set();

  entries.forEach(function(e) {
    customerSet.add(e.customerId);
    var amt = Number(e.amount) || 0;
    if (e.type === 'gave') given += amt;
    else if (e.type === 'got') received += amt;
  });

  var pending = given - received;
  if (pending < 0) pending = 0;

  // Update main stats
  var sellEl = document.getElementById('todaySell');
  if (sellEl) sellEl.textContent = '₹' + given.toLocaleString('en-IN');

  var custEl = document.getElementById('todayCustomers');
  if (custEl) custEl.textContent = customerSet.size;

  var givenEl = document.getElementById('todayGiven');
  if (givenEl) givenEl.textContent = '₹' + given.toLocaleString('en-IN');

  var recvEl = document.getElementById('todayReceived');
  if (recvEl) recvEl.textContent = '₹' + received.toLocaleString('en-IN');

  var pendEl = document.getElementById('todayPending');
  if (pendEl) pendEl.textContent = '₹' + pending.toLocaleString('en-IN');
}

// Hook into page load
document.addEventListener("DOMContentLoaded", function() {
  setTimeout(updateTodayCard, 100);
});
