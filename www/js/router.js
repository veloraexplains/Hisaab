// ==========================================
// HISAAB — ROUTER WITH EXIT CONFIRMATION
// ==========================================

const Router = {
  go(page, params = {}) {
    const query = Object.keys(params).length
      ? '?' + new URLSearchParams(params).toString()
      : '';
    const isInPages = window.location.pathname.includes('/pages/');
    const path = isInPages ? (page + '.html') : ('pages/' + page + '.html');
    window.location.href = path + query;
  },

  home() {
    const isInPages = window.location.pathname.includes('/pages/');
    window.location.href = isInPages ? 'home.html' : 'pages/home.html';
  },

  back(fallbackPage = 'home') {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.go(fallbackPage);
    }
  },

  params() {
    const out = {};
    new URLSearchParams(window.location.search).forEach((v, k) => {
      out[k] = v;
    });
    return out;
  },

  param(name) {
    return new URLSearchParams(window.location.search).get(name);
  },

  reload() {
    window.location.reload();
  },

  replace(page, params = {}) {
    const query = Object.keys(params).length
      ? '?' + new URLSearchParams(params).toString()
      : '';
    const isInPages = window.location.pathname.includes('/pages/');
    const path = isInPages ? (page + '.html') : ('pages/' + page + '.html');
    window.location.replace(path + query);
  }
};

// ==========================================
// EXIT CONFIRMATION DIALOG
// ==========================================
function showExitConfirmation(onConfirm) {
  // Remove existing
  var existing = document.getElementById('exitConfirmDialog');
  if (existing) existing.remove();
  
  var backdrop = document.createElement('div');
  backdrop.id = 'exitConfirmDialog';
  backdrop.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.75);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px';
  
  backdrop.innerHTML = 
    '<div style="background:#1A2921;border:1px solid #2A3B32;border-radius:20px;padding:24px;max-width:340px;width:100%;text-align:center">' +
    '<div style="font-size:44px;margin-bottom:12px">👋</div>' +
    '<div style="font-size:18px;font-weight:800;color:#fff;margin-bottom:8px">Exit Hisaab?</div>' +
    '<div style="font-size:13px;color:#9CA3AF;margin-bottom:24px;line-height:1.5">Your data is safe. You can come back anytime.</div>' +
    '<div style="display:flex;gap:10px">' +
    '<button id="exitCancelBtn" style="flex:1;padding:14px;background:#22332A;color:#fff;border:1px solid #2A3B32;border-radius:14px;font-size:14px;font-weight:700;cursor:pointer">Stay</button>' +
    '<button id="exitConfirmBtn" style="flex:1;padding:14px;background:#EF4444;color:#fff;border:none;border-radius:14px;font-size:14px;font-weight:700;cursor:pointer">Exit</button>' +
    '</div></div>';
  
  document.body.appendChild(backdrop);
  
  document.getElementById('exitCancelBtn').addEventListener('click', function() {
    backdrop.remove();
  });
  
  document.getElementById('exitConfirmBtn').addEventListener('click', function() {
    backdrop.remove();
    if (onConfirm) onConfirm();
  });
  
  // Tap outside to close
  backdrop.addEventListener('click', function(e) {
    if (e.target === backdrop) backdrop.remove();
  });
}

// ==========================================
// ANDROID BACK BUTTON HANDLER
// ==========================================
(function() {
  function attachBackHandler() {
    if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
      window.Capacitor.Plugins.App.addListener('backButton', function(data) {
        var path = window.location.pathname;
        var isHome = path.indexOf('home.html') !== -1 || 
                     path.endsWith('/www/') || 
                     path.endsWith('/index.html') ||
                     path.endsWith('/');
        
        if (isHome) {
          // HOME → show exit confirmation
          showExitConfirmation(function() {
            window.Capacitor.Plugins.App.exitApp();
          });
          return;
        }
        
        // Any other page → go back in history
        if (window.history.length > 1) {
          window.history.back();
        } else {
          Router.home();
        }
      });
    }
  }
  
  attachBackHandler();
  
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', attachBackHandler);
  }
})();

// ==========================================
// GLOBAL THEME LOADER (every page)
// ==========================================
(function() {
  function applyThemeGlobally() {
    try {
      var theme = 'dark';
      
      // Read from Storage if available
      if (typeof Storage !== 'undefined' && typeof Storage.getTheme === 'function') {
        theme = Storage.getTheme() || 'dark';
      } else {
        // Fallback: read directly from localStorage
        try {
          var saved = localStorage.getItem('hisaab_theme');
          if (saved) {
            // Storage uses JSON.stringify, so parse if needed
            try { theme = JSON.parse(saved); } catch(e) { theme = saved; }
          }
        } catch(e) {}
      }
      
      if (theme === 'light') {
        document.body.classList.add('light');
      } else {
        document.body.classList.remove('light');
      }
    } catch (err) {
      console.log('Theme apply error:', err);
    }
  }
  
  // Apply immediately (before DOM paint)
  applyThemeGlobally();
  
  // Also on DOMContentLoaded for safety
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', applyThemeGlobally);
  }
  
  // Expose globally so other code can call it
  window.applyThemeGlobally = applyThemeGlobally;
})();
