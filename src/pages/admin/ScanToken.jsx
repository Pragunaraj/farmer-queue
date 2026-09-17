import { useState } from "react";
import AdminLayout from "./AdminLayout";

const REGISTRY_TOKENS = {
  "AGRI-8402": {
    id: "#AGRI-8402",
    farmer: "Rameshwar Lal",
    phone: "+91 98290 12841",
    village: "Chomu, Jaipur",
    crop: "Wheat (HD-2967)",
    quantity: "45 Quintals",
    slot: "09:00 AM",
    vehicle: "RJ-14-GA-2194 (Tractor-Trolley)",
    status: "Waiting",
    baseMsp: "₹ 2,275 / Qtl",
    txHash: "0x8f3b92c4...e19a2f71",
  },
  "AGRI-8403": {
    id: "#AGRI-8403",
    farmer: "Sunita Devi",
    phone: "+91 94140 88210",
    village: "Bassi, Jaipur",
    crop: "Paddy (PR-114)",
    quantity: "60 Quintals",
    slot: "09:15 AM",
    vehicle: "RJ-14-TB-8812 (Mini Truck)",
    status: "Waiting",
    baseMsp: "₹ 2,183 / Qtl",
    txHash: "0x3e1104a8...bc990145",
  },
  "AGRI-8404": {
    id: "#AGRI-8404",
    farmer: "Bhanwar Singh",
    phone: "+91 97830 55102",
    village: "Amer, Jaipur",
    crop: "Wheat (WH-1105)",
    quantity: "80 Quintals",
    slot: "09:30 AM",
    vehicle: "RJ-14-EA-4109 (Tractor-Trolley)",
    status: "Waiting",
    baseMsp: "₹ 2,275 / Qtl",
    txHash: "0x77d2fa91...990f23cb",
  },
  "AGRI-8405": {
    id: "#AGRI-8405",
    farmer: "Geeta Kumari",
    phone: "+91 99281 77319",
    village: "Dudu, Jaipur",
    crop: "Cotton (Bt)",
    quantity: "35 Quintals",
    slot: "09:45 AM",
    vehicle: "RJ-14-MC-5590 (Pickup)",
    status: "Waiting",
    baseMsp: "₹ 7,020 / Qtl",
    txHash: "0x91a052ff...33c148bb",
  },
  "AGRI-8406": {
    id: "#AGRI-8406",
    farmer: "Mohan Ram",
    phone: "+91 96102 44908",
    village: "Phulera, Jaipur",
    crop: "Paddy (PB-1509)",
    quantity: "55 Quintals",
    slot: "10:00 AM",
    vehicle: "RJ-14-RA-3321 (Tractor-Trolley)",
    status: "Waiting",
    baseMsp: "₹ 2,183 / Qtl",
    txHash: "0x12a99d45...88fe1140",
  },
};

