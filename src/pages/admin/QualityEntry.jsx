import { useState } from "react";
import AdminLayout from "./AdminLayout";

const ACTIVE_TOKENS = [
  { id: "#AGRI-8403", farmer: "Sunita Devi", crop: "Paddy (PR-114)", basePrice: 2183, weight: 60, moisture: 11.2 },
  { id: "#AGRI-8404", farmer: "Bhanwar Singh", crop: "Wheat (WH-1105)", basePrice: 2275, weight: 80, moisture: 10.8 },
  { id: "#AGRI-8406", farmer: "Mohan Ram", crop: "Paddy (PB-1509)", basePrice: 2183, weight: 55, moisture: 12.5 },
  { id: "#AGRI-8407", farmer: "Jagdish Prasad", crop: "Mustard (Pusa-31)", basePrice: 5650, weight: 40, moisture: 7.9 },
  { id: "#AGRI-8408", farmer: "Kamla Choudhary", crop: "Wheat (Sharbati)", basePrice: 2450, weight: 70, moisture: 11.0 },
  { id: "#AGRI-8410", farmer: "Mukesh Gurjar", crop: "Soybean (JS-335)", basePrice: 4892, weight: 65, moisture: 9.8 },
];

const GRADE_MULTIPLIERS = {
  "Grade A (FAQ Standard)": { multiplier: 1.0, badgeColor: "#059669", bg: "#ecfdf5" },
  "Grade B (Fair Quality)": { multiplier: 0.95, badgeColor: "#d97706", bg: "#fffbeb" },
  "Grade C (Under-grade)": { multiplier: 0.88, badgeColor: "#dc2626", bg: "#fef2f2" },
};

