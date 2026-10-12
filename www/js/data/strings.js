// ==========================================
// HISAAB — STRINGS (Hindi + English)
// ==========================================

const STRINGS = {
  // App
  app_name:           { en: 'Hisaab',                hi: 'हिसाब' },
  app_tagline:        { en: 'Your Digital Khata',    hi: 'आपका डिजिटल खाता' },

  // Splash / Setup
  loading:            { en: 'Loading...',            hi: 'लोड हो रहा है...' },
  enter_pin:          { en: 'Enter PIN',             hi: 'पिन डालें' },
  set_pin:            { en: 'Set 4-digit PIN',       hi: '4 अंकों का पिन सेट करें' },
  confirm_pin:        { en: 'Confirm PIN',           hi: 'पिन दोबारा डालें' },
  wrong_pin:          { en: 'Wrong PIN',             hi: 'गलत पिन' },
  pin_mismatch:       { en: 'PINs do not match',     hi: 'पिन मेल नहीं खाते' },
  pin_set_success:    { en: 'PIN set successfully',  hi: 'पिन सेट हो गया' },

  // Home
  home:               { en: 'Home',                  hi: 'होम' },
  customers:          { en: 'Customers',             hi: 'ग्राहक' },
  total_pending:      { en: 'Total Pending',         hi: 'कुल बकाया' },
  no_customers:       { en: 'No customers yet',      hi: 'अभी कोई ग्राहक नहीं' },
  no_customers_hint:  { en: 'Tap + to add your first customer', hi: 'पहला ग्राहक जोड़ने के लिए + दबाएँ' },
  search_customers:   { en: 'Search customers...',   hi: 'ग्राहक खोजें...' },
  no_results:         { en: 'No results found',      hi: 'कुछ नहीं मिला' },
  you_gave:           { en: 'You gave',              hi: 'आपने दिया' },
  you_got:            { en: 'You got',               hi: 'आपको मिला' },
  pending:            { en: 'Pending',               hi: 'बाकी' },
  settled:            { en: 'Settled',               hi: 'हिसाब बराबर' },
  advance:            { en: 'Advance',               hi: 'एडवांस' },

  // Customer detail
  customer:           { en: 'Customer',              hi: 'ग्राहक' },
  ledger:             { en: 'Ledger',                hi: 'खाता' },
  no_entries:         { en: 'No entries yet',        hi: 'अभी कोई एंट्री नहीं' },
  no_entries_hint:    { en: 'Tap + to add first entry', hi: 'पहली एंट्री जोड़ने के लिए + दबाएँ' },
  call:               { en: 'Call',                  hi: 'कॉल' },
  whatsapp:           { en: 'WhatsApp',              hi: 'व्हाट्सएप' },
  edit_customer:      { en: 'Edit Customer',         hi: 'ग्राहक बदलें' },
  delete_customer:    { en: 'Delete Customer',       hi: 'ग्राहक हटाएँ' },
  delete_customer_confirm: { en: 'Delete this customer and all their entries?', hi: 'इस ग्राहक और उनकी सभी एंट्रियां हटाएँ?' },

  // Add customer
  add_customer:       { en: 'Add Customer',          hi: 'ग्राहक जोड़ें' },
  name:               { en: 'Name',                  hi: 'नाम' },
  phone:              { en: 'Phone',                 hi: 'फोन' },
  phone_optional:     { en: 'Phone (optional)',      hi: 'फोन (वैकल्पिक)' },
  name_required:      { en: 'Name is required',      hi: 'नाम ज़रूरी है' },
  phone_invalid:      { en: 'Phone must be 10 digits', hi: 'फोन 10 अंकों का होना चाहिए' },
  save:               { en: 'Save',                  hi: 'सेव करें' },
  cancel:             { en: 'Cancel',                hi: 'रद्द करें' },
  customer_added:     { en: 'Customer added',        hi: 'ग्राहक जोड़ा गया' },
  customer_updated:   { en: 'Customer updated',      hi: 'ग्राहक अपडेट हुआ' },
  customer_deleted:   { en: 'Customer deleted',      hi: 'ग्राहक हटाया गया' },

  // Add entry
  add_entry:          { en: 'Add Entry',             hi: 'एंट्री जोड़ें' },
  gave_money:         { en: 'You Gave',              hi: 'आपने दिया' },
  got_money:          { en: 'You Got',               hi: 'आपको मिला' },
  amount:             { en: 'Amount',                hi: 'रकम' },
  amount_invalid:     { en: 'Enter a valid amount',  hi: 'सही रकम डालें' },
  note:               { en: 'Note (optional)',       hi: 'नोट (वैकल्पिक)' },
  date:               { en: 'Date',                  hi: 'तारीख' },
  entry_saved:        { en: 'Entry saved',           hi: 'एंट्री सेव हुई' },
  entry_deleted:      { en: 'Entry deleted',         hi: 'एंट्री हटाई' },
  delete_entry_confirm: { en: 'Delete this entry?',  hi: 'यह एंट्री हटाएँ?' },

  // WhatsApp reminder
  reminder_title:     { en: 'Send Reminder',         hi: 'रिमाइंडर भेजें' },
  reminder_message:   { en: 'Hello {name}, your pending amount is ₹{amount}. Please pay when convenient. Thank you!', hi: 'नमस्ते {name}, आपका बकाया ₹{amount} है। सुविधा अनुसार भुगतान करें। धन्यवाद!' },
  reminder_sent:      { en: 'Opening WhatsApp...',   hi: 'व्हाट्सएप खोल रहे हैं...' },

  // Settings
  settings:           { en: 'Settings',              hi: 'सेटिंग्स' },
  language:           { en: 'Language',              hi: 'भाषा' },
  english:            { en: 'English',               hi: 'अंग्रेज़ी' },
  hindi:              { en: 'Hindi',                 hi: 'हिंदी' },
  theme:              { en: 'Theme',                 hi: 'थीम' },
  dark:               { en: 'Dark',                  hi: 'डार्क' },
  light:              { en: 'Light',                 hi: 'लाइट' },
  security:           { en: 'Security',              hi: 'सुरक्षा' },
  pin_lock:           { en: 'PIN Lock',              hi: 'पिन लॉक' },
  change_pin:         { en: 'Change PIN',            hi: 'पिन बदलें' },
  data:               { en: 'Data',                  hi: 'डेटा' },
  backup:             { en: 'Backup',                hi: 'बैकअप' },
  backup_now:         { en: 'Backup Now',            hi: 'अभी बैकअप करें' },
  restore:            { en: 'Restore',               hi: 'रीस्टोर करें' },
  reset_all:          { en: 'Reset All Data',        hi: 'सारा डेटा मिटाएँ' },
  reset_confirm:      { en: 'This will delete ALL your data permanently. Continue?', hi: 'इससे आपका सारा डेटा हमेशा के लिए मिट जाएगा। जारी रखें?' },
  about:              { en: 'About',                 hi: 'ऐप के बारे में' },
  version:            { en: 'Version',               hi: 'वर्ज़न' },
  made_with_love:     { en: 'Made with love in India', hi: 'भारत में प्यार से बनाया' },

  // Backup
  backup_title:       { en: 'Backup & Restore',      hi: 'बैकअप और रीस्टोर' },
  backup_desc:        { en: 'Save your data to a file so you never lose it.', hi: 'अपना डेटा फ़ाइल में सेव करें ताकि कभी न खोए।' },
  backup_success:     { en: 'Backup saved successfully', hi: 'बैकअप सेव हो गया' },
  backup_failed:      { en: 'Backup failed',         hi: 'बैकअप नहीं हुआ' },
  restore_desc:       { en: 'Restore data from a backup file', hi: 'बैकअप फ़ाइल से डेटा रीस्टोर करें' },
  restore_success:    { en: 'Data restored successfully', hi: 'डेटा रीस्टोर हो गया' },
  restore_failed:     { en: 'Restore failed. Invalid file.', hi: 'रीस्टोर नहीं हुआ। गलत फ़ाइल।' },
  last_backup:        { en: 'Last backup',           hi: 'पिछला बैकअप' },
  never:              { en: 'Never',                 hi: 'कभी नहीं' },

  // Toasts / Alerts
  saved:              { en: 'Saved',                 hi: 'सेव हो गया' },
  deleted:            { en: 'Deleted',               hi: 'हटा दिया' },
  error:              { en: 'Something went wrong',  hi: 'कुछ गड़बड़ हो गई' },
  ok:                 { en: 'OK',                    hi: 'ठीक है' },
  skip:               { en: 'Skip',                  hi: 'छोड़ें' },
  yes:                { en: 'Yes',                   hi: 'हाँ' },
  no:                 { en: 'No',                    hi: 'नहीं' },
  confirm:            { en: 'Confirm',               hi: 'पुष्टि करें' },
  back:               { en: 'Back',                  hi: 'वापस' },

  // Home hero
  good_morning:       { en: 'Good Morning',          hi: 'सुप्रभात' },
  good_afternoon:     { en: 'Good Afternoon',        hi: 'नमस्ते' },
  good_evening:       { en: 'Good Evening',          hi: 'शुभ संध्या' },
  your_khata:         { en: 'Your Khata',            hi: 'आपका खाता' },

  // Empty
  no_data:            { en: 'No data',               hi: 'कोई डेटा नहीं' },
  tap_to_add:         { en: 'Tap to add',            hi: 'जोड़ने के लिए दबाएँ' },
};

