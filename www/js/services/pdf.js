// ==========================================
// HISAAB — PROFESSIONAL PDF SERVICE
// ==========================================

const PDFService = {

  // ============ CUSTOMER STATEMENT ============
  generate(customer, entries, balance) {
    if (!window.jspdf || !window.jspdf.jsPDF) { alert('PDF library not loaded'); return null; }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const W = 210, margin = 15;
    const biz = (typeof Storage !== 'undefined' && Storage.getBusinessInfo) ? Storage.getBusinessInfo() : {};
    
    let y = 0;
    
    // ===== HEADER (Dark Green) =====
    doc.setFillColor(10, 61, 32);
    doc.rect(0, 0, W, 45, 'F');
    
    // Gradient effect — lighter stripe
    doc.setFillColor(15, 90, 46);
    doc.rect(0, 32, W, 13, 'F');
    
    // Shop Name — big & bold
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    const shopName = biz.shopName || 'HISAAB';
    doc.text(shopName.toUpperCase(), margin, 20);
    
    // Address + Contact line
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    let contactLine = '';
    if (biz.address) contactLine += biz.address;
    if (biz.phone) contactLine += (contactLine ? '  |  ' : '') + 'Ph: +91 ' + biz.phone;
    if (contactLine) doc.text(contactLine, margin, 28);
    
    // GSTIN — smaller
    if (biz.gstin) {
      doc.setFontSize(8);
      doc.text('GSTIN: ' + biz.gstin, margin, 41);
    }
    
    // Date (right side)
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    doc.text(today, W - margin, 20, { align: 'right' });
    doc.setFontSize(8);
    doc.text('STATEMENT', W - margin, 28, { align: 'right' });
    
    y = 55;
    
    // ===== CUSTOMER INFO SECTION =====
    doc.setTextColor(10, 61, 32);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('BILL TO', margin, y);
    
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(margin, y + 2, W - margin, y + 2);
    y += 8;
    
    doc.setTextColor(40, 40, 40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(customer.name, margin, y);
    y += 6;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    if (customer.phone) {
      doc.text('Phone: +91 ' + customer.phone, margin, y);
      y += 5;
    }
    y += 4;
    
    // ===== BALANCE CARD =====
    const isPending = balance > 0;
    const isSettled = balance === 0;
    
    // Determine color
    let cardColor = [34, 197, 94]; // green
    let cardLabel = 'ADVANCE PAID';
    if (isPending) { cardColor = [220, 38, 38]; cardLabel = 'PENDING AMOUNT'; }
    else if (isSettled) { cardColor = [107, 114, 128]; cardLabel = 'SETTLED'; }
    
    // Card background
    doc.setFillColor(cardColor[0], cardColor[1], cardColor[2]);
    doc.roundedRect(margin, y, W - 2 * margin, 25, 3, 3, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(cardLabel, margin + 5, y + 8);
    
    doc.setFontSize(24);
    const amountText = 'Rs. ' + Math.abs(balance).toLocaleString('en-IN');
    doc.text(amountText, W - margin - 5, y + 19, { align: 'right' });
    
    y += 32;
    
    // ===== QR CODE SECTION =====
    if (typeof QRService !== 'undefined' && biz.upiId && isPending) {
      try {
        const qrDataUrl = QRService.generateDataURL(
          biz.upiId,
          biz.shopName || biz.ownerName || 'Hisaab',
          Math.abs(balance),
          'Payment from ' + customer.name
        );
        if (qrDataUrl) {
          // QR header
          doc.setTextColor(10, 61, 32);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.text('SCAN TO PAY', margin, y);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(120, 120, 120);
          doc.text('Open any UPI app', W - margin, y, { align: 'right' });
          y += 3;
          
          doc.setDrawColor(220, 220, 220);
          doc.line(margin, y, W - margin, y);
          y += 8;
          
          // QR in a nice box
          const qrSize = 45;
          const qrX = (W - qrSize) / 2;
          doc.setFillColor(250, 250, 250);
          doc.roundedRect(qrX - 4, y - 4, qrSize + 8, qrSize + 12, 2, 2, 'F');
          doc.addImage(qrDataUrl, 'PNG', qrX, y, qrSize, qrSize);
          y += qrSize + 4;
          
          // UPI text
          doc.setTextColor(60, 60, 60);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.text('UPI: ' + biz.upiId, W / 2, y, { align: 'center' });
          y += 12;
        }
      } catch (err) { console.error('QR error:', err); }
    }
    
    // ===== TRANSACTIONS TABLE =====
    doc.setTextColor(10, 61, 32);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('TRANSACTION HISTORY', margin, y);
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
    doc.text('DESCRIPTION', margin + 30, y + 5.5);
    doc.text('AMOUNT', W - margin - 3, y + 5.5, { align: 'right' });
    y += 8;
    
    // Table rows
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const sorted = [...entries].sort((a, b) => b.date - a.date);
    
    if (sorted.length === 0) {
      doc.setTextColor(150, 150, 150);
      doc.text('No transactions yet', margin + 3, y + 6);
      y += 12;
    } else {
      sorted.forEach((e, i) => {
        if (y > 265) { 
          doc.addPage(); 
          y = 20;
          // Repeat table header
          doc.setFillColor(10, 61, 32);
          doc.rect(margin, y, W - 2 * margin, 8, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFont('helvetica', 'bold');
          doc.text('DATE', margin + 3, y + 5.5);
          doc.text('DESCRIPTION', margin + 30, y + 5.5);
          doc.text('AMOUNT', W - margin - 3, y + 5.5, { align: 'right' });
          y += 8;
          doc.setFont('helvetica', 'normal');
        }
        
        // Row background
        if (i % 2 === 0) {
          doc.setFillColor(248, 248, 248);
        } else {
          doc.setFillColor(255, 255, 255);
        }
        doc.rect(margin, y, W - 2 * margin, 8, 'F');
        
        // Date
        doc.setTextColor(60, 60, 60);
        const dateStr = new Date(e.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' });
        doc.setFontSize(8);
        doc.text(dateStr, margin + 3, y + 5);
        
        // Description
        doc.setTextColor(20, 20, 20);
        doc.setFontSize(9);
        let desc = e.type === 'gave' ? 'Given' : 'Received';
        if (e.items && e.items.length > 0) {
          desc += ': ' + e.items.map(it => it.name + (it.qty ? ' ' + it.qty : '')).join(', ');
        } else if (e.note) {
          desc += ' - ' + e.note;
        }
        if (desc.length > 55) desc = desc.substring(0, 52) + '...';
        doc.text(desc, margin + 30, y + 5);
        
        // Amount with color
        doc.setFont('helvetica', 'bold');
        if (e.type === 'gave') doc.setTextColor(220, 38, 38);
        else doc.setTextColor(20, 130, 60);
        const amtText = (e.type === 'gave' ? '+' : '-') + ' Rs. ' + Number(e.amount).toLocaleString('en-IN');
        doc.text(amtText, W - margin - 3, y + 5, { align: 'right' });
        
        doc.setFont('helvetica', 'normal');
        y += 8;
      });
    }
    

    
    // ===== FOOTER =====
    if (y > 260) { doc.addPage(); y = 20; }
    y = Math.max(y + 5, 260);
    
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.line(margin, y, W - margin, y);
    y += 6;
    
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.setFont('helvetica', 'italic');
    doc.text('Thank you for your business!', W / 2, y, { align: 'center' });
    y += 5;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    let footerLine = '';
    if (biz.ownerName) footerLine += 'Owner: ' + biz.ownerName;
    if (biz.upiId) footerLine += (footerLine ? '  |  ' : '') + 'UPI: ' + biz.upiId;
    if (footerLine) doc.text(footerLine, W / 2, y, { align: 'center' });
    y += 4;
    
    doc.setTextColor(160, 160, 160);
    doc.text('This is a computer-generated statement. Generated by Hisaab.', W / 2, y, { align: 'center' });
    
    return doc;
  },

  // ============ SAVE ============
  async saveToDevice(doc, filename) {
    if (!doc) return { success: false, error: 'No PDF' };
    try {
      const pdfBase64 = doc.output('datauristring').split(',')[1];
      if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Filesystem) {
        const FS = window.Capacitor.Plugins.Filesystem;
        try {
          const r = await FS.writeFile({ path: 'Hisaab/' + filename, data: pdfBase64, directory: 'EXTERNAL_STORAGE', recursive: true });
          return { success: true, uri: r.uri, path: 'Downloads/Hisaab/' + filename };
        } catch (e1) {}
        try {
          const r = await FS.writeFile({ path: filename, data: pdfBase64, directory: 'CACHE', recursive: true });
          return { success: true, uri: r.uri, path: 'Cache/' + filename };
        } catch (e2) {}
        try {
          const r = await FS.writeFile({ path: filename, data: pdfBase64, directory: 'DOCUMENTS', recursive: true });
          return { success: true, uri: r.uri, path: 'Documents/' + filename };
        } catch (e3) {}
        return { success: false, error: 'Save failed' };
      }
      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = filename;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      return { success: true, path: 'Downloads/' + filename };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // ============ SHARE ============
  async shareFile(doc, filename, customer) {
    if (!doc) return false;
    try {
      const pdfBase64 = doc.output('datauristring').split(',')[1];
      if (window.Capacitor && window.Capacitor.Plugins) {
        const FS = window.Capacitor.Plugins.Filesystem;
        const Share = window.Capacitor.Plugins.Share;
        if (FS && Share) {
          const r = await FS.writeFile({ path: filename, data: pdfBase64, directory: 'CACHE', recursive: true });
          Share.share({
            title: 'Hisaab Statement',
            text: 'Statement for ' + customer.name,
            url: r.uri,
            dialogTitle: 'Share Statement'
          }).catch(function() {});
          return true;
        }
      }
      return false;
    } catch (err) { return false; }
  },

  // ============ OPEN ============
  async openSaved(uri) {
    if (!uri) return false;
    try {
      if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Share) {
        await window.Capacitor.Plugins.Share.share({
          title: 'PDF',
          url: uri,
          dialogTitle: 'Open with...'
        });
        return true;
      }
    } catch (err) {}
    return false;
  }
};

// ============ BILL / RECEIPT PDF (for single entry) ============
PDFService.generateBill = function(customer, entry, balance) {
  if (!window.jspdf || !window.jspdf.jsPDF) { alert('PDF library not loaded'); return null; }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210, margin = 15;
  let y = 0;
  const biz = (typeof Storage !== 'undefined' && Storage.getBusinessInfo) ? Storage.getBusinessInfo() : {};

  // ===== HEADER =====
  doc.setFillColor(10, 61, 32);
  doc.rect(0, 0, W, 45, 'F');
  doc.setFillColor(15, 90, 46);
  doc.rect(0, 32, W, 13, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text((biz.shopName || 'HISAAB').toUpperCase(), margin, 20);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  var contactLine = '';
  if (biz.address) contactLine += biz.address;
  if (biz.phone) contactLine += (contactLine ? '  |  ' : '') + 'Ph: +91 ' + biz.phone;
  if (contactLine) doc.text(contactLine, margin, 28);
  if (biz.gstin) { doc.setFontSize(8); doc.text('GSTIN: ' + biz.gstin, margin, 41); }

  doc.setFontSize(9);
  doc.text(new Date(entry.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), W - margin, 20, { align: 'right' });
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('BILL', W - margin, 28, { align: 'right' });

  y = 55;

  // ===== BILL TO =====
  doc.setTextColor(10, 61, 32);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('BILL TO', margin, y);
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y + 2, W - margin, y + 2);
  y += 8;

  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(customer.name, margin, y);
  y += 6;
  if (customer.phone) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Phone: +91 ' + customer.phone, margin, y);
    y += 6;
  }
  y += 6;

  // ===== ITEMS TABLE =====
  doc.setTextColor(10, 61, 32);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(entry.type === 'gave' ? 'ITEMS GIVEN' : 'PAYMENT RECEIVED', margin, y);
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y + 2, W - margin, y + 2);
  y += 8;

  // Table header
  doc.setFillColor(10, 61, 32);
  doc.rect(margin, y, W - 2 * margin, 9, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('#', margin + 3, y + 6);
  doc.text('ITEM', margin + 12, y + 6);
  doc.text('QTY', margin + 100, y + 6);
  doc.text('PRICE', margin + 130, y + 6);
  doc.text('TOTAL', W - margin - 3, y + 6, { align: 'right' });
  y += 9;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);

  var items = entry.items || [];
  if (items.length === 0) {
    // Amount-only entry — show generic line
    doc.setFontSize(11);
    doc.text(entry.type === 'gave' ? 'Amount Given' : 'Amount Received', margin + 12, y + 6);
    doc.setFont('helvetica', 'bold');
    doc.text('Rs. ' + Number(entry.amount).toLocaleString('en-IN'), W - margin - 3, y + 6, { align: 'right' });
    y += 10;
  } else {
    items.forEach(function(it, i) {
      if (y > 250) { doc.addPage(); y = 20; }
      if (i % 2 === 0) {
        doc.setFillColor(248, 248, 248);
        doc.rect(margin, y, W - 2 * margin, 9, 'F');
      }
      doc.setFontSize(10);
      doc.text((i + 1).toString(), margin + 3, y + 6);
      doc.text((it.name || '').substring(0, 30), margin + 12, y + 6);
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text((it.qty || '-').substring(0, 12), margin + 100, y + 6);
      doc.text(it.price ? 'Rs. ' + Number(it.price).toLocaleString('en-IN') : '-', margin + 130, y + 6);
      doc.setTextColor(30, 30, 30);
      doc.setFont('helvetica', 'bold');
      doc.text('Rs. ' + Number(it.price || 0).toLocaleString('en-IN'), W - margin - 3, y + 6, { align: 'right' });
      doc.setFont('helvetica', 'normal');
      y += 9;
    });
  }

  // ===== TOTAL BLOCK =====
  y += 4;
  doc.setDrawColor(10, 61, 32);
  doc.setLineWidth(0.5);
  doc.line(W - 90, y, W - margin, y);
  y += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(10, 61, 32);
  doc.text('TOTAL', W - 90, y);
  if (entry.type === 'gave') doc.setTextColor(220, 38, 38);
  else doc.setTextColor(20, 130, 60);
  doc.setFontSize(16);
  doc.text((entry.type === 'gave' ? '' : '-') + 'Rs. ' + Number(entry.amount).toLocaleString('en-IN'), W - margin, y, { align: 'right' });
  y += 8;

  // Payment mode (if got)
  if (entry.type === 'got' && entry.payMode) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Payment Mode: ' + entry.payMode.charAt(0).toUpperCase() + entry.payMode.slice(1), W - margin, y, { align: 'right' });
    y += 6;
  }

  y += 10;

  // ===== QR CODE =====
  if (typeof QRService !== 'undefined' && biz.upiId && entry.type === 'gave') {
    try {
      var qrDataUrl = QRService.generateDataURL(
        biz.upiId,
        biz.shopName || biz.ownerName || 'Hisaab',
        Math.abs(entry.amount),
        'Payment from ' + customer.name
      );
      if (qrDataUrl) {
        // Center QR
        var qrSize = 50;
        var qrX = (W - qrSize) / 2;

        doc.setTextColor(10, 61, 32);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('SCAN TO PAY', W / 2, y, { align: 'center' });
        y += 8;

        // QR box
        doc.setFillColor(250, 250, 250);
        doc.roundedRect(qrX - 5, y - 3, qrSize + 10, qrSize + 10, 3, 3, 'F');
        doc.addImage(qrDataUrl, 'PNG', qrX, y, qrSize, qrSize);
        y += qrSize + 8;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(30, 30, 30);
        doc.text('Scan & pay Rs. ' + Math.abs(entry.amount).toLocaleString('en-IN'), W / 2, y, { align: 'center' });
        y += 5;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text('UPI: ' + biz.upiId, W / 2, y, { align: 'center' });
        y += 10;
      }
    } catch (err) {}
  }

  // ===== NOTE =====
  if (entry.note) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Note: ' + entry.note, W / 2, y, { align: 'center' });
    y += 8;
  }

  // ===== FOOTER =====
  y = Math.max(y + 5, 260);
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(margin, y, W - margin, y);
  y += 6;

  doc.setFontSize(10);
  doc.setTextColor(10, 61, 32);
  doc.setFont('helvetica', 'italic');
  doc.text('Thank you for your business!', W / 2, y, { align: 'center' });
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  if (biz.ownerName) doc.text('Owner: ' + biz.ownerName, W / 2, y, { align: 'center' });
  y += 4;
  doc.setTextColor(160, 160, 160);
  doc.text('Generated by Hisaab', W / 2, y, { align: 'center' });

  return doc;
};