function QualityEntry() {
  const [selectedTokenId, setSelectedTokenId] = useState(ACTIVE_TOKENS[1].id); // Default to Bhanwar Singh
  const [weight, setWeight] = useState(80);
  const [moisture, setMoisture] = useState(10.8);
  const [grade, setGrade] = useState("Grade A (FAQ Standard)");
  const [foreignMatter, setForeignMatter] = useState(0.75);
  const [inspectorNotes, setInspectorNotes] = useState("Uniform grain size, no weevil infestation, clean golden luster.");
  const [toastMessage, setToastMessage] = useState("");

  const [qualityHistory, setQualityHistory] = useState([
    {
      id: "#AGRI-8405",
      farmer: "Geeta Kumari",
      crop: "Cotton (Bt)",
      weight: 35,
      moisture: 8.5,
      grade: "Grade A (FAQ Standard)",
      rate: 7020,
      totalPayout: 245700,
      timestamp: "09:50 AM",
      txHash: "0x91a0...33c1",
    },
    {
      id: "#AGRI-8409",
      farmer: "Devendra Yadav",
      crop: "Bajra (HHB-67)",
      weight: 50,
      moisture: 9.2,
      grade: "Grade A (FAQ Standard)",
      rate: 2500,
      totalPayout: 125000,
      timestamp: "10:52 AM",
      txHash: "0x22be...440d",
    },
  ]);

  // Current token info
  const currentToken = ACTIVE_TOKENS.find((t) => t.id === selectedTokenId) || ACTIVE_TOKENS[0];

  // Calculate Moisture Penalty
  // Optimal <= 12%, 12.1% - 14% -> 2% dockage, >14% -> 5% dockage
  const moistureDockage = moisture <= 12.0 ? 0 : moisture <= 14.0 ? 0.02 : 0.05;

  // Grade adjustment
  const gradeMultiplier = GRADE_MULTIPLIERS[grade]?.multiplier || 1.0;

  // Net Rate calculation
  const effectiveMultiplier = gradeMultiplier - moistureDockage;
  const netRatePerQtl = Math.round(currentToken.basePrice * effectiveMultiplier);
  const totalPayout = Math.round(weight * netRatePerQtl);

  const handleTokenChange = (e) => {
    const nextId = e.target.value;
    setSelectedTokenId(nextId);
    const found = ACTIVE_TOKENS.find((t) => t.id === nextId);
    if (found) {
      setWeight(found.weight);
      setMoisture(found.moisture);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const randomTx = `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`;
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newRecord = {
      id: currentToken.id,
      farmer: currentToken.farmer,
      crop: currentToken.crop,
      weight: Number(weight),
      moisture: Number(moisture),
      grade: grade,
      rate: netRatePerQtl,
      totalPayout: totalPayout,
      timestamp: timeStr,
      txHash: randomTx,
    };

    setQualityHistory([newRecord, ...qualityHistory]);
    setToastMessage(`Quality Certified: ${currentToken.id} Payout ₹ ${totalPayout.toLocaleString()}`);
    setTimeout(() => setToastMessage(""), 4000);
  };

  return (
    <AdminLayout>
      <header className="admin-topbar">
        <div className="page-intro">
          <h1 className="text-dark-slate">Quality Inspection & Assay</h1>
          <p className="text-subtle-slate">
            Laboratory moisture measurement, FAQ grading, and automatic MSP payout calculation.
          </p>
        </div>
        <div className="topbar-actions">
          <span className="mandi-badge text-dark-slate">
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block" }}></span>
            Laboratory Bay #02 Active
          </span>
        </div>
      </header>

      {/* Main Inspection Form Panel */}
      <div className="table-panel" style={{ padding: "32px", textAlign: "left" }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <div>
              <h2 className="text-dark-slate" style={{ fontSize: "19px", fontWeight: 700, margin: 0 }}>
                Produce Assay Record Entry
              </h2>
              <p className="text-subtle-slate" style={{ fontSize: "13.5px", margin: "4px 0 0" }}>
                Select an enqueued farmer batch to verify laboratory readings.
              </p>
            </div>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                background: "#f1f5f9",
                color: "#0f172a",
                padding: "6px 14px",
                borderRadius: "9999px",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              Base MSP: ₹ {currentToken.basePrice} / Qtl
            </span>
          </div>

          <div className="form-grid" style={{ marginBottom: "20px" }}>
            {/* Token Selector */}
            <div className="form-group full-width">
              <label className="form-label text-dark-slate">Select Verified Farmer Token *</label>
              <select
                className="form-select input-high-contrast"
                style={{ fontSize: "14px", fontWeight: 600 }}
                value={selectedTokenId}
                onChange={handleTokenChange}
              >
                {ACTIVE_TOKENS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.id} — {t.farmer} ({t.crop}) — Batch: {t.weight} Qtl
                  </option>
                ))}
              </select>
            </div>

            {/* Batch Weight */}
            <div className="form-group">
              <label className="form-label text-dark-slate">Weighbridge Net Weight (Quintals) *</label>
              <input
                type="number"
                step="0.5"
                min="1"
                className="form-input input-high-contrast"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                required
              />
            </div>

            {/* Moisture % */}
            <div className="form-group">
              <label className="form-label text-dark-slate">
                Moisture Meter Reading (%) *{" "}
                <span style={{ color: moisture <= 12 ? "#059669" : "#d97706", fontWeight: 600 }}>
                  ({moisture <= 12 ? "Optimal Standard" : moisture <= 14 ? "2% Dockage" : "5% High Moisture Dockage"})
                </span>
              </label>
              <input
                type="number"
                step="0.1"
                min="5"
                max="25"
                className="form-input input-high-contrast"
                value={moisture}
                onChange={(e) => setMoisture(Number(e.target.value))}
                required
              />
            </div>

            {/* Quality Grade */}
            <div className="form-group">
              <label className="form-label text-dark-slate">Certified Quality Grade *</label>
              <select
                className="form-select input-high-contrast"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              >
                <option value="Grade A (FAQ Standard)">Grade A (FAQ Standard - 100% MSP)</option>
                <option value="Grade B (Fair Quality)">Grade B (Fair Quality - 95% MSP)</option>
                <option value="Grade C (Under-grade)">Grade C (Under-grade - 88% MSP)</option>
              </select>
            </div>

            {/* Foreign Matter Admixture % */}
            <div className="form-group">
              <label className="form-label text-dark-slate">Foreign Matter / Inert Material (%)</label>
              <input
                type="number"
                step="0.05"
                min="0"
                max="10"
                className="form-input input-high-contrast"
                value={foreignMatter}
                onChange={(e) => setForeignMatter(Number(e.target.value))}
              />
            </div>

            {/* Inspector Notes */}
            <div className="form-group full-width">
              <label className="form-label text-dark-slate">Inspector Remarks & Visual Assessment</label>
              <input
                type="text"
                className="form-input input-high-contrast"
                value={inspectorNotes}
                onChange={(e) => setInspectorNotes(e.target.value)}
                placeholder="Physical grain texture, luster, absence of pest damage"
              />
            </div>
          </div>

          {/* Live Calculated MSP Payout Box */}
          <div className="payout-calculation-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>
                Dynamic MSP Settlement Computation
              </span>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: GRADE_MULTIPLIERS[grade].badgeColor,
                  background: GRADE_MULTIPLIERS[grade].bg,
                  padding: "4px 10px",
                  borderRadius: "9999px",
                }}
              >
                {grade}
              </span>
            </div>

            <div className="payout-row">
              <span>Selected Produce:</span>
              <span className="text-dark-slate" style={{ fontWeight: 600 }}>
                {currentToken.crop} ({currentToken.farmer})
              </span>
            </div>

            <div className="payout-row">
              <span>Govt Official Base MSP:</span>
              <span className="text-dark-slate" style={{ fontWeight: 600 }}>
                ₹ {currentToken.basePrice.toLocaleString()} / Quintal
              </span>
            </div>

            <div className="payout-row">
              <span>Grade Adjustment & Moisture Dockage:</span>
              <span style={{ color: effectiveMultiplier < 1 ? "#dc2626" : "#059669", fontWeight: 600 }}>
                {Math.round(effectiveMultiplier * 100)}% of Base Rate (
                {moistureDockage > 0 ? `-${Math.round(moistureDockage * 100)}% moisture` : "No moisture penalty"}
                )
              </span>
            </div>

            <div className="payout-row">
              <span>Final Certified Rate:</span>
              <span className="text-dark-slate" style={{ fontWeight: 700 }}>
                ₹ {netRatePerQtl.toLocaleString()} / Quintal
              </span>
            </div>

            <div className="payout-row total-row">
              <span>Total Farmer Disbursement ({weight} Quintals):</span>
              <span className="payout-grand-total">₹ {totalPayout.toLocaleString()}</span>
            </div>
          </div>

          {/* Submit Action */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: "12px 28px", fontSize: "14px" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Submit Quality Record & Sign Escrow
            </button>
          </div>
        </form>
      </div>

      {/* Quality Inspection History Ledger */}
      <div className="table-panel" style={{ marginTop: "24px" }}>
        <div className="table-panel-header">
          <div>
            <h2 className="panel-title text-dark-slate">Today's Quality Inspection Ledger</h2>
            <p className="panel-subtitle text-subtle-slate">
              {qualityHistory.length} batches graded and approved for blockchain payment
            </p>
          </div>
        </div>

        <div className="queue-table-container">
          <table className="queue-table">
            <thead>
              <tr>
                <th>Token #</th>
                <th>Farmer</th>
                <th>Crop & Batch</th>
                <th>Moisture</th>
                <th>Assigned Grade</th>
                <th>Net Rate</th>
                <th>Total Payout</th>
                <th>Time & Tx</th>
              </tr>
            </thead>
            <tbody>
              {qualityHistory.map((rec, idx) => (
                <tr key={idx}>
                  <td className="token-cell text-dark-slate">{rec.id}</td>
                  <td className="farmer-cell text-dark-slate">{rec.farmer}</td>
                  <td className="crop-cell text-dark-slate">{rec.crop} ({rec.weight} Qtl)</td>
                  <td className="slot-cell text-dark-slate">{rec.moisture}%</td>
                  <td>
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: "9999px",
                        background: GRADE_MULTIPLIERS[rec.grade]?.bg || "#ecfdf5",
                        color: GRADE_MULTIPLIERS[rec.grade]?.badgeColor || "#059669",
                      }}
                    >
                      {rec.grade.split(" ")[0]} {rec.grade.split(" ")[1]}
                    </span>
                  </td>
                  <td className="slot-cell text-dark-slate" style={{ fontWeight: 600 }}>
                    ₹ {rec.rate.toLocaleString()}
                  </td>
                  <td style={{ fontWeight: 800, color: "#059669", fontFamily: "'JetBrains Mono', monospace" }}>
                    ₹ {rec.totalPayout.toLocaleString()}
                  </td>
                  <td className="slot-cell text-dark-slate">
                    <div>{rec.timestamp}</div>
                    <div style={{ fontSize: "10.5px", color: "#64748b" }}>{rec.txHash}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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

export default QualityEntry;
