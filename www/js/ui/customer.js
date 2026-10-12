// HISAAB — CUSTOMER PAGE LOGIC (CLEAN v2)

let currentCustomer = null;

document.addEventListener("DOMContentLoaded", () => {
  const id = Router.param("id");
  if (!id) { Router.home(); return; }
  currentCustomer = Storage.getCustomer(id);
  if (!currentCustomer) { Router.home(); return; }
  renderCustomer();
  renderEntries();
  renderPaymentChart();
});

function renderCustomer() {
  const c = currentCustomer;
  document.title = c.name + " - Hisaab";
  document.getElementById("customerName").textContent = c.name;
  const bal = Storage.getCustomerBalance(c.id);
  const label = document.getElementById("balanceLabel");
  const amount = document.getElementById("balanceAmount");
  const sub = document.getElementById("balanceSub");
  const card = document.getElementById("balanceCard");
  amount.textContent = "₹" + formatAmount(Math.abs(bal));
  if (bal > 0) {
    label.textContent = "PENDING";
    sub.textContent = c.name + " owes you";
    card.style.background = "linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)";
  } else if (bal < 0) {
    label.textContent = "ADVANCE";
    sub.textContent = "You owe " + c.name;
    card.style.background = "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)";
  } else {
    label.textContent = "SETTLED";
    sub.textContent = "No pending balance";
    card.style.background = "linear-gradient(135deg, #6B7280 0%, #4B5563 100%)";
  }
}

function renderEntries() {
  const container = document.getElementById("entryList");
  const entries = Storage.getEntriesForCustomer(currentCustomer.id);
  if (entries.length === 0) {
    container.innerHTML = '<div class="empty"><div class="empty-icon">📝</div><div class="empty-text">No entries yet</div><div class="empty-hint">Tap + to add first entry</div></div>';
    return;
  }
  container.innerHTML = entries.map(e => {
    const isGave = e.type === "gave";
    const isGot = e.type === "got";
    const isReturn = e.type === "return";
    
    let icon, color;
    if (isGave) { icon = "↗"; color = "gave"; }
    else if (isGot) { icon = "↙"; color = "got"; }
    else { icon = "↩"; color = "return"; }
    
    const date = new Date(e.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
    
    // Build description
    let desc = '';
    if (e.items && e.items.length > 0) {
      desc = e.items.map(it => it.name + (it.qty ? ' ' + it.qty : '')).join(', ');
    } else if (e.note) {
      desc = e.note;
    } else {
      desc = isGave ? 'You gave' : (isGot ? 'You got' : 'Returned');
    }
    if (desc.length > 60) desc = desc.substring(0, 57) + '...';
    
    let amtPrefix = isGave ? '+' : '-';
    let amtClass = isGave ? 'gave' : (isGot ? 'got' : 'return');
    
    return '<div class="entry-row" ondblclick="deleteEntry(\'' + e.id + '\')"><div class="entry-icon ' + color + '">' + icon + '</div><div class="entry-info"><div class="entry-note">' + escapeHtml(desc) + '</div><div class="entry-date">' + date + (e.payMode ? ' · ' + e.payMode.toUpperCase() : '') + '</div></div><div class="entry-amount ' + amtClass + '">' + amtPrefix + '₹' + formatAmount(e.amount) + '</div></div>';
  }).join("");
}

function addEntry() {
  Router.go("add-entry", { id: currentCustomer.id });
}

function callCustomer() {
  if (!currentCustomer.phone) { alert("No phone number saved"); return; }
  window.location.href = "tel:" + currentCustomer.phone;
}

function sendWhatsApp() {
  const bal = Storage.getCustomerBalance(currentCustomer.id);
  if (bal <= 0) { alert("No pending amount to remind"); return; }
  const phone = currentCustomer.phone;
  if (!phone) { alert("No phone number saved"); return; }
  let msg = "Hello " + currentCustomer.name + ", your pending amount is ₹" + bal + ".";
  if (typeof UPIService !== "undefined" && UPIService.generateReminderMessage) {
    msg = UPIService.generateReminderMessage(currentCustomer, bal);
  }
  const url = "https://wa.me/91" + phone + "?text=" + encodeURIComponent(msg);
  window.open(url, "_blank");
}

function confirmDelete() {
  if (!confirm("Delete this customer and all entries?")) return;
  Storage.deleteCustomer(currentCustomer.id);
  if (typeof Toast !== "undefined") Toast.show("Customer deleted");
  setTimeout(() => Router.home(), 400);
}

function deleteEntry(entryId) {
  if (!confirm("Delete this entry?")) return;
  Storage.deleteEntry(entryId);
  renderEntries();
  renderCustomer();
}



async function sharePDF() {
  if (!currentCustomer) return;
  if (typeof PDFService === "undefined") { alert("PDF service not loaded"); return; }
  if (typeof Toast !== "undefined") Toast.show("Preparing...");
  const entries = Storage.getEntriesForCustomer(currentCustomer.id);
  const balance = Storage.getCustomerBalance(currentCustomer.id);
  try {
    const doc = PDFService.generate(currentCustomer, entries, balance);
    if (!doc) { alert("PDF generation failed"); return; }
    const safeName = currentCustomer.name.replace(/[^a-zA-Z0-9]/g, "_");
    const filename = "Hisaab_" + safeName + "_" + new Date().toISOString().split("T")[0] + ".pdf";
    await PDFService.shareFile(doc, filename, currentCustomer);
  } catch (err) {
    console.log("Share ended:", err.message);
  }
}

function payNow() {
  if (!currentCustomer) return;
  const bal = Storage.getCustomerBalance(currentCustomer.id);
  if (bal <= 0) { alert("No pending amount"); return; }
  if (typeof UPIService === "undefined") { alert("UPI service not loaded"); return; }
  if (!UPIService.isConfigured()) {
    if (confirm("UPI ID not set. Go to Business Info?")) Router.go("business-info");
    return;
  }
  UPIService.openPayment(currentCustomer, bal);
}

function renderPaymentChart() {
  const container = document.getElementById("paymentChart");
  if (!container) return;
  const entries = Storage.getEntriesForCustomer(currentCustomer.id);
  if (entries.length === 0) {
    container.innerHTML = '<p class="text-muted text-center" style="padding:20px">No transactions yet</p>';
    return;
  }
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      label: d.toLocaleDateString("en-IN", { month: "short" }),
      start: d.getTime(),
      end: new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime(),
      gave: 0, got: 0
    });
  }
  entries.forEach(e => {
    const m = months.find(x => e.date >= x.start && e.date < x.end);
    if (m) {
      if (e.type === "gave") m.gave += Number(e.amount);
      else m.got += Number(e.amount);
    }
  });
  const maxVal = Math.max(...months.map(m => Math.max(m.gave, m.got)), 100);
  const chartHeight = 120;
  container.innerHTML = '<div class="chart-legend"><div class="legend-item"><span class="legend-dot" style="background:#EF4444"></span>Given</div><div class="legend-item"><span class="legend-dot" style="background:#22C55E"></span>Received</div></div><div class="chart-bars">' +
    months.map(m => {
      const gaveH = (m.gave / maxVal) * chartHeight;
      const gotH = (m.got / maxVal) * chartHeight;
      return '<div class="chart-bar-group"><div class="chart-bars-pair"><div class="chart-bar gave" style="height:' + gaveH + 'px"></div><div class="chart-bar got" style="height:' + gotH + 'px"></div></div><div class="chart-label">' + m.label + '</div></div>';
    }).join('') + '</div>';
}