// Helper: get string in current language
function t(key) {
  const s = STRINGS[key];
  if (!s) return key;
  const lang = (typeof Storage !== 'undefined') ? Storage.getLanguage() : 'en';
  return s[lang] || s.en || key;
}

// Helper: apply all data-i18n attributes on page
function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = val;
    } else {
      el.textContent = val;
    }
  });
}

// ============ BUSINESS INFO STRINGS ============
const BUSINESS_STRINGS = {
  business_info:   { en: "Business Info",       hi: "व्यापार जानकारी" },
  shop_name:       { en: "Shop Name",           hi: "दुकान का नाम" },
  owner_name:      { en: "Owner Name",          hi: "मालिक का नाम" },
  business_phone:  { en: "Business Phone",      hi: "व्यापार फोन" },
  business_address:{ en: "Address",             hi: "पता" },
  upi_id:          { en: "UPI ID",              hi: "UPI आईडी" },
  gstin:           { en: "GSTIN (optional)",    hi: "GSTIN (वैकल्पिक)" },
  save_business:   { en: "Save",                hi: "सेव करें" },
  business_saved:  { en: "Business info saved", hi: "जानकारी सेव हो गई" },
  business_hint:   { en: "Shown on PDF statements", hi: "PDF पर दिखाई देगा" }
};

Object.assign(STRINGS, BUSINESS_STRINGS);
