const Backup = {
  async export() {
    const data = {
      version: 1,
      exportedAt: Date.now(),
      appVersion: "1.0.0",
      data: {
        customers: Storage.getCustomers(),
        entries: Storage.getEntries()
      }
    };
    const json = JSON.stringify(data, null, 2);
    const date = new Date().toISOString().split("T")[0];
    const filename = "hisaab-backup-" + date + ".json";

    if (window.Capacitor && Capacitor.Plugins.Filesystem) {
      const FS = Capacitor.Plugins.Filesystem;
      let savedUri = "", savedPath = "";

      // Try these locations in order - first one that works wins
      const attempts = [
        { dir: "EXTERNAL_STORAGE", folder: "Download/Hisaab", label: "Downloads/Hisaab" },
        { dir: "EXTERNAL_STORAGE", folder: "Hisaab",          label: "Downloads/Hisaab" },
        { dir: "DOCUMENTS",        folder: "Hisaab",          label: "Documents/Hisaab" },
        { dir: "CACHE",            folder: "Hisaab",          label: "Cache/Hisaab" }
      ];

      let lastErr = "";
      for (const a of attempts) {
        try {
          // 1. Make sure the folder exists
          try {
            await FS.mkdir({
              path: a.folder,
              directory: a.dir,
              recursive: true
            });
          } catch (mkErr) {
            // Folder may already exist - ignore mkdir errors
          }

          // 2. Write the file
          const r = await FS.writeFile({
            path: a.folder + "/" + filename,
            data: json,
            directory: a.dir,
            encoding: "utf8",
            recursive: true
          });

          savedUri = r.uri;
          savedPath = a.label + "/" + filename;
          break; // success - stop trying
        } catch (e) {
          lastErr = e.message || String(e);
        }
      }

      if (!savedUri) {
        alert("Backup failed:\n" + lastErr);
        return { success: false, msg: lastErr };
      }

      Storage.setLastBackup();

      // Share is optional - cancel must NOT fail the backup
      if (Capacitor.Plugins.Share) {
        try {
          await Capacitor.Plugins.Share.share({
            title: "Hisaab Backup",
            text: "Saved to " + savedPath,
            url: savedUri,
            dialogTitle: "Save backup"
          });
        } catch (shareErr) {
          // User cancelled - ignore
        }
      }

      alert("Backup saved to:\n" + savedPath);
      return { success: true, path: savedPath };
    }

    // Browser fallback
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    Storage.setLastBackup();
    alert("Backup downloaded: " + filename);
  },

  async import(file, cb) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!parsed.data || !parsed.data.customers) {
          cb(false, "Invalid backup file."); return;
        }
        Storage.setCustomers(parsed.data.customers);
        Storage.setEntries(parsed.data.entries || []);
        cb(true, "Data restored successfully!");
      } catch (err) {
        cb(false, "Corrupt or unreadable file.");
      }
    };
    reader.readAsText(file);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const b = document.getElementById("backupBtn");
  const r = document.getElementById("restoreBtn");
  const f = document.getElementById("fileInput");
  if (b) b.addEventListener("click", () => Backup.export());
  if (r && f) r.addEventListener("click", () => f.click());
  if (f) f.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Backup.import(file, (ok, msg) => {
      alert(msg);
      if (ok && typeof Router !== "undefined" && Router.home)
        setTimeout(() => Router.home(), 800);
    });
    f.value = "";
  });
});
