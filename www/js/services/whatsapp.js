// HISAAB — WHATSAPP REMINDER SERVICE

const WhatsApp = {
  sendReminder(customer, amount) {
    if (!customer || !customer.phone) {
      alert("No phone number saved for this customer");
      return false;
    }
    if (!amount || amount <= 0) {
      alert("No pending amount to remind");
      return false;
    }
    const msg = I18n.t("reminder_message").replace("{name}", customer.name).replace("{amount}", amount);
    const url = "https://wa.me/91" + customer.phone + "?text=" + encodeURIComponent(msg);
    window.open(url, "_blank");
    return true;
  }
};
