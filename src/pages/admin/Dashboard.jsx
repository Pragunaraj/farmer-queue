import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";

const INITIAL_TOKENS = [
  {
    id: "#AGRI-8402",
    farmer: "Rameshwar Lal",
    phone: "+91 98290 12841",
    village: "Chomu, Jaipur",
    crop: "Wheat (HD-2967)",
    cropCategory: "Wheat",
    quantity: "45 Qtl",
    slot: "09:00 AM",
    status: "Waiting",
    moisture: "--",
    grade: "Pending Gate Entry",
    price: "₹ 2,275 / Qtl",
    txHash: "0x8f3b...19a2",
  },
  {
    id: "#AGRI-8403",
    farmer: "Sunita Devi",
    phone: "+91 94140 88210",
    village: "Bassi, Jaipur",
    crop: "Paddy (PR-114)",
    cropCategory: "Paddy",
    quantity: "60 Qtl",
    slot: "09:15 AM",
    status: "Gate Verified",
    moisture: "12.1%",
    grade: "Queue for Quality Bay 2",
    price: "₹ 2,183 / Qtl",
    txHash: "0x3e11...45bc",
  },
  {
    id: "#AGRI-8404",
    farmer: "Bhanwar Singh",
    phone: "+91 97830 55102",
    village: "Amer, Jaipur",
    crop: "Wheat (WH-1105)",
    cropCategory: "Wheat",
    quantity: "80 Qtl",
    slot: "09:30 AM",
    status: "In Inspection",
    moisture: "10.8%",
    grade: "Grade A (FAQ Standard)",
    price: "₹ 2,275 / Qtl",
    txHash: "0x77d2...990f",
  },
  {
    id: "#AGRI-8405",
    farmer: "Geeta Kumari",
    phone: "+91 99281 77319",
    village: "Dudu, Jaipur",
    crop: "Cotton (Bt)",
    cropCategory: "Cotton",
    quantity: "35 Qtl",
    slot: "09:45 AM",
    status: "Paid",
    moisture: "8.5%",
    grade: "Premium Long Staple",
    price: "₹ 7,020 / Qtl",
    txHash: "0x91a0...33c1",
  },
  {
    id: "#AGRI-8406",
    farmer: "Mohan Ram",
    phone: "+91 96102 44908",
    village: "Phulera, Jaipur",
    crop: "Paddy (PB-1509)",
    cropCategory: "Paddy",
    quantity: "55 Qtl",
    slot: "10:00 AM",
    status: "Waiting",
    moisture: "--",
    grade: "Pending Gate Entry",
    price: "₹ 2,183 / Qtl",
    txHash: "0x12a9...88fe",
  },
  {
    id: "#AGRI-8407",
    farmer: "Jagdish Prasad",
    phone: "+91 98284 31109",
    village: "Sanganer, Jaipur",
    crop: "Mustard (Pusa-31)",
    cropCategory: "Mustard",
    quantity: "40 Qtl",
    slot: "10:15 AM",
    status: "Gate Verified",
    moisture: "7.9%",
    grade: "High Oil Content (41%)",
    price: "₹ 5,650 / Qtl",
    txHash: "0x66a4...77bc",
  },
  {
    id: "#AGRI-8408",
    farmer: "Kamla Choudhary",
    phone: "+91 94132 10982",
    village: "Kotputli, Jaipur",
    crop: "Wheat (Sharbati)",
    cropCategory: "Wheat",
    quantity: "70 Qtl",
    slot: "10:30 AM",
    status: "In Inspection",
    moisture: "11.2%",
    grade: "Grade A Premium",
    price: "₹ 2,450 / Qtl",
    txHash: "0x44fa...551e",
  },
  {
    id: "#AGRI-8409",
    farmer: "Devendra Yadav",
    phone: "+91 95491 66203",
    village: "Jamwa Ramgarh, Jaipur",
    crop: "Bajra (HHB-67)",
    cropCategory: "Bajra",
    quantity: "50 Qtl",
    slot: "10:45 AM",
    status: "Paid",
    moisture: "9.2%",
    grade: "Clean FAQ",
    price: "₹ 2,500 / Qtl",
    txHash: "0x22be...440d",
  },
  {
    id: "#AGRI-8410",
    farmer: "Mukesh Gurjar",
    phone: "+91 98293 88127",
    village: "Shahpura, Jaipur",
    crop: "Soybean (JS-335)",
    cropCategory: "Soybean",
    quantity: "65 Qtl",
    slot: "11:00 AM",
    status: "Waiting",
    moisture: "--",
    grade: "Pending Gate Entry",
    price: "₹ 4,892 / Qtl",
    txHash: "0x55bc...110a",
  },
];

