// HISAAB — ADD CUSTOMER LOGIC

document.addEventListener("DOMContentLoaded", () => {
  const nameEl = document.getElementById("nameInput");
  const phoneEl = document.getElementById("phoneInput");
  const saveBtn = document.getElementById("saveBtn");

  setTimeout(() => nameEl && nameEl.focus(), 100);

  if (phoneEl) {
    phoneEl.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
    });
  }

  if (saveBtn) saveBtn.addEventListener("click", saveCustomer);

  [nameEl, phoneEl].forEach(el => {
    if (el) el.addEventListener("keydown", (e) => {
      if (e.key === "Enter") saveCustomer();
    });
  });
});

function saveCustomer() {
  const name = document.getElementById("nameInput").value.trim();
  const phone = document.getElementById("phoneInput").value.trim();

  const nameErr = document.getElementById("nameError");
  if (!name) {
    showError(nameErr, I18n.t("name_required"));
    return;
  }
  hideError(nameErr);

  const phoneErr = document.getElementById("phoneError");
  if (phone && phone.length !== 10) {
    showError(phoneErr, I18n.t("phone_invalid"));
    return;
  }
  hideError(phoneErr);

  const existing = Storage.getCustomers().find(c => c.name.toLowerCase() === name.toLowerCase() && (c.phone || "") === phone);
  if (existing) {
    if (!confirm("A customer with this name already exists. Add anyway?")) return;
  }

  const customer = {
    id: Storage.newCustomerId(),
    name: name,
    phone: phone,
    createdAt: Date.now(),
    note: ""
  };

  Storage.addCustomer(customer);
  if (typeof Toast !== "undefined") Toast.show(I18n.t("customer_added"));

  setTimeout(() => {
    Router.go("home");
  }, 500);
}

function showError(el, msg) {
  if (!el) return;
  el.textContent = msg;
  el.classList.remove("hidden");
}

function hideError(el) {
  if (!el) return;
  el.classList.add("hidden");
}
