// ==========================================
// HISAAB — MONTHLY REPORTS SERVICE
// ==========================================

const ReportsService = {

  // Get month start/end as timestamps (using LOCAL time to match phone)
  getMonthRange(year, month) {
    // Local time: first day of month at 00:00
    const start = new Date(year, month, 1, 0, 0, 0, 0).getTime();
    // Local time: first day of NEXT month at 00:00
    const end = new Date(year, month + 1, 1, 0, 0, 0, 0).getTime();
    return { start, end };
  },

  getEntriesInRange(startTime, endTime) {
    return Storage.getEntries().filter(e => e.date >= startTime && e.date < endTime);
  },

  calculateMonth(year, month) {
    const { start, end } = this.getMonthRange(year, month);
    const entries = this.getEntriesInRange(start, end);
    
    let given = 0, got = 0;
    const customerSet = new Set();
    const dailyMap = {};

    entries.forEach(e => {
      customerSet.add(e.customerId);
      const day = new Date(e.date).getDate();
      if (!dailyMap[day]) dailyMap[day] = { given: 0, got: 0 };
      
      const amt = Number(e.amount);
      if (e.type === 'gave') {
        given += amt;
        dailyMap[day].given += amt;
      } else {
        got += amt;
        dailyMap[day].got += amt;
      }
    });

    // Month-end pending
    let pendingAtEnd = 0;
    Storage.getCustomers().forEach(c => {
      const cEntries = Storage.getEntriesForCustomer(c.id).filter(e => e.date < end);
      let bal = 0;
      cEntries.forEach(e => {
        if (e.type === 'gave') bal += Number(e.amount);
        else bal -= Number(e.amount);
      });
      if (bal > 0) pendingAtEnd += bal;
    });

    return {
      given, got, entriesCount: entries.length,
      net: got - given,
      activeCustomers: customerSet.size,
      pendingAtEnd,
      dailyMap
    };
  },

  getTopDebtors(limit = 5) {
    const customers = Storage.getCustomers();
    return customers
      .map(c => ({ customer: c, balance: Storage.getCustomerBalance(c.id) }))
      .filter(x => x.balance > 0)
      .sort((a, b) => b.balance - a.balance)
      .slice(0, limit);
  },

  getTopPayers(year, month, limit = 5) {
    const { start, end } = this.getMonthRange(year, month);
    const entries = this.getEntriesInRange(start, end).filter(e => e.type === 'got');
    const customerTotals = {};
    entries.forEach(e => {
      if (!customerTotals[e.customerId]) customerTotals[e.customerId] = 0;
      customerTotals[e.customerId] += Number(e.amount);
    });
    return Object.entries(customerTotals)
      .map(([cid, amount]) => ({ customer: Storage.getCustomer(cid), amount }))
      .filter(x => x.customer)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, limit);
  }
};
