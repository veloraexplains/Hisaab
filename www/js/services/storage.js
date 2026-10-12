// ==========================================
// HISAAB — STORAGE SERVICE
// All localStorage access goes through here.
// Key prefix: hisaab_
// ==========================================

const Storage = {
  // ---------- Low-level ----------
  get(key, defaultVal = null) {
    try {
      const v = localStorage.getItem('hisaab_' + key);
      return v !== null ? JSON.parse(v) : defaultVal;
    } catch (e) {
      console.error('Storage.get error:', e);
      return defaultVal;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem('hisaab_' + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage.set error:', e);
      if (e.name === 'QuotaExceededError') {
        alert('Phone storage full. Please delete old entries.');
      }
      return false;
    }
  },

  remove(key) {
    try { localStorage.removeItem('hisaab_' + key); return true; }
    catch (e) { return false; }
  },

  // ---------- Customers ----------
  getCustomers() {
    return this.get('customers', []);
  },

  saveCustomers(list) {
    return this.set('customers', list);
  },

  addCustomer(customer) {

    const list = this.getCustomers();
    list.push(customer);
    return this.saveCustomers(list);
  },

  updateCustomer(id, updates) {
    const list = this.getCustomers();
    const idx = list.findIndex(c => c.id === id);
    if (idx === -1) return false;
    list[idx] = { ...list[idx], ...updates };
    return this.saveCustomers(list);
  },

  getCustomer(id) {
    return this.getCustomers().find(c => c.id === id) || null;
  },

  deleteCustomer(id) {
    // Remove customer
    const customers = this.getCustomers().filter(c => c.id !== id);
    this.saveCustomers(customers);

    // Remove all their entries
    const entries = this.getEntries().filter(e => e.customerId !== id);
    this.saveEntries(entries);

    return true;
  },

  // ---------- Entries ----------
  getEntries() {
    return this.get('entries', []);
  },

  saveEntries(list) {
    return this.set('entries', list);
  },

  addEntry(entry) {
    const list = this.getEntries();
    list.push(entry);
    return this.saveEntries(list);
  },

  getEntriesForCustomer(customerId) {
    return this.getEntries()
      .filter(e => e.customerId === customerId)
      .sort((a, b) => b.date - a.date);
  },

  deleteEntry(entryId) {
    const entries = this.getEntries().filter(e => e.id !== entryId);
    return this.saveEntries(entries);
  },

  // ---------- Calculations ----------
  getCustomerBalance(customerId) {
    const entries = this.getEntriesForCustomer(customerId);
    let bal = 0;
    entries.forEach(e => {
      if (e.type === 'gave') bal += Number(e.amount);
      else if (e.type === 'got') bal -= Number(e.amount);
      else if (e.type === 'return') bal -= Number(e.amount);
    });
    return bal;
  },

  getTotalPending() {
    const customers = this.getCustomers();
    let total = 0;
    customers.forEach(c => {
      const bal = this.getCustomerBalance(c.id);
      if (bal > 0) total += bal;
    });
    return total;
  },

  // ---------- Settings ----------
  getLanguage() {
    return this.get('language', 'en');
  },
  setLanguage(lang) {
    return this.set('language', lang);
  },

  getTheme() {
    return this.get('theme', 'dark');
  },
  setTheme(theme) {
    return this.set('theme', theme);
  },

  getPin() {
    return this.get('pin', null);
  },
  setPin(pin) {
    return this.set('pin', pin);
  },
  clearPin() {
    return this.remove('pin');
  },

  getInstallDate() {
    let d = this.get('install_date', null);
    if (!d) {
      d = Date.now();
      this.set('install_date', d);
    }
    return d;
  },

  getLastBackup() {
    return this.get('last_backup', null);
  },
  setLastBackup() {
    return this.set('last_backup', Date.now());
  },

  // ---------- ID Generation ----------
  newCustomerId() {
    return 'c_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
  },

  newEntryId() {
    return 'e_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
  },

  // ---------- Data Management ----------
  getAll() {
    return {
      customers: this.getCustomers(),
      entries: this.getEntries()
    };
  },

  replaceAll(data) {
    if (!data || !Array.isArray(data.customers) || !Array.isArray(data.entries)) {
      return false;
    }
    this.saveCustomers(data.customers);
    this.saveEntries(data.entries);
    return true;
  },

  clearAll() {
    const keys = ['customers', 'entries'];
    keys.forEach(k => this.remove(k));
    return true;
  }
};

// ============ BUSINESS INFO ============
Storage.getBusinessInfo = function() {
  return this.get('business_info', {
    shopName: '',
    ownerName: '',
    phone: '',
    address: '',
    upiId: '',
    gstin: ''
  });
};

Storage.setBusinessInfo = function(info) {
  return this.set('business_info', info);
};
