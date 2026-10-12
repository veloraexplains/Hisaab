// HISAAB — COMBINED ENTRY (Gave + Got in one save)

let currentCustomer = null;
let selectedPayMode = 'cash';
let itemsOpen = false;
let items = [];
let lastSavedEntryIds = [];

document.addEventListener("DOMContentLoaded", () => {
  const id = Router.param("id");
  if (!id) { Router.home(); return; }
  currentCustomer = Storage.getCustomer(id);
  if (!currentCustomer) { Router.home(); return; }
  document.getElementById("headerName").textContent = currentCustomer.name;

  const today = new Date();
  document.getElementById("dateInput").value =
    today.getFullYear() + '-' +
    String(today.getMonth() + 1).padStart(2, '0') + '-' +
    String(today.getDate()).padStart(2, '0');

  // Numeric-only inputs
  attachNumeric("gaveInput");
  attachNumeric("gotInput");

  document.getElementById("saveBtn").addEventListener("click", saveEntry);
});

function attachNumeric(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener("input", (e) => {
    let v = e.target.value.replace(/[^0-9.]/g, '');
    const parts = v.split('.');
    if (parts.length > 2) v = parts[0] + '.' + parts.slice(1).join('');
    if (parts[1] && parts[1].length > 2) v = parts[0] + '.' + parts[1].slice(0, 2);
    e.target.value = v;
    updateNet();
  });
}

function pickPayMode(mode) {
  selectedPayMode = mode;
  document.querySelectorAll(".pay-mode").forEach(m => {
    m.classList.toggle("active", m.dataset.mode === mode);
  });
}

function pickDate(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  document.getElementById("dateInput").value =
    d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
  document.querySelectorAll(".date-chip").forEach(chip => {
    chip.classList.toggle("active", parseInt(chip.dataset.days) === days);
  });
}

function toggleItems() {
  itemsOpen = !itemsOpen;
  document.getElementById("itemsToggle").classList.toggle("open", itemsOpen);
  document.getElementById("itemsSection").classList.toggle("open", itemsOpen);
  if (itemsOpen && items.length === 0) {
    addItem();
  }
}

function addItem() {
  items.push({ name: '', qty: '', price: '' });
  renderItems();
}

function removeItem(index) {
  items.splice(index, 1);
  if (items.length === 0) {
    items.push({ name: '', qty: '', price: '' });
  }
  renderItems();
}

function updateItem(index, field, value) {
  if (items[index]) {
    items[index][field] = value;
    if (field === 'price') updateItemsTotal();
  }
}

function renderItems() {
  const container = document.getElementById('itemsList');
  if (!container) return;
  container.innerHTML = items.map((item, i) => `
    <div class="item-row">
      <div class="item-row-top">
        <div class="item-row-num">${i + 1}</div>
        <input type="text" placeholder="Item name"
               value="${escA(item.name)}"
               oninput="updateItem(${i}, 'name', this.value)">
        <button class="item-delete" onclick="removeItem(${i})">✕</button>
      </div>
      <div class="item-row-bot">
        <input type="text" class="item-qty" placeholder="Qty"
               value="${escA(item.qty)}"
               oninput="updateItem(${i}, 'qty', this.value)">
        <input type="tel" class="item-price" placeholder="₹ Price" inputmode="decimal"
               value="${escA(item.price)}"
               oninput="updateItem(${i}, 'price', this.value)">
      </div>
    </div>
  `).join('');
  updateItemsTotal();
}

function updateItemsTotal() {
  let total = 0;
  items.forEach(item => {
    const p = parseFloat(item.price);
    if (!isNaN(p) && p > 0) total += p;
  });
  document.getElementById('itemsTotal').textContent = '₹' + total.toLocaleString('en-IN');

  // Auto-fill gave amount if empty and items total > 0
  const gaveInput = document.getElementById('gaveInput');
  if (total > 0 && !gaveInput.value) {
    gaveInput.value = total.toFixed(2).replace(/\.00$/, '');
    updateNet();
  }
  return total;
}

