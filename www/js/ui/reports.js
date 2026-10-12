// HISAAB — REPORTS (Clean Working Version)

let rangeStart = null;
let rangeEnd = null;
let rangeLabel = 'Today';

document.addEventListener("DOMContentLoaded", () => {
  pickQuickDate(0);
});

function pickQuickDate(daysAgo) {
  const now = new Date();
  
  if (daysAgo === 0) {
    rangeStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime();
    rangeEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0).getTime();
    rangeLabel = 'Today';
  } else if (daysAgo === 1) {
    rangeStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0, 0).getTime();
    rangeEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime();
    rangeLabel = 'Yesterday';
  } else {
    rangeStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo, 0, 0, 0, 0).getTime();
    rangeEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0).getTime();
    rangeLabel = 'Last ' + (daysAgo + 1) + ' days';
  }
  
  const display = document.getElementById('selectedDateDisplay');
  if (display) display.textContent = rangeLabel;
  
  renderReport();
}

function onDateChange() {
  const picker = document.getElementById('datePicker');
  if (!picker || !picker.value) return;
  const parts = picker.value.split('-');
  const y = parseInt(parts[0]);
  const m = parseInt(parts[1]) - 1;
  const d = parseInt(parts[2]);
  
  rangeStart = new Date(y, m, d, 0, 0, 0, 0).getTime();
  rangeEnd = new Date(y, m, d + 1, 0, 0, 0, 0).getTime();
  rangeLabel = new Date(y, m, d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  
  const display = document.getElementById('selectedDateDisplay');
  if (display) display.textContent = rangeLabel;
  
  renderReport();
}

function renderReport() {
  if (rangeStart === null) { pickQuickDate(0); return; }
  
  const allEntries = Storage.getEntries();
  const entries = allEntries.filter(e => e.date >= rangeStart && e.date < rangeEnd);
  
  let given = 0, got = 0;
  const customerSet = new Set();
  
  entries.forEach(e => {
    customerSet.add(e.customerId);
    const amt = Number(e.amount);
    if (e.type === 'gave') given += amt;
    else got += amt;
  });
  
  const net = got - given;
  
  document.getElementById('statCustomers').textContent = customerSet.size;
  document.getElementById('statEntries').textContent = entries.length;
  document.getElementById('statGiven').textContent = '₹' + fmt(given);
  document.getElementById('statReceived').textContent = '₹' + fmt(got);
  
  const netEl = document.getElementById('netAmount');
  const netSub = document.getElementById('netSub');
  if (netEl) {
    netEl.textContent = (net >= 0 ? '+' : '-') + '₹' + fmt(Math.abs(net));
    netEl.style.color = net >= 0 ? '#22C55E' : '#EF4444';
  }
  if (netSub) {
    if (entries.length === 0) netSub.textContent = 'No transactions';
    else if (net > 0) netSub.textContent = 'You received more than you gave';
    else if (net < 0) netSub.textContent = 'You gave more than you received';
    else netSub.textContent = 'Equal';
  }
  
  const transEl = document.getElementById('transactions');
  if (transEl) {
    if (entries.length === 0) {
      transEl.innerHTML = '<div class="empty" style="padding:40px 20px"><div class="empty-icon">📝</div><div class="empty-text">No transactions in this period</div></div>';
    } else {
      const sorted = [...entries].sort((a, b) => b.date - a.date);
      transEl.innerHTML = sorted.map(e => {
        const customer = Storage.getCustomer(e.customerId);
        const name = customer ? customer.name : 'Unknown';
        const isGave = e.type === 'gave';
        const icon = isGave ? '↗' : '↙';
        const date = new Date(e.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        return '<div class="entry-row" onclick="Router.go(\'customer\', {id:\'' + e.customerId + '\'})">' +
          '<div class="entry-icon ' + e.type + '">' + icon + '</div>' +
          '<div class="entry-info">' +
          '<div class="entry-note"><strong>' + escapeHtml(name) + '</strong>' + (e.note ? ' · ' + escapeHtml(e.note) : '') + '</div>' +
          '<div class="entry-date">' + date + '</div>' +
          '</div>' +
          '<div class="entry-amount ' + e.type + '">' + (isGave ? '+' : '-') + '₹' + fmt(e.amount) + '</div>' +
          '</div>';
      }).join('');
    }
  }
  
  const debtors = Storage.getCustomers()
    .map(c => ({ customer: c, balance: Storage.getCustomerBalance(c.id) }))
    .filter(x => x.balance > 0)
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 5);
  
  const debtorsEl = document.getElementById('topDebtors');
  if (debtorsEl) {
    if (debtors.length === 0) {
      debtorsEl.innerHTML = '<p class="text-muted text-center" style="padding:16px">No pending customers</p>';
    } else {
      debtorsEl.innerHTML = debtors.map(({ customer, balance }, i) =>
        '<div class="customer-card" onclick="Router.go(\'customer\', {id:\'' + customer.id + '\'})">' +
        '<div class="customer-avatar" style="background:' + avatarColor(customer.name) + ';font-size:14px">#' + (i + 1) + '</div>' +
        '<div class="customer-info"><div class="customer-name">' + escapeHtml(customer.name) + '</div>' +
        '<div class="customer-phone">' + (customer.phone ? '📱 ' + customer.phone : '') + '</div></div>' +
        '<div class="customer-balance"><div class="customer-amount positive">₹' + fmt(balance) + '</div>' +
        '<div class="customer-label">PENDING</div></div></div>'
      ).join('');
    }
  }
}

async function exportMonthlyPDF() {
  if (typeof Toast !== 'undefined') Toast.show('Generating...');
  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert('PDF library not loaded');
    return;
  }
  
  try {
    const doc = generateReportPDF();
    const filename = 'Hisaab_Report_' + new Date().toISOString().split('T')[0] + '.pdf';
    const result = await PDFService.saveToDevice(doc, filename);
    if (result && result.success && typeof Toast !== 'undefined') {
      Toast.show('Saved: ' + (result.path || filename));
    }
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function shareMonthlyPDF() {
  if (typeof Toast !== 'undefined') Toast.show('Preparing...');
  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert('PDF library not loaded');
    return;
  }
  
  try {
    const doc = generateReportPDF();
    const filename = 'Hisaab_Report_' + new Date().toISOString().split('T')[0] + '.pdf';
    await PDFService.shareFile(doc, filename, { name: 'Report' });
  } catch (err) {
    console.log('Share ended');
  }
}



function fmt(n) { if (!n && n !== 0) return '0'; return Number(n).toLocaleString('en-IN'); }
function escapeHtml(s) { if (!s) return ''; return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function avatarColor(n) { const cols = ['#EF4444','#F59E0B','#10B981','#3B82F6','#8B5CF6','#EC4899','#06B6D4','#F97316']; if (!n) return cols[0]; let s = 0; for (let i = 0; i < n.length; i++) s += n.charCodeAt(i); return cols[s % cols.length]; }


async function exportMonthlyPDF() {
  if (typeof Toast !== 'undefined') Toast.show('Generating...');
  if (!window.jspdf || !window.jspdf.jsPDF) { alert('PDF library not loaded'); return; }
  try {
    const doc = generateReportPDF();
    const filename = 'Hisaab_Report_' + new Date().toISOString().split('T')[0] + '.pdf';
    const result = await PDFService.saveToDevice(doc, filename);
    if (result && result.success) {
      if (typeof Toast !== 'undefined') Toast.show('Saved: ' + (result.path || filename));
      showPdfOptions(result.uri, filename);
    }
  } catch (err) { alert('Error: ' + err.message); }
}

// ============ PDF OPTIONS DIALOG ============




function showPdfOptions(uri, filename) {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop open';
  backdrop.innerHTML = 
    '<div class="modal">' +
    '<div class="modal-title">✅ PDF Ready</div>' +
    '<div class="modal-text">' + filename + '</div>' +
    '<div class="modal-actions" style="flex-direction:column;gap:10px">' +
    '<button class="btn btn-primary btn-full" id="repViewBtn">👁 View PDF</button>' +
    '<button class="btn btn-secondary btn-full" id="repShareBtn">📤 Share PDF</button>' +
    '<button class="btn btn-secondary btn-full" id="repCloseBtn">Close</button>' +
    '</div></div>';
  document.body.appendChild(backdrop);
  
  document.getElementById('repCloseBtn').addEventListener('click', function() { backdrop.remove(); });
  
  document.getElementById('repViewBtn').addEventListener('click', function() {
    backdrop.remove();
    var viewUrl = 'pdf-viewer.html?uri=' + encodeURIComponent(uri) + '&name=' + encodeURIComponent(filename);
    window.location.href = viewUrl;
  });
  
  document.getElementById('repShareBtn').addEventListener('click', function() {
    backdrop.remove();
    if (typeof shareMonthlyPDF === 'function') shareMonthlyPDF();
  });
}

function generateReportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210, margin = 15;
  let y = 0;
  
  const entries = Storage.getEntries().filter(e => e.date >= rangeStart && e.date < rangeEnd);
  const biz = Storage.getBusinessInfo();
  
  let given = 0, got = 0;
  const customerSet = new Set();
  entries.forEach(e => {
    customerSet.add(e.customerId);
    if (e.type === 'gave') given += Number(e.amount);
    else got += Number(e.amount);
  });
  const net = got - given;
  
  // HEADER
  doc.setFillColor(10, 61, 32);
  doc.rect(0, 0, W, 45, 'F');
  doc.setFillColor(15, 90, 46);
  doc.rect(0, 32, W, 13, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text((biz.shopName || 'HISAAB').toUpperCase(), margin, 20);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  let contactLine = '';
  if (biz.address) contactLine += biz.address;
  if (biz.phone) contactLine += (contactLine ? '  |  ' : '') + 'Ph: +91 ' + biz.phone;
  if (contactLine) doc.text(contactLine, margin, 28);
  if (biz.gstin) { doc.setFontSize(8); doc.text('GSTIN: ' + biz.gstin, margin, 41); }
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  doc.text(today, W - margin, 20, { align: 'right' });
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('REPORT', W - margin, 28, { align: 'right' });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(rangeLabel, W - margin, 34, { align: 'right' });
  
  y = 55;
  
  // SUMMARY SECTION
  doc.setTextColor(10, 61, 32);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('SUMMARY', margin, y);
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y + 2, W - margin, y + 2);
  y += 8;
  
  const boxW = (W - 2 * margin - 9) / 4;
  const boxes = [
    { label: 'GIVEN', value: 'Rs. ' + given.toLocaleString('en-IN'), color: [220, 38, 38] },
    { label: 'RECEIVED', value: 'Rs. ' + got.toLocaleString('en-IN'), color: [20, 130, 60] },
    { label: 'NET', value: (net >= 0 ? '+' : '-') + 'Rs. ' + Math.abs(net).toLocaleString('en-IN'), color: net >= 0 ? [20, 130, 60] : [220, 38, 38] },
    { label: 'ENTRIES', value: entries.length.toString(), color: [60, 60, 60] }
  ];
  
  boxes.forEach((b, i) => {
    const x = margin + i * (boxW + 3);
    doc.setFillColor(245, 247, 244);
    doc.roundedRect(x, y, boxW, 22, 2, 2, 'F');
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(b.label, x + 3, y + 6);
    doc.setTextColor(b.color[0], b.color[1], b.color[2]);
    doc.setFontSize(11);
    doc.text(b.value, x + 3, y + 17);
  });
  y += 30;
  
  // STATS LINE
  doc.setTextColor(60, 60, 60);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Active Customers: ' + customerSet.size, margin, y);
  doc.text('Period: ' + rangeLabel, W - margin, y, { align: 'right' });
  y += 12;
  
  // TRANSACTIONS TABLE
  if (entries.length > 0) {
    doc.setTextColor(10, 61, 32);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('TRANSACTIONS', margin, y);
    doc.setDrawColor(220, 220, 220);
    doc.line(margin, y + 2, W - margin, y + 2);
    y += 7;
    
    // Table header
    doc.setFillColor(10, 61, 32);
    doc.rect(margin, y, W - 2 * margin, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('DATE', margin + 3, y + 5.5);
    doc.text('CUSTOMER', margin + 30, y + 5.5);
    doc.text('NOTE', margin + 80, y + 5.5);
    doc.text('AMOUNT', W - margin - 3, y + 5.5, { align: 'right' });
    y += 8;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const sorted = [...entries].sort((a, b) => b.date - a.date);
    sorted.forEach((e, i) => {
      if (y > 265) { doc.addPage(); y = 20; }
      if (i % 2 === 0) doc.setFillColor(248, 248, 248);
      else doc.setFillColor(255, 255, 255);
      doc.rect(margin, y, W - 2 * margin, 7, 'F');
      
      const customer = Storage.getCustomer(e.customerId);
      const name = customer ? customer.name : 'Unknown';
      const date = new Date(e.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      
      doc.setTextColor(60, 60, 60);
      doc.text(date, margin + 3, y + 4.5);
      doc.setTextColor(20, 20, 20);
      doc.text(name.substring(0, 20), margin + 30, y + 4.5);
      doc.text((e.note || '-').substring(0, 18), margin + 80, y + 4.5);
      
      doc.setFont('helvetica', 'bold');
      if (e.type === 'gave') doc.setTextColor(220, 38, 38);
      else doc.setTextColor(20, 130, 60);
      doc.text((e.type === 'gave' ? '+' : '-') + 'Rs.' + Number(e.amount).toLocaleString('en-IN'), W - margin - 3, y + 4.5, { align: 'right' });
      doc.setFont('helvetica', 'normal');
      y += 7;
    });
    
    // Grand total
    y += 3;
    doc.setDrawColor(10, 61, 32);
    doc.setLineWidth(0.4);
    doc.line(margin, y, W - margin, y);
    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(10, 61, 32);
    doc.text('NET POSITION', margin, y);
    if (net >= 0) doc.setTextColor(20, 130, 60);
    else doc.setTextColor(220, 38, 38);
    doc.setFontSize(13);
    doc.text((net >= 0 ? '+' : '-') + 'Rs. ' + Math.abs(net).toLocaleString('en-IN'), W - margin, y, { align: 'right' });
  }
  
  // FOOTER
  y = Math.max(y + 12, 260);
  if (y > 270) { doc.addPage(); y = 260; }
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(margin, y, W - margin, y);
  y += 6;
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.setFont('helvetica', 'italic');
  doc.text('Hisaab — Your Digital Khata', W / 2, y, { align: 'center' });
  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  let footerLine = '';
  if (biz.ownerName) footerLine += 'Owner: ' + biz.ownerName;
  if (biz.upiId) footerLine += (footerLine ? '  |  ' : '') + 'UPI: ' + biz.upiId;
  if (footerLine) doc.text(footerLine, W / 2, y, { align: 'center' });
  y += 4;
  doc.setTextColor(160, 160, 160);
  doc.text('Computer-generated report', W / 2, y, { align: 'center' });
  
  return doc;
}
