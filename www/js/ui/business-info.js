// HISAAB — BUSINESS INFO LOGIC

document.addEventListener("DOMContentLoaded", () => {
  loadBusinessInfo();
  
  // Auto-format phone (digits only)
  const phone = document.getElementById("bizPhone");
  if (phone) {
    phone.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
    });
  }
  
  // Uppercase GSTIN
  const gstin = document.getElementById("bizGstin");
  if (gstin) {
    gstin.addEventListener("input", (e) => {
      e.target.value = e.target.value.toUpperCase().slice(0, 15);
    });
  }
});

function loadBusinessInfo() {
  const info = Storage.getBusinessInfo();
  document.getElementById("shopName").value = info.shopName || "";
  document.getElementById("ownerName").value = info.ownerName || "";
  document.getElementById("bizPhone").value = info.phone || "";
  document.getElementById("bizAddress").value = info.address || "";
  document.getElementById("bizUpi").value = info.upiId || "";
  document.getElementById("bizGstin").value = info.gstin || "";
}

function saveBusiness() {
  const info = {
    shopName: document.getElementById("shopName").value.trim(),
    ownerName: document.getElementById("ownerName").value.trim(),
    phone: document.getElementById("bizPhone").value.trim(),
    address: document.getElementById("bizAddress").value.trim(),
    upiId: document.getElementById("bizUpi").value.trim(),
    gstin: document.getElementById("bizGstin").value.trim()
  };
  
  Storage.setBusinessInfo(info);
  
  if (typeof Toast !== "undefined") Toast.show(I18n.t("business_saved"));
  setTimeout(() => Router.go("settings"), 600);
}