function updateNet() {
  const gave = parseFloat(document.getElementById('gaveInput').value) || 0;
  const got = parseFloat(document.getElementById('gotInput').value) || 0;
  const net = gave - got;

  const netEl = document.getElementById('netAmount');
  const hintEl = document.getElementById('netHint');

  if (gave === 0 && got === 0) {
    netEl.textContent = '₹0';
    netEl.style.color = 'var(--muted)';
    hintEl.textContent = 'Enter amounts above';
    return;
  }

  if (net > 0) {
    netEl.textContent = '+₹' + net.toLocaleString('en-IN');
    netEl.style.color = '#EF4444';
    hintEl.textContent = 'Customer owes you this amount';
  } else if (net < 0) {
    netEl.textContent = '-₹' + Math.abs(net).toLocaleString('en-IN');
    netEl.style.color = '#22C55E';
    hintEl.textContent = 'Customer has paid in advance';
  } else {
    netEl.textContent = '₹0';
    netEl.style.color = 'var(--primary)';
    hintEl.textContent = '✅ Fully settled';
  }
}

function saveEntry() {
  const gave = parseFloat(document.getElementById('gaveInput').value) || 0;
  const got = parseFloat(document.getElementById('gotInput').value) || 0;

  if (gave === 0 && got === 0) {
    alert("Enter at least one amount");
    return;
  }

  const dateStr = document.getElementById("dateInput").value;
  const date = dateStr ? new Date(dateStr).getTime() : Date.now();
  const note = document.getElementById("noteInput").value.trim();

  const validItems = items.filter(it => it.name.trim()).map(it => ({
    name: it.name.trim(),
    qty: it.qty.trim() || '',
    price: parseFloat(it.price) || 0
  }));

  const transactionId = 'tx_' + Date.now();
  lastSavedEntryIds = [];

  // Save GAVE entry if gave > 0
  if (gave > 0) {
    var newId1 = Storage.newEntryId();
    Storage.addEntry({
      id: newId1,
      transactionId: transactionId,
      customerId: currentCustomer.id,
      type: 'gave',
      amount: Math.round(gave * 100) / 100,
      items: validItems,
      payMode: '',
      note: note,
      date: date,
      createdAt: Date.now()
    });
    lastSavedEntryIds.push(newId1);
  }

  // Save GOT entry if got > 0
  if (got > 0) {
    var newId2 = Storage.newEntryId();
    Storage.addEntry({
      id: newId2,
      transactionId: transactionId,
      customerId: currentCustomer.id,
      type: 'got',
      amount: Math.round(got * 100) / 100,
      items: [],
      payMode: selectedPayMode,
      note: note,
      date: date,
      createdAt: Date.now() + 1
    });
    lastSavedEntryIds.push(newId2);
  }

  if (typeof Toast !== "undefined") Toast.show("Entry saved");
  
  // Just redirect to customer page
  setTimeout(function() {
    Router.go("customer", { id: currentCustomer.id });
  }, 400);
}

function showSuccessPopup(gave, got) {
  var backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop open';
  backdrop.id = 'successPopup';
  
  var summaryText = '';
  if (gave > 0 && got > 0) {
    summaryText = 'Given ₹' + gave.toLocaleString('en-IN') + ' · Got ₹' + got.toLocaleString('en-IN');
  } else if (gave > 0) {
    summaryText = '₹' + gave.toLocaleString('en-IN') + ' given';
  } else {
    summaryText = '₹' + got.toLocaleString('en-IN') + ' received';
  }
  
  backdrop.innerHTML = 
    '<div class="modal">' +
    '<div style="font-size:56px;text-align:center;margin-bottom:12px">✅</div>' +
    '<div style="font-size:20px;font-weight:800;text-align:center;color:#fff;margin-bottom:6px">Entry Saved</div>' +
    '<div style="font-size:13px;color:#9CA3AF;text-align:center;margin-bottom:24px">' + summaryText + '</div>' +
    '<div style="display:flex;flex-direction:column;gap:10px">' +
    '<button class="btn btn-primary btn-full" id="popupBillBtn">🧾 Generate Bill (This Entry)</button>' +
    '<button class="btn btn-secondary btn-full" id="popupStatementBtn">📊 Full Statement (All Entries)</button>' +
    '<button class="btn btn-secondary btn-full" id="popupShareBtn">📤 Share via WhatsApp</button>' +
    '<button class="btn btn-secondary btn-full" id="popupCloseBtn">Done</button>' +
    '</div></div>';
  
  document.body.appendChild(backdrop);
  
  document.getElementById('popupCloseBtn').addEventListener('click', function() {
    backdrop.remove();
    Router.go("customer", { id: currentCustomer.id });
  });
  
  document.getElementById('popupBillBtn').addEventListener('click', function() {
    backdrop.remove();
    generateBillPdf();
  });
  
  document.getElementById('popupStatementBtn').addEventListener('click', function() {
    backdrop.remove();
    generateStatementPdf();
  });
  
  document.getElementById('popupShareBtn').addEventListener('click', function() {
    backdrop.remove();
    generateStatementPdf(true);
  });
}

