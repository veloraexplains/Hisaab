// ==========================================
// HISAAB — CSV EXPORT (Fixed)
// ==========================================

const CSVService = {

  generate() {
    const customers = Storage.getCustomers();
    const entries = Storage.getEntries();
    const biz = Storage.getBusinessInfo();

    let csv = '\uFEFF'; // BOM for Excel

    csv += '# HISAAB DATA EXPORT\n';
    csv += '# Shop: ' + (biz.shopName || 'N/A') + '\n';
    csv += '# Exported: ' + new Date().toLocaleString('en-IN') + '\n\n';

    // Customers
    csv += 'CUSTOMERS\n';
    csv += 'ID,Name,Phone,Created,Balance\n';
    customers.forEach(c => {
      const balance = Storage.getCustomerBalance(c.id);
      csv += [
        c.id,
        '"' + (c.name || '').replace(/"/g, '""') + '"',
        c.phone || '',
        new Date(c.createdAt).toLocaleDateString('en-IN'),
        balance
      ].join(',') + '\n';
    });

    csv += '\n\n';

    // Entries
    csv += 'ENTRIES\n';
    csv += 'ID,Customer,Type,Amount,Note,Date\n';
    const sorted = [...entries].sort((a, b) => a.date - b.date);
    sorted.forEach(e => {
      const customer = customers.find(c => c.id === e.customerId);
      csv += [
        e.id,
        '"' + (customer ? customer.name.replace(/"/g, '""') : 'Unknown') + '"',
        e.type === 'gave' ? 'Given' : 'Received',
        e.amount,
        '"' + (e.note || '').replace(/"/g, '""') + '"',
        new Date(e.date).toLocaleDateString('en-IN')
      ].join(',') + '\n';
    });

    csv += '\n\nSUMMARY\n';
    csv += 'Metric,Value\n';
    let totalGiven = 0, totalGot = 0;
    entries.forEach(e => {
      if (e.type === 'gave') totalGiven += Number(e.amount);
      else totalGot += Number(e.amount);
    });
    csv += 'Total Customers,' + customers.length + '\n';
    csv += 'Total Entries,' + entries.length + '\n';
    csv += 'Total Given,' + totalGiven + '\n';
    csv += 'Total Received,' + totalGot + '\n';
    csv += 'Total Pending,' + Storage.getTotalPending() + '\n';

    return csv;
  },

  async download() {
    const csv = this.generate();
    const filename = 'Hisaab_Export_' + new Date().toISOString().split('T')[0] + '.csv';

    // Base64 encode with UTF-8 support
    const base64 = btoa(unescape(encodeURIComponent(csv)));

    // Try Capacitor FileSystem with multiple directories
    if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Filesystem) {
      const FS = window.Capacitor.Plugins.Filesystem;
      
      // Try 1: Documents
      try {
        const result = await FS.writeFile({
          path: filename,
          data: base64,
          directory: 'DOCUMENTS',
          recursive: true
        });
        return { success: true, path: 'Documents/' + filename, uri: result.uri };
      } catch (e1) {
        console.warn('Documents failed:', e1);
      }

      // Try 2: External storage
      try {
        const result = await FS.writeFile({
          path: filename,
          data: base64,
          directory: 'EXTERNAL_STORAGE',
          recursive: true
        });
        return { success: true, path: 'External/' + filename, uri: result.uri };
      } catch (e2) {
        console.warn('ExternalStorage failed:', e2);
      }

      // Try 3: Data directory (app private)
      try {
        const result = await FS.writeFile({
          path: filename,
          data: base64,
          directory: 'DATA',
          recursive: true
        });
        return { success: true, path: 'App Data/' + filename, uri: result.uri };
      } catch (e3) {
        console.warn('Data failed:', e3);
      }

      // Try 4: Cache (last resort, but shareable)
      try {
        const result = await FS.writeFile({
          path: filename,
          data: base64,
          directory: 'CACHE',
          recursive: true
        });
        return { success: true, path: 'Cache/' + filename, uri: result.uri };
      } catch (e4) {
        console.warn('Cache failed:', e4);
        return { success: false, error: 'Could not save to any location' };
      }
    }

    // Browser fallback — trigger download
    try {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      return { success: true, path: 'Downloads/' + filename };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async share() {
    const csv = this.generate();
    const filename = 'Hisaab_Export_' + new Date().toISOString().split('T')[0] + '.csv';
    const base64 = btoa(unescape(encodeURIComponent(csv)));

    try {
      if (window.Capacitor && window.Capacitor.Plugins) {
        const FS = window.Capacitor.Plugins.Filesystem;
        const Share = window.Capacitor.Plugins.Share;

        if (FS && Share) {
          const result = await FS.writeFile({
            path: filename,
            data: base64,
            directory: 'CACHE',
            recursive: true
          });
          
          // Fire and forget — will open share dialog
          Share.share({
            title: 'Hisaab Export',
            text: 'Data export from Hisaab',
            url: result.uri,
            dialogTitle: 'Share CSV'
          }).catch(function(err) {
            // Silent — user cancelled or error
            console.log('CSV share dismissed:', err);
          });
          
          return true;
        }
      }
      return false;
    } catch (err) {
      console.error('CSV share error:', err);
      return false;
    }
  }
};
