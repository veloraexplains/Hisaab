// HISAAB — PIN LOCK SERVICE

const PinLock = {
  isEnabled() {
    return !!Storage.getPin();
  },

  setPin(pin) {
    if (!/^[0-9]{4}$/.test(pin)) return false;
    Storage.setPin(pin);
    return true;
  },

  verify(pin) {
    return Storage.getPin() === pin;
  },

  disable() {
    Storage.clearPin();
  },

  // Show PIN setup modal (for enabling from settings)
  setupFlow(onComplete) {
    // Navigate to full-screen setup page
    window.location.href = 'setup-pin.html';
  },

  // Change PIN flow
  changeFlow(onComplete) {
    // Simple: ask current PIN then navigate to setup
    var current = prompt("Enter current PIN:");
    if (!this.verify(current)) {
      alert("Wrong PIN");
      return;
    }
    // Navigate to setup for new PIN
    window.location.href = 'setup-pin.html';
  }
};