function formatAmount(n) { if (!n && n !== 0) return "0"; return Number(n).toLocaleString("en-IN"); }
function escapeHtml(s) { if (!s) return ""; return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
function initials(n) { if (!n) return "?"; const p = n.trim().split(" "); return ((p[0] ? p[0][0] : "") + (p[1] ? p[1][0] : "")).toUpperCase() || "?"; }
function avatarColor(n) { const cols = ["#EF4444","#F59E0B","#10B981","#3B82F6","#8B5CF6","#EC4899","#06B6D4","#F97316"]; if (!n) return cols[0]; let s = 0; for (let i = 0; i < n.length; i++) s += n.charCodeAt(i); return cols[s % cols.length]; }


// ============ CUSTOMER PDF (WITH DIALOG) ============
async function generatePDF() {
  if (!currentCustomer) return;
  if (typeof PDFService === 'undefined') { alert('PDF service not loaded'); return; }
  if (typeof Toast !== 'undefined') Toast.show('Generating PDF...');
  
  const entries = Storage.getEntriesForCustomer(currentCustomer.id);
  const balance = Storage.getCustomerBalance(currentCustomer.id);
  
  try {
    const doc = PDFService.generate(currentCustomer, entries, balance);
    if (!doc) { alert('PDF generation failed'); return; }
    
    const safeName = currentCustomer.name.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = 'Hisaab_' + safeName + '_' + new Date().toISOString().split('T')[0] + '.pdf';
    
    const result = await PDFService.saveToDevice(doc, filename);
    
    if (result && result.success) {
      if (typeof Toast !== 'undefined') Toast.show('Saved: ' + (result.path || filename));
      showCustomerPdfOptions(result.uri, filename);
    } else {
      alert('Save failed: ' + (result.error || 'Unknown'));
    }
  } catch (err) {
    console.error('PDF error:', err);
    alert('PDF failed: ' + err.message);
  }
}






function showCustomerPdfOptions(uri, filename) {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop open';
  backdrop.innerHTML = 
    '<div class="modal">' +
    '<div class="modal-title">✅ PDF Ready</div>' +
    '<div class="modal-text">' + filename + '</div>' +
    '<div class="modal-actions" style="flex-direction:column;gap:10px">' +
    '<button class="btn btn-primary btn-full" id="custViewBtn">👁 View PDF</button>' +
    '<button class="btn btn-secondary btn-full" id="custShareBtn">📤 Share PDF</button>' +
    '<button class="btn btn-secondary btn-full" id="custCloseBtn">Close</button>' +
    '</div></div>';
  document.body.appendChild(backdrop);
  
  document.getElementById('custCloseBtn').addEventListener('click', function() { backdrop.remove(); });
  
  document.getElementById('custViewBtn').addEventListener('click', function() {
    backdrop.remove();
    var viewUrl = 'pdf-viewer.html?uri=' + encodeURIComponent(uri) + '&name=' + encodeURIComponent(filename);
    window.location.href = viewUrl;
  });
  
  document.getElementById('custShareBtn').addEventListener('click', function() {
    backdrop.remove();
    if (typeof sharePDF === 'function') sharePDF();
  });
}