const THROUGHPUT_DATA = [
  { time: "9 AM", value: 42, max: 200, isPeak: false },
  { time: "10 AM", value: 78, max: 200, isPeak: false },
  { time: "11 AM", value: 128, max: 200, isPeak: false },
  { time: "12 PM", value: 162, max: 200, isPeak: false },
  { time: "1 PM", value: 96, max: 200, isPeak: false },
  { time: "2 PM", value: 68, max: 200, isPeak: false },
  { time: "3 PM", value: 186, max: 200, isPeak: true },
  { time: "4 PM", value: 142, max: 200, isPeak: false },
  { time: "5 PM", value: 90, max: 200, isPeak: false },
];

const CROP_PRICES = {
  "Wheat (HD-2967)": "₹ 2,275 / Qtl",
  "Wheat (WH-1105)": "₹ 2,275 / Qtl",
  "Wheat (Sharbati)": "₹ 2,450 / Qtl",
  "Paddy (PR-114)": "₹ 2,183 / Qtl",
  "Paddy (PB-1509)": "₹ 2,183 / Qtl",
  "Cotton (Bt)": "₹ 7,020 / Qtl",
  "Mustard (Pusa-31)": "₹ 5,650 / Qtl",
  "Bajra (HHB-67)": "₹ 2,500 / Qtl",
  "Soybean (JS-335)": "₹ 4,892 / Qtl",
};

