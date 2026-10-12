// HISAAB — UPI PAYMENT SERVICE
const UPIService = {
  isConfigured() {
    const biz = Storage.getBusinessInfo();
    return !!(biz && biz.upiId && biz.upiId.length > 3);
  },
  generateLink(upiId, payeeName, amount, note) {
    const pa = encodeURIComponent(upiId);
    const pn = encodeURIComponent(payeeName || 'Hisaab');
    const am = Number(amount).toFixed(2);
    const cu = 'INR';
    const tn = encodeURIComponent(note || 'Khata Payment');
    return 'upi://pay?pa=' + pa + '&pn=' + pn + '&am=' + am + '&cu=' + cu + '&tn=' + tn;
  },
  generateForCustomer(customer, balance) {
    if (!this.isConfigured()) return null;
    const biz = Storage.getBusinessInfo();
    return this.generateLink(biz.upiId, biz.shopName || biz.ownerName, Math.abs(balance), 'Payment from ' + customer.name);
  },
  openPayment(customer, balance) {
    const link = this.generateForCustomer(customer, balance);
    if (!link) { alert(I18n.t('no_upi_set')); return false; }
    window.location.href = link;
    return true;
  },
  generateReminderMessage(customer, balance) {
    const biz = Storage.getBusinessInfo();
    const amount = Math.abs(balance);
    if (this.isConfigured()) {
      const upiLink = this.generateForCustomer(customer, balance);
      return 'Hello ' + customer.name + ',\n\nYour pending amount is Rs. ' + amount + '.\n\nPay now via UPI:\n' + upiLink + '\n\nThank you!\n- ' + (biz.shopName || biz.ownerName || 'Hisaab');
    }
    return 'Hello ' + customer.name + ', your pending amount is Rs. ' + amount + '.';
  }
};
