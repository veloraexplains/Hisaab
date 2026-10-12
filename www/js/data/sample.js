// HISAAB — SAMPLE DATA (for testing)

const SAMPLE_DATA = {
  customers: [
    { id: "c_sample_1", name: "Ramesh Kumar",  phone: "9876543210", createdAt: Date.now() - 86400000 * 30, note: "" },
    { id: "c_sample_2", name: "Sunita Devi",   phone: "9876543211", createdAt: Date.now() - 86400000 * 25, note: "Weekly" },
    { id: "c_sample_3", name: "Ahmed Khan",    phone: "9876543212", createdAt: Date.now() - 86400000 * 20, note: "" },
    { id: "c_sample_4", name: "Priya Sharma",  phone: "9876543213", createdAt: Date.now() - 86400000 * 15, note: "" },
    { id: "c_sample_5", name: "Mohan Patel",   phone: "9876543214", createdAt: Date.now() - 86400000 * 10, note: "" }
  ],
  entries: [
    { id: "e_sample_1", customerId: "c_sample_1", type: "gave", amount: 500,  note: "Rice 2kg",        date: Date.now() - 86400000 * 20, createdAt: Date.now() - 86400000 * 20 },
    { id: "e_sample_2", customerId: "c_sample_1", type: "got",  amount: 200,  note: "Cash payment",    date: Date.now() - 86400000 * 10, createdAt: Date.now() - 86400000 * 10 },
    { id: "e_sample_3", customerId: "c_sample_1", type: "gave", amount: 350,  note: "Sugar, Tea",      date: Date.now() - 86400000 * 3,  createdAt: Date.now() - 86400000 * 3 },
    { id: "e_sample_4", customerId: "c_sample_2", type: "gave", amount: 1200, note: "Monthly groceries", date: Date.now() - 86400000 * 18, createdAt: Date.now() - 86400000 * 18 },
    { id: "e_sample_5", customerId: "c_sample_2", type: "got",  amount: 500,  note: "Partial payment", date: Date.now() - 86400000 * 5,  createdAt: Date.now() - 86400000 * 5 },
    { id: "e_sample_6", customerId: "c_sample_3", type: "gave", amount: 800,  note: "Flour 5kg",       date: Date.now() - 86400000 * 14, createdAt: Date.now() - 86400000 * 14 },
    { id: "e_sample_7", customerId: "c_sample_3", type: "got",  amount: 800,  note: "Cleared",         date: Date.now() - 86400000 * 2,  createdAt: Date.now() - 86400000 * 2 },
    { id: "e_sample_8", customerId: "c_sample_4", type: "gave", amount: 250,  note: "Vegetables",      date: Date.now() - 86400000 * 12, createdAt: Date.now() - 86400000 * 12 },
    { id: "e_sample_9", customerId: "c_sample_5", type: "gave", amount: 1500, note: "Bulk order",      date: Date.now() - 86400000 * 8,  createdAt: Date.now() - 86400000 * 8 },
    { id: "e_sample_10", customerId: "c_sample_5", type: "got", amount: 500,  note: "Advance paid",    date: Date.now() - 86400000 * 1,  createdAt: Date.now() - 86400000 * 1 }
  ]
};

// Load sample data (with confirmation)
function loadSampleData() {
  if (!confirm("Load sample data? This will REPLACE all your current data.")) return;
  Storage.replaceAll(SAMPLE_DATA);
  if (typeof Toast !== "undefined") Toast.show("Sample data loaded");
  setTimeout(() => Router.home(), 500);
}
