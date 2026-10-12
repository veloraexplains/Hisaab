// ==========================================
// HISAAB — QR CODE GENERATOR
// ==========================================

const QRService = {

  // Generate QR code as a PNG data URL (base64)
  generateDataURL(upiId, payeeName, amount, note) {
    if (typeof qrcode === 'undefined') {
      console.error('QR library not loaded');
      return null;
    }
    
    // UPI payment link
    const pa = encodeURIComponent(upiId);
    const pn = encodeURIComponent(payeeName || 'Hisaab');
    const am = Number(amount).toFixed(2);
    const cu = 'INR';
    const tn = encodeURIComponent(note || 'Khata Payment');
    const upiUrl = `upi://pay?pa=${pa}&pn=${pn}&am=${am}&cu=${cu}&tn=${tn}`;
    
    // Generate QR
    const qr = qrcode(0, 'M');
    qr.addData(upiUrl);
    qr.make();
    
    // Get as PNG data URL
    const size = 10; // module size
    const margin = 8;
    return qr.createDataURL(size, margin);
  },
  
  // Get UPI link for a customer
  getUpiLinkForCustomer(customer, balance) {
    if (typeof UPIService === 'undefined' || !UPIService.isConfigured()) return null;
    const biz = Storage.getBusinessInfo();
    const amount = Math.abs(balance);
    const pa = encodeURIComponent(biz.upiId);
    const pn = encodeURIComponent(biz.shopName || biz.ownerName || 'Hisaab');
    const am = amount.toFixed(2);
    const cu = 'INR';
    const tn = encodeURIComponent('Payment from ' + customer.name);
    return `upi://pay?pa=${pa}&pn=${pn}&am=${am}&cu=${cu}&tn=${tn}`;
  },

  // Get UPI payment URL for a customer
  getUpiUrl(customer, balance) {
    const biz = Storage.getBusinessInfo();
    const pa = encodeURIComponent(biz.upiId);
    const pn = encodeURIComponent(biz.shopName || biz.ownerName || 'Hisaab');
    const am = Math.abs(balance).toFixed(2);
    const cu = 'INR';
    const tn = encodeURIComponent('Payment from ' + customer.name);
    return `upi://pay?pa=${pa}&pn=${pn}&am=${am}&cu=${cu}&tn=${tn}`;
  }
};
