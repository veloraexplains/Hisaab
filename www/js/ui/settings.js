// HISAAB — SETTINGS LOGIC

document.addEventListener("DOMContentLoaded", () => {
  updateLanguageLabel();
  updateThemeToggle();
  document.getElementById("resetRow").addEventListener("click", resetAll);
  document.documentElement.lang = I18n.current();
  applyTheme();
});

function updateLanguageLabel() {
  const el = document.getElementById("langValue");
  if (el) el.textContent = I18n.current() === "hi" ? "हिंदी" : "English";
}

function updateThemeToggle() {
  const el = document.getElementById("themeToggle");
  if (!el) return;
  const isLight = Storage.getTheme() === "light";
  el.classList.toggle("on", isLight);
}

function toggleLanguage() {
  const next = I18n.toggle();
  updateLanguageLabel();
  I18n.apply();
  if (typeof Toast !== "undefined") Toast.show(next === "hi" ? "भाषा: हिंदी" : "Language: English");
}

function toggleTheme() {
  const cur = Storage.getTheme();
  const next = cur === "dark" ? "light" : "dark";
  Storage.setTheme(next);
  if (next === "light") document.body.classList.add("light");
  else document.body.classList.remove("light");
  updateThemeToggle();
  if (typeof Toast !== "undefined") Toast.show(next === "light" ? "Light mode" : "Dark mode");
}

function applyTheme() {
  if (Storage.getTheme() === "light") document.body.classList.add("light");
}

function resetAll() {
  if (!confirm(I18n.t("reset_confirm"))) return;
  Storage.clearAll();
  if (typeof Toast !== "undefined") Toast.show("All data cleared");
  setTimeout(() => Router.home(), 800);
}

// ============ PIN LOCK ============
function updatePinToggle() {
  const el = document.getElementById("pinToggle");
  if (!el) return;
  el.classList.toggle("on", PinLock.isEnabled());
}

function togglePinLock() {
  if (PinLock.isEnabled()) {
    if (!confirm("Disable PIN lock?")) return;
    PinLock.disable();
    if (typeof Toast !== "undefined") Toast.show("PIN disabled");
  } else {
    PinLock.setupFlow((success) => {
      if (success && typeof Toast !== "undefined") Toast.show("PIN enabled");
      updatePinToggle();
    });
  }
  updatePinToggle();
}

document.addEventListener("DOMContentLoaded", () => {
  updatePinToggle();
});

// ============ LANGUAGE PICKER ============
function pickLanguage() {
  const langs = I18n.languages;
  const names = I18n.names;
  let msg = 'Choose language:\n\n';
  langs.forEach((code, i) => {
    msg += (i + 1) + '. ' + names[code] + '\n';
  });
  const choice = prompt(msg + '\nEnter number (1-' + langs.length + '):');
  const idx = parseInt(choice) - 1;
  if (idx >= 0 && idx < langs.length) {
    I18n.setLanguage(langs[idx]);
    updateLanguageLabel();
    I18n.apply();
    if (typeof Toast !== 'undefined') Toast.show('Language: ' + names[langs[idx]]);
  }
}

// Update label display
function updateLanguageLabel() {
  const el = document.getElementById('langValue');
  if (el) el.textContent = I18n.currentName();
}

// ============ CSV EXPORT ============
async function exportCSV() {
  if (typeof CSVService === 'undefined') {
    alert('CSV service not loaded');
    return;
  }
  
  if (typeof Toast !== 'undefined') Toast.show('Exporting CSV...');
  
  const result = await CSVService.download();
  
  if (result.success) {
    if (typeof Toast !== 'undefined') Toast.show('Saved: ' + result.path);
  } else {
    alert('Export failed: ' + (result.error || 'Unknown error'));
  }
}

async function shareCSV() {
  if (typeof CSVService === 'undefined') {
    alert('CSV service not loaded');
    return;
  }
  if (typeof Toast !== 'undefined') Toast.show('Preparing share...');
  try {
    await CSVService.share();
    // Silent — no error even if user cancels
  } catch (err) {
    console.log('CSV share ended:', err.message);
  }
}

// ============ CONTACT SUPPORT ============
function contactSupport() {
  var email = 'velora.explains@gmail.com';
  var subject = 'Hisaab Support - v1.0.0';
  var body = 'Hello Hisaab Team,\n\n' +
             'I have a question / issue about Hisaab:\n\n' +
             '(Write here...)\n\n' +
             '---\n' +
             'App Version: 1.0.0\n' +
             'Device: ' + (navigator.userAgent || 'Unknown') + '\n';
  
  var mailtoUrl = 'mailto:' + email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  
  window.location.href = mailtoUrl;
}

// ============ SHOP PROFILE DISPLAY ============
function updateShopProfile() {
  var shopNameEl = document.getElementById('shopNameDisplay');
  var shopSubEl = document.getElementById('shopSubDisplay');
  var avatarEl = document.getElementById('shopAvatar');
  
  if (!shopNameEl) return;
  
  var biz = Storage.getBusinessInfo();
  
  if (biz && biz.shopName && biz.shopName.trim()) {
    shopNameEl.textContent = biz.shopName;
    if (biz.address) {
      shopSubEl.textContent = biz.address;
    } else if (biz.phone) {
      shopSubEl.textContent = 'Ph: ' + biz.phone;
    } else {
      shopSubEl.textContent = 'Tap to edit shop details';
    }
    // Use first letter of shop name as avatar
    avatarEl.textContent = biz.shopName.trim().charAt(0).toUpperCase();
  } else {
    shopNameEl.textContent = 'Set up your shop';
    shopSubEl.textContent = 'Tap to add shop details';
    avatarEl.textContent = '🏪';
  }
}

// Hook into page load
document.addEventListener("DOMContentLoaded", function() {
  updateShopProfile();
  updateLanguageLabel();
  updateThemeToggle();
  updatePinToggle();
});
