// HISAAB — NOTIFICATIONS (Toast + Vibration)

const Toast = {
  show(msg, duration) {
    duration = duration || 2000;
    const existing = document.querySelector(".toast");
    if (existing) existing.remove();
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.classList.add("show"), 50);
    setTimeout(() => {
      el.classList.remove("show");
      setTimeout(() => el.remove(), 300);
    }, duration);
  }
};

const Vibrate = {
  light() { if (navigator.vibrate) navigator.vibrate(15); },
  medium() { if (navigator.vibrate) navigator.vibrate(50); },
  heavy() { if (navigator.vibrate) navigator.vibrate(100); },
  success() { if (navigator.vibrate) navigator.vibrate([30, 50, 30]); },
  error() { if (navigator.vibrate) navigator.vibrate([100, 50, 100]); }
};
