// ==========================================
// HISAAB — INTERNATIONALIZATION
// Supports: English (en), Hindi (hi), Tamil (ta), Telugu (te), Marathi (mr)
// ==========================================

const I18n = {
  languages: ['en', 'hi', 'ta', 'te', 'mr'],
  
  names: {
    en: 'English',
    hi: 'हिंदी',
    ta: 'தமிழ்',
    te: 'తెలుగు',
    mr: 'मराठी'
  },
  
  current() {
    return (typeof Storage !== 'undefined') ? Storage.getLanguage() : 'en';
  },
  
  setLanguage(lang) {
    if (!this.languages.includes(lang)) return false;
    if (typeof Storage !== 'undefined') Storage.setLanguage(lang);
    document.documentElement.lang = lang;
    this.apply();
    return true;
  },
  
  // Cycle through languages
  next() {
    const cur = this.current();
    const idx = this.languages.indexOf(cur);
    const nextLang = this.languages[(idx + 1) % this.languages.length];
    this.setLanguage(nextLang);
    return nextLang;
  },
  
  t(key) {
    if (typeof STRINGS === 'undefined') return key;
    const s = STRINGS[key];
    if (!s) return key;
    const lang = this.current();
    return s[lang] || s.en || key;
  },
  
  currentName() {
    return this.names[this.current()] || 'English';
  },
  
  apply() {
    if (typeof document === 'undefined') return;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = this.t(key);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = val;
      } else {
        el.textContent = val;
      }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = this.t(key);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      el.title = this.t(key);
    });
  },
  
  init() {
    document.documentElement.lang = this.current();
    this.apply();
  }
};

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    I18n.init();
  });
}