function Dashboard() {
  // Main state hooks
  const [tokens, setTokens] = useState(INITIAL_TOKENS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All Tokens");
  const [secondsAgo, setSecondsAgo] = useState(2);
  const [selectedToken, setSelectedToken] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // New Token Form state
  const [formData, setFormData] = useState({
    farmer: "",
    phone: "",
    village: "Jaipur Rural",
    crop: "Wheat (HD-2967)",
    quantity: "50",
    slot: "11:15 AM",
    status: "Waiting",
  });

  // Live timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo((prev) => (prev >= 20 ? 1 : prev + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter options
  const filterOptions = [
    "All Tokens",
    "Waiting",
    "Gate Verified",
    "In Inspection",
    "Paid",
  ];

  // Real-time dynamic filtering
  const filteredTokens = tokens.filter((item) => {
    const matchesFilter =
      selectedFilter === "All Tokens" || item.status === selectedFilter;

    const query = searchQuery.trim().toLowerCase();
    if (!query) return matchesFilter;

    const matchesSearch =
      item.id.toLowerCase().includes(query) ||
      item.farmer.toLowerCase().includes(query) ||
      item.crop.toLowerCase().includes(query) ||
      item.village.toLowerCase().includes(query) ||
      item.phone.includes(query);

    return matchesFilter && matchesSearch;
  });

  // Helper to count tokens by status
  const getCountByStatus = (status) => {
    if (status === "All Tokens") return tokens.length;
    return tokens.filter((t) => t.status === status).length;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Waiting":
        return "status-waiting";
      case "Gate Verified":
        return "status-gate-verified";
      case "In Inspection":
        return "status-in-inspection";
      case "Paid":
        return "status-paid";
      default:
        return "";
    }
  };

  // Helper to generate next sequential token ID
  const getNextTokenId = () => {
    const numbers = tokens
      .map((t) => {
        const match = t.id.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
      })
      .filter((n) => !isNaN(n));
    const maxNum = numbers.length > 0 ? Math.max(...numbers) : 8400;
    return `#AGRI-${maxNum + 1}`;
  };

  // Handle New Token Creation
  const handleCreateToken = (e) => {
    e.preventDefault();
    if (!formData.farmer.trim()) {
      alert("Please enter a farmer name.");
      return;
    }

    const nextId = getNextTokenId();
    const randomTx = `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`;

    const newToken = {
      id: nextId,
      farmer: formData.farmer.trim(),
      phone: formData.phone.trim() || "+91 9829" + Math.floor(10000 + Math.random() * 90000),
      village: formData.village.trim() || "Jaipur District",
      crop: formData.crop,
      cropCategory: formData.crop.split(" ")[0],
      quantity: `${formData.quantity} Qtl`,
      slot: formData.slot,
      status: formData.status,
      moisture: formData.status === "Waiting" ? "--" : "11.0%",
      grade: formData.status === "Waiting" ? "Pending Gate Entry" : "Queue for Inspection",
      price: CROP_PRICES[formData.crop] || "₹ 2,275 / Qtl",
      txHash: randomTx,
    };

    // Prepend new token to queue
    setTokens([newToken, ...tokens]);
    setSecondsAgo(0);

    // Reset and close modal
    setFormData({
      farmer: "",
      phone: "",
      village: "Jaipur Rural",
      crop: "Wheat (HD-2967)",
      quantity: "50",
      slot: "11:15 AM",
      status: "Waiting",
    });
    setIsCreateModalOpen(false);

    // Show toast
    setToastMessage(`Token ${nextId} issued for ${newToken.farmer}!`);
    setTimeout(() => setToastMessage(""), 4000);
  };

  return (
    <AdminLayout>
      {/* Top Banner & Action Controls */}
      <header className="admin-topbar">
        <div className="page-intro">
          <h1>Command Center</h1>
          <p>Real-time Mandi procurement telemetry, throughput metrics, and incoming token flow.</p>
        </div>
        <div className="topbar-actions">
          <span className="mandi-badge">
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block" }}></span>
            Mandi: Jaipur Central RJ-04
          </span>
          <button
            className="btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
            title="Issue a new farmer procurement appointment token"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Issue Token
          </button>
          <button
            className="btn-secondary"
            onClick={() => setSecondsAgo(0)}
            title="Refresh Live Telemetry"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
            </svg>
            Sync Data
          </button>
        </div>
      </header>

      {/* KPI Cards Row (Dynamically calculated from tokens state) */}
      <section className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Today's Intake</span>
            <div className="kpi-icon-pill" style={{ background: "#ecfdf5", color: "#059669" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                <path d="M3 6h18"></path>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
          </div>
          <p className="kpi-value">1,248 Qtl</p>
          <div className="kpi-trend positive">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
              <polyline points="16 7 22 7 22 13"></polyline>
            </svg>
            <span>+14.2% vs yesterday</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Active Pipeline</span>
            <div className="kpi-icon-pill" style={{ background: "#eff6ff", color: "#2563eb" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
          </div>
          <p className="kpi-value">{tokens.length} Tokens</p>
          <div className="kpi-trend">
            <span>
              {getCountByStatus("Waiting")} waiting · {getCountByStatus("Gate Verified")} gate · {getCountByStatus("In Inspection")} in test
            </span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Avg Quality Grade</span>
            <div className="kpi-icon-pill" style={{ background: "#f5f3ff", color: "#7c3aed" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="6"></circle>
                <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
              </svg>
            </div>
          </div>
          <p className="kpi-value">Grade A (94%)</p>
          <div className="kpi-trend positive">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Avg moisture: 10.9% (Optimal)</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Total MSP Disbursed</span>
            <div className="kpi-icon-pill" style={{ background: "#fffbeb", color: "#d97706" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                <line x1="2" x2="22" y1="10" y2="10"></line>
              </svg>
            </div>
          </div>
          <p className="kpi-value">₹ 28,32,960</p>
          <div className="kpi-trend positive">
            <span>100% Escrow Blockchain Synced</span>
          </div>
        </div>
      </section>

      {/* Main Operations Grid: Chart & Table */}
      <section className="operations-dashboard-grid">
        {/* Left Column: Hourly Procurement Throughput Chart */}
        <div className="chart-panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Hourly Procurement Throughput</h2>
              <p className="panel-subtitle">Quintals processed per hour</p>
            </div>
            <div className="chart-legend-badge">
              <span className="legend-dot"></span>
              Quintals
            </div>
          </div>

          <div className="chart-canvas-container">
            {/* Y-Axis Labels */}
            <div className="chart-y-axis">
              <span>200</span>
              <span>150</span>
              <span>100</span>
              <span>50</span>
              <span>0</span>
            </div>

            {/* Plot Area with Dashed Gridlines & Vertical Bars */}
            <div className="chart-plot-area">
              <div className="chart-gridlines">
                <div className="gridline"></div>
                <div className="gridline"></div>
                <div className="gridline"></div>
                <div className="gridline"></div>
                <div className="gridline"></div>
              </div>

              <div className="chart-bars-row">
                {THROUGHPUT_DATA.map((item, index) => {
                  const barHeightPct = (item.value / item.max) * 100;
                  return (
                    <div
                      key={index}
                      className={`bar-column ${item.isPeak ? "peak-hour" : ""}`}
                    >
                      <div className="bar-tooltip">
                        {item.time}: {item.value} Qtl {item.isPeak ? "⚡ Peak" : ""}
                      </div>
                      <div
                        className="bar-fill"
                        style={{ height: `${barHeightPct}%` }}
                      ></div>
                    </div>
                  );
                })}
              </div>

              {/* X-Axis Time Labels */}
              <div className="chart-x-labels">
                {THROUGHPUT_DATA.map((item, index) => (
                  <span key={index} className="x-label">
                    {index % 2 === 0 ? item.time : ""}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="chart-footer-stat">
            <span>Peak Hour Throughput</span>
            <span className="highlight-metric">3:00 PM · 186 Quintals</span>
          </div>
        </div>

        {/* Right Column: Live Operations Queue Table */}
        <div className="table-panel">
          <div className="table-panel-header">
            <div>
              <h2 className="panel-title">Live Operations Queue</h2>
              <p className="panel-subtitle">
                {filteredTokens.length} {filteredTokens.length === 1 ? "token" : "tokens"} · Updated {secondsAgo}s ago
              </p>
            </div>

            {/* Search Input with Clear Button */}
            <div className="search-input-wrapper">
              <span className="search-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
              <input
                type="text"
                className="search-input"
                placeholder="Search token, farmer or crop"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="clear-search-btn"
                  onClick={() => setSearchQuery("")}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Interactive Filter Pills Bar with dynamic count indicators */}
          <div className="filter-tabs-row">
            <span className="filter-icon-btn" title="Filter Queue by Status">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
            </span>
            {filterOptions.map((filter) => {
              const count = getCountByStatus(filter);
              return (
                <button
                  key={filter}
                  className={`filter-pill ${selectedFilter === filter ? "active" : ""}`}
                  onClick={() => setSelectedFilter(filter)}
                >
                  {filter}
                  <span className="filter-badge-count">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Live Operations Queue Table */}
          <div className="queue-table-container">
            <table className="queue-table">
              <thead>
                <tr>
                  <th>Token #</th>
                  <th>Farmer</th>
                  <th>Crop</th>
                  <th>Slot</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTokens.length > 0 ? (
                  filteredTokens.map((item) => (
                    <tr
                      key={item.id}
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelectedToken(item)}
                    >
                      <td className="token-cell">{item.id}</td>
                      <td className="farmer-cell">
                        <div>{item.farmer}</div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 400 }}>
                          {item.village}
                        </div>
                      </td>
                      <td className="crop-cell">
                        <div>{item.crop}</div>
                        <div className="crop-variety">{item.quantity}</div>
                      </td>
                      <td className="slot-cell">{item.slot}</td>
                      <td>
                        <span className={`status-pill ${getStatusClass(item.status)}`}>
                          <span className="status-dot"></span>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          className="btn-action-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedToken(item);
                          }}
                          title="View Token Telemetry"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="1"></circle>
                            <circle cx="19" cy="12" r="1"></circle>
                            <circle cx="5" cy="12" r="1"></circle>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}>
                      <div style={{ marginBottom: "8px", fontWeight: 600, color: "var(--text-primary)" }}>
                        No procurement tokens found
                      </div>
                      <p style={{ fontSize: "13px", margin: "0 0 16px" }}>
                        No entries match your search "{searchQuery}" or status filter "{selectedFilter}".
                      </p>
                      <button
                        className="btn-secondary"
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedFilter("All Tokens");
                        }}
                      >
                        Reset Filters
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Modal: Issue/Create New Token */}
      {isCreateModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleCreateToken}>
              <div className="modal-header">
                <div>
                  <h3 className="modal-title">Issue Procurement Token</h3>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    Generate appointment slot & blockchain queue token
                  </span>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label className="form-label">Farmer Full Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Suresh Kumar"
                      required
                      value={formData.farmer}
                      onChange={(e) => setFormData({ ...formData, farmer: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact Phone</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tehsil / Village</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Bassi, Jaipur"
                      value={formData.village}
                      onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Produce Crop & Variety</label>
                    <select
                      className="form-select"
                      value={formData.crop}
                      onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                    >
                      {Object.keys(CROP_PRICES).map((cropName) => (
                        <option key={cropName} value={cropName}>
                          {cropName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Batch Quantity (Quintals)</label>
                    <input
                      type="number"
                      min="1"
                      className="form-input"
                      placeholder="50"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Preferred Mandi Slot</label>
                    <select
                      className="form-select"
                      value={formData.slot}
                      onChange={(e) => setFormData({ ...formData, slot: e.target.value })}
                    >
                      <option value="11:15 AM">11:15 AM</option>
                      <option value="11:30 AM">11:30 AM</option>
                      <option value="11:45 AM">11:45 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="02:30 PM">02:30 PM</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Initial Status</label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Waiting">Waiting (Gate Entry Pending)</option>
                      <option value="Gate Verified">Gate Verified (Arrived)</option>
                      <option value="In Inspection">In Inspection (Lab Bay)</option>
                      <option value="Paid">Paid (Procured)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Generate Token & Enqueue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Token Details */}
      {selectedToken && (
        <div className="modal-overlay" onClick={() => setSelectedToken(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Procurement Token Details</h3>
                <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
                  {selectedToken.id}
                </span>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setSelectedToken(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Farmer Name:</span>
                <span className="detail-value">{selectedToken.farmer}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Phone & Village:</span>
                <span className="detail-value">{selectedToken.phone} ({selectedToken.village})</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Produce & Variety:</span>
                <span className="detail-value">{selectedToken.crop}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Batch Quantity:</span>
                <span className="detail-value">{selectedToken.quantity}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Designated Slot:</span>
                <span className="detail-value" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {selectedToken.slot}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Moisture Reading:</span>
                <span className="detail-value">{selectedToken.moisture}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Quality Assessment:</span>
                <span className="detail-value">{selectedToken.grade}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">MSP Base Price:</span>
                <span className="detail-value" style={{ color: "#059669" }}>{selectedToken.price}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Current Pipeline Status:</span>
                <span className={`status-pill ${getStatusClass(selectedToken.status)}`}>
                  <span className="status-dot"></span>
                  {selectedToken.status}
                </span>
              </div>
              <div className="detail-row" style={{ borderBottom: "none" }}>
                <span className="detail-label">Blockchain Hash:</span>
                <span className="detail-value" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#64748b" }}>
                  {selectedToken.txHash}
                </span>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setSelectedToken(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Success Toast */}
      {toastMessage && (
        <div className="success-toast">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}
    </AdminLayout>
  );
}

export default Dashboard;
