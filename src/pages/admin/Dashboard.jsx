import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { useMandi } from "./MandiContext";
import { useLanguage } from "../../context/LanguageContext";
import LanguageSelector from "../../components/LanguageSelector";

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

const BASE_ALL_CURVE = {
  "9 AM": 42,
  "10 AM": 78,
  "11 AM": 128,
  "12 PM": 162,
  "1 PM": 96,
  "2 PM": 68,
  "3 PM": 186,
  "4 PM": 142,
  "5 PM": 90,
};

const HOURS_LIST = ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM"];

function Dashboard() {
  // Shared state from MandiContext (synced with ScanToken and across tabs)
  const { tokens, addToken } = useMandi();
  const { t, language } = useLanguage();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All Tokens");
  const [secondsAgo, setSecondsAgo] = useState(2);
  const [selectedToken, setSelectedToken] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Form State for Token Issuance
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

  const filterOptions = [
    { key: "All Tokens", label: t("allTokens") },
    { key: "Waiting", label: t("filterWaiting") },
    { key: "Gate Verified", label: t("filterGateVerified") },
    { key: "In Inspection", label: t("filterInInspection") },
    { key: "Paid", label: t("filterPaid") },
  ];

  // Real-time table filter based on status and search query
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

  // Count helper
  const getCountByStatus = (status) => {
    if (status === "All Tokens") return tokens.length;
    return tokens.filter((t) => t.status === status).length;
  };

  // Status label translation helper
  const getStatusLabel = (status) => {
    switch (status) {
      case "Waiting":
        return t("statusWaiting");
      case "Gate Verified":
        return t("statusGateVerified");
      case "In Inspection":
        return t("statusInInspection");
      case "Paid":
        return t("statusPaid");
      default:
        return status;
    }
  };

  // Status CSS helper
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

  // Generate next sequential token ID
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

  // =========================================================================
  // Dynamic Calculation of Throughput Graph based on Selected Filter
  // =========================================================================
  const rawThroughputData = HOURS_LIST.map((hour) => {
    if (selectedFilter === "All Tokens") {
      const val = BASE_ALL_CURVE[hour] || 0;
      return { time: hour, value: val, max: 200 };
    }

    // Calculate sum of quintals for tokens matching the active filter in this hour
    const matchingInHour = tokens.filter(
      (t) => t.status === selectedFilter && (t.hourSlot === hour || t.slot?.includes(hour.split(" ")[0]))
    );
    const quintals = matchingInHour.reduce(
      (acc, t) => acc + (t.rawQuintals || parseInt(t.quantity, 10) || 50),
      0
    );

    return {
      time: hour,
      value: quintals,
      max: 120, // Scaled for subset view
    };
  });

  // Find dynamic peak hour for current filter
  const peakVal = Math.max(...rawThroughputData.map((d) => d.value));
  const peakItem = rawThroughputData.find((d) => d.value === peakVal && d.value > 0);

  const throughputData = rawThroughputData.map((d) => ({
    ...d,
    isPeak: peakItem ? d.time === peakItem.time : false,
  }));

  // Dynamic Total Quintals processed
  const totalFilteredQuintals = rawThroughputData.reduce((acc, d) => acc + d.value, 0);

  // Handle Token Form Submission
  const handleCreateToken = (e) => {
    e.preventDefault();
    if (!formData.farmer.trim()) {
      alert("Please enter farmer name.");
      return;
    }

    const nextId = getNextTokenId();
    const randomTx = `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`;
    const qtlNum = parseInt(formData.quantity, 10) || 50;

    const hourSlot = formData.slot.includes("11:")
      ? "11 AM"
      : formData.slot.includes("12:")
      ? "12 PM"
      : formData.slot.includes("02:")
      ? "2 PM"
      : "10 AM";

    const newToken = {
      id: nextId,
      farmer: formData.farmer.trim(),
      phone: formData.phone.trim() || "+91 9829" + Math.floor(10000 + Math.random() * 90000),
      village: formData.village.trim() || "Jaipur District",
      crop: formData.crop,
      cropCategory: formData.crop.split(" ")[0],
      quantity: `${qtlNum} Qtl`,
      rawQuintals: qtlNum,
      slot: formData.slot,
      hourSlot: hourSlot,
      status: formData.status,
      moisture: formData.status === "Waiting" ? "--" : "11.0%",
      grade: formData.status === "Waiting" ? "Pending Gate Entry" : "Queue for Inspection",
      price: CROP_PRICES[formData.crop] || "₹ 2,275 / Qtl",
      txHash: randomTx,
      vehicle: "RJ-14-GA-" + Math.floor(1000 + Math.random() * 9000),
    };

    addToken(newToken);
    setSecondsAgo(0);

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

    setToastMessage(`Token ${nextId} created for ${newToken.farmer}!`);
    setTimeout(() => setToastMessage(""), 4000);
  };

  return (
    <AdminLayout>
      {/* Top Banner & Action Controls */}
      <header className="admin-topbar">
        <div className="page-intro">
          <h1>{t("headerTitle")}</h1>
          <p>{t("headerSubtitle")}</p>
        </div>
        <div className="topbar-actions">
          {/* Language Selector Pill */}
          <LanguageSelector />

          <span className="mandi-badge">
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block" }}></span>
            {t("mandiBadge")}
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
            {t("issueTokenBtn")}
          </button>
          <button
            className="btn-secondary"
            onClick={() => setSecondsAgo(0)}
            title="Refresh Live Telemetry"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
            </svg>
            {t("syncDataBtn")}
          </button>
        </div>
      </header>

      {/* KPI Cards Row (Connected dynamically with MandiContext) */}
      <section className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">{t("todaysIntake")}</span>
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
            <span>{t("intakeVsYesterday")}</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">{t("activePipeline")}</span>
            <div className="kpi-icon-pill" style={{ background: "#eff6ff", color: "#2563eb" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
          </div>
          <p className="kpi-value">{tokens.length} {t("tokensCount")}</p>
          <div className="kpi-trend">
            <span>
              {getCountByStatus("Waiting")} {t("waitingSub")} · {getCountByStatus("Gate Verified")} {t("gateSub")} · {getCountByStatus("In Inspection")} {t("inTestSub")}
            </span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">{t("avgQualityGrade")}</span>
            <div className="kpi-icon-pill" style={{ background: "#f5f3ff", color: "#7c3aed" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="6"></circle>
                <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
              </svg>
            </div>
          </div>
          <p className="kpi-value">{t("gradeAStandard")}</p>
          <div className="kpi-trend positive">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>{t("moistureOptimal")}</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">{t("totalMspDisbursed")}</span>
            <div className="kpi-icon-pill" style={{ background: "#fffbeb", color: "#d97706" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                <line x1="2" x2="22" y1="10" y2="10"></line>
              </svg>
            </div>
          </div>
          <p className="kpi-value">₹ 28,32,960</p>
          <div className="kpi-trend positive">
            <span>{t("escrowSyncedText")}</span>
          </div>
        </div>
      </section>

      {/* Main Operations Grid: Chart & Table */}
      <section className="operations-dashboard-grid">
        {/* Left Column: Dynamically Recalculated Throughput Chart */}
        <div className="chart-panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">{t("hourlyThroughputTitle")}</h2>
              <p className="panel-subtitle">
                {selectedFilter === "All Tokens"
                  ? t("hourlyThroughputDesc")
                  : `${filterOptions.find((f) => f.key === selectedFilter)?.label || selectedFilter}: ${totalFilteredQuintals} ${t("quintalsPill")}`}
              </p>
            </div>
            <div className="chart-legend-badge">
              <span className="legend-dot"></span>
              {selectedFilter === "All Tokens" ? t("quintalsPill") : (filterOptions.find((f) => f.key === selectedFilter)?.label || selectedFilter)}
            </div>
          </div>

          <div className="chart-canvas-container">
            {/* Y-Axis Labels */}
            <div className="chart-y-axis">
              <span>{selectedFilter === "All Tokens" ? "200" : "120"}</span>
              <span>{selectedFilter === "All Tokens" ? "150" : "90"}</span>
              <span>{selectedFilter === "All Tokens" ? "100" : "60"}</span>
              <span>{selectedFilter === "All Tokens" ? "50" : "30"}</span>
              <span>0</span>
            </div>

            {/* Plot Area with Vertical Bars */}
            <div className="chart-plot-area">
              <div className="chart-gridlines">
                <div className="gridline"></div>
                <div className="gridline"></div>
                <div className="gridline"></div>
                <div className="gridline"></div>
                <div className="gridline"></div>
              </div>

              <div className="chart-bars-row">
                {throughputData.map((item, index) => {
                  const barHeightPct = item.max > 0 ? (item.value / item.max) * 100 : 0;
                  return (
                    <div
                      key={index}
                      className={`bar-column ${item.isPeak ? "peak-hour" : ""}`}
                    >
                      <div className="bar-tooltip">
                        {item.time}: {item.value} Qtl {item.isPeak ? `⚡ ${t("peakTraffic")}` : ""} ({filterOptions.find((f) => f.key === selectedFilter)?.label || selectedFilter})
                      </div>
                      <div
                        className="bar-fill"
                        style={{
                          height: `${Math.min(100, Math.max(item.value > 0 ? 4 : 0, barHeightPct))}%`,
                          transition: "height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      ></div>
                    </div>
                  );
                })}
              </div>

              {/* X-Axis Time Labels */}
              <div className="chart-x-labels">
                {throughputData.map((item, index) => (
                  <span key={index} className="x-label">
                    {index % 2 === 0 ? item.time : ""}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="chart-footer-stat">
            <span>{t("peakTraffic")} ({filterOptions.find((f) => f.key === selectedFilter)?.label || selectedFilter})</span>
            <span className="highlight-metric">
              {peakItem
                ? `${peakItem.time} · ${peakItem.value} ${t("quintalsPill")}`
                : "0"}
            </span>
          </div>
        </div>

        {/* Right Column: Live Operations Queue Table */}
        <div className="table-panel">
          <div className="table-panel-header">
            <div>
              <h2 className="panel-title">{t("liveQueueTitle")}</h2>
              <p className="panel-subtitle">
                {filteredTokens.length} {t("tokensLabel")} · {t("updatedText")} {secondsAgo}{t("secondsAgoText")}
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
                placeholder={t("searchPlaceholder")}
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

          {/* Interactive Filter Pills Bar */}
          <div className="filter-tabs-row">
            <span className="filter-icon-btn" title="Filter Queue by Status">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
            </span>
            {filterOptions.map((filter) => {
              const count = getCountByStatus(filter.key);
              return (
                <button
                  key={filter.key}
                  className={`filter-pill ${selectedFilter === filter.key ? "active" : ""}`}
                  onClick={() => setSelectedFilter(filter.key)}
                >
                  {filter.label}
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
                  <th>{t("thTokenId")}</th>
                  <th>{t("thFarmer")}</th>
                  <th>{t("thCrop")}</th>
                  <th>{t("thSlot")}</th>
                  <th>{t("thStatus")}</th>
                  <th style={{ textAlign: "right" }}>{t("thAction")}</th>
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
                          {getStatusLabel(item.status)}
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
                        {t("noMatchingTokens")}
                      </div>
                      <p style={{ fontSize: "13px", margin: "0 0 16px" }}>
                        No entries match "{searchQuery}".
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
                  <h3 className="modal-title">{t("modalIssueTitle")}</h3>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {t("modalIssueDesc")}
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
                    <label className="form-label">{t("labelFarmerName")} *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder={t("placeholderFarmerName")}
                      required
                      value={formData.farmer}
                      onChange={(e) => setFormData({ ...formData, farmer: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t("labelPhone")}</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t("labelVillage")}</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder={t("placeholderVillage")}
                      value={formData.village}
                      onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t("labelCropVariety")}</label>
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
                    <label className="form-label">{t("labelQuantity")}</label>
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
                    <label className="form-label">{t("labelAppointmentSlot")}</label>
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
                    <label className="form-label">{t("labelInitialStatus")}</label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Waiting">{t("statusWaiting")} (Gate Entry Pending)</option>
                      <option value="Gate Verified">{t("statusGateVerified")} (Arrived)</option>
                      <option value="In Inspection">{t("statusInInspection")} (Lab Bay)</option>
                      <option value="Paid">{t("statusPaid")} (Procured)</option>
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
                  {t("btnCancel")}
                </button>
                <button type="submit" className="btn-primary">
                  {t("btnGenerateToken")}
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
                <h3 className="modal-title">{t("modalDetailsTitle")}</h3>
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
                <span className="detail-label">{t("labelFarmer")}:</span>
                <span className="detail-value">{selectedToken.farmer}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{t("labelContact")}:</span>
                <span className="detail-value">{selectedToken.phone} ({selectedToken.village})</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{t("labelCommodity")}:</span>
                <span className="detail-value">{selectedToken.crop}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{t("labelQuantityQtl")}:</span>
                <span className="detail-value">{selectedToken.quantity}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{t("labelSlot")}:</span>
                <span className="detail-value" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {selectedToken.slot}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{t("labelMoisture")}:</span>
                <span className="detail-value">{selectedToken.moisture}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{t("labelAssessedGrade")}:</span>
                <span className="detail-value">{selectedToken.grade}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{t("labelMspRate")}:</span>
                <span className="detail-value" style={{ color: "#059669" }}>{selectedToken.price}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{t("labelStatus")}:</span>
                <span className={`status-pill ${getStatusClass(selectedToken.status)}`}>
                  <span className="status-dot"></span>
                  {getStatusLabel(selectedToken.status)}
                </span>
              </div>
              <div className="detail-row" style={{ borderBottom: "none" }}>
                <span className="detail-label">{t("labelTxHash")}:</span>
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
                {t("btnClose")}
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