function ScanToken() {
  const [tokenInput, setTokenInput] = useState("");
  const [verifiedToken, setVerifiedToken] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [gateEntries, setGateEntries] = useState([]);
  const [toastMessage, setToastMessage] = useState("");

  const handleVerify = (inputToTest) => {
    const raw = (inputToTest || tokenInput).trim();
    if (!raw) return;

    setHasSearched(true);
    // Normalize format (remove '#', uppercase)
    const normalizedKey = raw.replace(/^#/, "").toUpperCase();

    if (REGISTRY_TOKENS[normalizedKey]) {
      // Check if already in gateEntries
      const existingEntry = gateEntries.find((e) => e.id === REGISTRY_TOKENS[normalizedKey].id);
      if (existingEntry) {
        setVerifiedToken({ ...REGISTRY_TOKENS[normalizedKey], status: "Gate Verified", verifiedAt: existingEntry.timestamp });
      } else {
        setVerifiedToken({ ...REGISTRY_TOKENS[normalizedKey] });
      }
    } else {
      setVerifiedToken(null);
    }
  };

  const handleConfirmEntry = () => {
    if (!verifiedToken) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const updated = {
      ...verifiedToken,
      status: "Gate Verified",
      verifiedAt: timeStr,
      bayAllocated: "Bay 2 (Weighbridge & Assay)",
    };

    setVerifiedToken(updated);
    setGateEntries((prev) => [updated, ...prev.filter((e) => e.id !== updated.id)]);

    setToastMessage(`Gate Entry Confirmed for ${updated.farmer} (${updated.id})`);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const selectChip = (id) => {
    setTokenInput(id);
    handleVerify(id);
  };

  return (
    <AdminLayout>
      <header className="admin-topbar">
        <div className="page-intro">
          <h1 className="text-dark-slate">Token Scanner & Gate Entry</h1>
          <p className="text-subtle-slate">
            Optical QR and token verification for incoming farmer procurement appointments.
          </p>
        </div>
        <div className="topbar-actions">
          <span className="mandi-badge text-dark-slate">
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block" }}></span>
            Gate #01 Scanner Active
          </span>
        </div>
      </header>

      {/* Main Verification Card */}
      <div className="table-panel" style={{ padding: "32px", textAlign: "left" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", width: "100%" }}>
          {/* Header Icon */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: "#ecfdf5",
                color: "#059669",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
                <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
                <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
                <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
                <line x1="7" y1="12" x2="17" y2="12"></line>
              </svg>
            </div>
            <div>
              <h2 className="text-dark-slate" style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>
                Scan or Enter Procurement Token
              </h2>
              <p className="text-subtle-slate" style={{ fontSize: "13.5px", margin: "4px 0 0" }}>
                Verify appointment tokens against today's Mandi registry and grant gate admission.
              </p>
            </div>
          </div>

          {/* Form Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify();
            }}
            style={{ display: "flex", gap: "10px", marginBottom: "16px" }}
          >
            <input
              type="text"
              className="form-input input-high-contrast"
              style={{ fontSize: "15px", padding: "12px 16px", letterSpacing: "0.02em" }}
              placeholder="Enter Token ID (e.g. #AGRI-8402)"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
            />
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: "12px 24px", fontSize: "14px", whiteSpace: "nowrap" }}
            >
              Verify Token
            </button>
          </form>

          {/* Quick Select Chips */}
          <div style={{ marginBottom: "24px" }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#475569", marginRight: "10px" }}>
              Quick Test Tokens:
            </span>
            <div className="quick-chips-row" style={{ display: "inline-flex", marginTop: "6px" }}>
              {["#AGRI-8402", "#AGRI-8403", "#AGRI-8404", "#AGRI-8405", "#AGRI-8406"].map((tId) => (
                <button
                  key={tId}
                  type="button"
                  className="quick-chip"
                  onClick={() => selectChip(tId)}
                >
                  {tId}
                </button>
              ))}
            </div>
          </div>

          {/* Verification Result Card */}
          {verifiedToken ? (
            <div className="verification-card">
              <div className="verification-header">
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "#ecfdf5",
                        color: "#059669",
                        border: "1px solid #a7f3d0",
                        padding: "3px 10px",
                        borderRadius: "9999px",
                        fontSize: "12px",
                        fontWeight: 700,
                      }}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }}></span>
                      Valid Digital Token
                    </span>
                    <span style={{ fontSize: "12px", color: "#475569", fontFamily: "'JetBrains Mono', monospace" }}>
                      Blockchain Synced
                    </span>
                  </div>
                  <h3 className="text-dark-slate" style={{ fontSize: "22px", fontWeight: 800, margin: "8px 0 0 0" }}>
                    {verifiedToken.id}
                  </h3>
                </div>

                <div>
                  <span
                    className={`status-pill ${
                      verifiedToken.status === "Gate Verified" ? "status-gate-verified" : "status-waiting"
                    }`}
                  >
                    <span className="status-dot"></span>
                    {verifiedToken.status}
                  </span>
                </div>
              </div>

              {/* Grid of Verified Fields */}
              <div className="verification-grid">
                <div className="verification-field">
                  <span className="field-label">Farmer Name</span>
                  <span className="field-val text-dark-slate">{verifiedToken.farmer}</span>
                </div>

                <div className="verification-field">
                  <span className="field-label">Contact & Location</span>
                  <span className="field-val text-dark-slate">
                    {verifiedToken.phone}
                    <div style={{ fontSize: "12px", fontWeight: 500, color: "#475569" }}>{verifiedToken.village}</div>
                  </span>
                </div>

                <div className="verification-field">
                  <span className="field-label">Produce & Batch</span>
                  <span className="field-val text-dark-slate">
                    {verifiedToken.crop}
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#059669" }}>{verifiedToken.quantity}</div>
                  </span>
                </div>

                <div className="verification-field">
                  <span className="field-label">Scheduled Slot</span>
                  <span className="field-val text-dark-slate" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {verifiedToken.slot} Today
                  </span>
                </div>

                <div className="verification-field">
                  <span className="field-label">Transport Vehicle</span>
                  <span className="field-val text-dark-slate" style={{ fontSize: "13.5px" }}>
                    {verifiedToken.vehicle}
                  </span>
                </div>

                <div className="verification-field">
                  <span className="field-label">Base MSP Rate</span>
                  <span className="field-val text-dark-slate" style={{ color: "#059669" }}>
                    {verifiedToken.baseMsp}
                  </span>
                </div>
              </div>

              {/* Action Area */}
              <div
                style={{
                  borderTop: "1px solid #e2e8f0",
                  paddingTop: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                {verifiedToken.status === "Gate Verified" ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#0369a1", fontWeight: 600, fontSize: "13.5px" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Gate admission approved at {verifiedToken.verifiedAt} · Direct to Weighbridge Bay 2
                  </div>
                ) : (
                  <div>
                    <span style={{ fontSize: "13px", color: "#475569" }}>
                      Identity and vehicle verified. Ready for gate pass issuance.
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleConfirmEntry}
                  disabled={verifiedToken.status === "Gate Verified"}
                  style={{
                    opacity: verifiedToken.status === "Gate Verified" ? 0.7 : 1,
                    cursor: verifiedToken.status === "Gate Verified" ? "default" : "pointer",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  {verifiedToken.status === "Gate Verified" ? "Gate Entry Confirmed" : "Confirm Gate Entry"}
                </button>
              </div>
            </div>
          ) : hasSearched ? (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fca5a5",
                borderRadius: "var(--radius-md)",
                padding: "20px",
                textAlign: "center",
                color: "#991b1b",
              }}
            >
              <h4 style={{ margin: "0 0 6px 0", fontSize: "15px", fontWeight: 700 }}>Token Not Found</h4>
              <p style={{ margin: 0, fontSize: "13px", color: "#7f1d1d" }}>
                No active procurement appointment matches "{tokenInput}". Please check the token ID or register at the Mandi Helpdesk.
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Recent Gate Admissions History */}
      {gateEntries.length > 0 && (
        <div className="table-panel" style={{ marginTop: "24px" }}>
          <div className="table-panel-header">
            <div>
              <h2 className="panel-title text-dark-slate">Today's Gate Verified Admissions</h2>
              <p className="panel-subtitle text-subtle-slate">{gateEntries.length} vehicles cleared at Gate 1</p>
            </div>
          </div>

          <div className="queue-table-container">
            <table className="queue-table">
              <thead>
                <tr>
                  <th>Token #</th>
                  <th>Farmer</th>
                  <th>Produce</th>
                  <th>Vehicle</th>
                  <th>Time Cleared</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {gateEntries.map((item) => (
                  <tr key={item.id}>
                    <td className="token-cell text-dark-slate">{item.id}</td>
                    <td className="farmer-cell text-dark-slate">{item.farmer}</td>
                    <td className="crop-cell text-dark-slate">{item.crop} ({item.quantity})</td>
                    <td className="slot-cell text-dark-slate">{item.vehicle}</td>
                    <td className="slot-cell text-dark-slate">{item.verifiedAt}</td>
                    <td>
                      <span className="status-pill status-gate-verified">
                        <span className="status-dot"></span>
                        Gate Verified
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="success-toast">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span style={{ fontWeight: 600 }}>{toastMessage}</span>
        </div>
      )}
    </AdminLayout>
  );
}

export default ScanToken;