async function generateBillPdf() {
  if (typeof PDFService === 'undefined' || !PDFService.generateBill) {
    alert('PDF service not loaded');
    return;
  }
  if (typeof Toast !== 'undefined') Toast.show('Generating bill...');
  
  var allEntries = Storage.getEntriesForCustomer(currentCustomer.id);
  
  var recentEntries = [];
  if (lastSavedEntryIds.length > 0) {
    recentEntries = allEntries.filter(function(e) {
      return lastSavedEntryIds.indexOf(e.id) !== -1;
    });
  }
  
  if (recentEntries.length === 0) {
    allEntries.sort(function(a, b) { return b.createdAt - a.createdAt; });
    recentEntries = [allEntries[0]];
  }
  
  var balance = Storage.getCustomerBalance(currentCustomer.id);
  
  try {
    var doc = PDFService.generateBill(currentCustomer, recentEntries, balance);
    if (!doc) { alert('PDF generation failed'); return; }
    
    var safeName = currentCustomer.name.replace(/[^a-zA-Z0-9]/g, '_');
    var dateStr = new Date().toISOString().split('T')[0];
    var filename = 'Bill_' + safeName + '_' + dateStr + '.pdf';
    
    var result = await PDFService.saveToDevice(doc, filename);
    
    if (result && result.success) {
      if (typeof Toast !== 'undefined') Toast.show('Bill ready');
      var viewUrl = 'pdf-viewer.html?uri=' + encodeURIComponent(result.uri) + '&name=' + encodeURIComponent(filename);
      window.location.href = viewUrl;
    } else {
      alert('Save failed: ' + (result.error || 'Unknown'));
    }
  } catch (err) {
    console.error('Bill error:', err);
    alert('Bill failed: ' + err.message);
  }
}

async function generateStatementPdf(shareOnly) {
  if (typeof PDFService === 'undefined') {
    alert('PDF service not loaded');
    return;
  }
  if (typeof Toast !== 'undefined') Toast.show('Generating statement...');
  
  var entries = Storage.getEntriesForCustomer(currentCustomer.id);
  var balance = Storage.getCustomerBalance(currentCustomer.id);
  
  try {
    var doc = PDFService.generate(currentCustomer, entries, balance);
    if (!doc) { alert('PDF generation failed'); return; }
    
    var safeName = currentCustomer.name.replace(/[^a-zA-Z0-9]/g, '_');
    var filename = 'Hisaab_' + safeName + '_' + new Date().toISOString().split('T')[0] + '.pdf';
    
    if (shareOnly) {
      var shared = await PDFService.shareFile(doc, filename, currentCustomer);
      if (!shared) {
        alert('Share not available');
        Router.go("customer", { id: currentCustomer.id });
      }
      return;
    }
    
    var result = await PDFService.saveToDevice(doc, filename);
    
    if (result && result.success) {
      if (typeof Toast !== 'undefined') Toast.show('Statement ready');
      var viewUrl = 'pdf-viewer.html?uri=' + encodeURIComponent(result.uri) + '&name=' + encodeURIComponent(filename);
      window.location.href = viewUrl;
    } else {
      alert('Save failed: ' + (result.error || 'Unknown'));
    }
  } catch (err) {
    console.error('Statement error:', err);
    alert('Statement failed: ' + err.message);
  }
}



function escA(s) {
  if (!s) return '';
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
