import { useState } from "react";
import AdminLayout from "./AdminLayout";
import { useMandi } from "./MandiContext";
import { useLanguage } from "../../context/LanguageContext";
import LanguageSelector from "../../components/LanguageSelector";
import "./admin.css";

export default function SystemLogs() {
  const { t } = useLanguage();
  const { voiceLogs, tokens } = useMandi();
  const [activeTab, setActiveTab] = useState("all"); // "all" | "voice" | "telemetry" | "blockchain"
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLogs = voiceLogs.filter((log) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      log.id.toLowerCase().includes(q) ||
      log.farmer.toLowerCase().includes(q) ||
      log.crop.toLowerCase().includes(q) ||
      log.language.toLowerCase().includes(q) ||
      (log.tokenId && log.tokenId.toLowerCase().includes(q))
    );
  });

  return (
    <AdminLayout>
      {/* Top Header */}
      <header className="admin-topbar">
        <div className="page-intro">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.25)",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <div>
              <h1 style={{ fontSize: "20px", fontWeight: "700", margin: 0, color: "var(--text-main)" }}>
                {t("systemLogs") || "System Logs & Audit Trail"}
              </h1>
              <p style={{ fontSize: "12.5px", margin: "2px 0 0 0", color: "var(--text-muted)" }}>
                {t("systemLogsDesc") || "Real-time audit log of Voice AI sessions, queue telemetry, and blockchain transitions"}
              </p>
            </div>
          </div>
        </div>

        <div className="topbar-actions">
          <LanguageSelector />
          <span className="mandi-badge">
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block" }}></span>
            Audit Engine Synced
          </span>
        </div>
      </header>

      {/* KPI Cards Row */}
      <section className="kpi-grid" style={{ marginBottom: "24px" }}>
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">TOTAL VOICE CALLS</span>
            <div className="kpi-icon-pill" style={{ background: "#ecfdf5", color: "#059669" }}>
              🎙️
            </div>
          </div>
          <p className="kpi-value">{voiceLogs.length + 14}</p>
          <div className="kpi-trend positive">
            <span>↑ 98.4% Completion Rate</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">LANGUAGE SWITCHES</span>
            <div className="kpi-icon-pill" style={{ background: "#eff6ff", color: "#2563eb" }}>
              🌐
            </div>
          </div>
          <p className="kpi-value">42 Events</p>
          <div className="kpi-trend positive">
            <span>ENG · HIN · KAN · PUN</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">VOICE TOKENS ISSUED</span>
            <div className="kpi-icon-pill" style={{ background: "#fef3c7", color: "#d97706" }}>
              🎫
            </div>
          </div>
          <p className="kpi-value">{voiceLogs.length}</p>
          <div className="kpi-trend positive">
            <span>100% Pushed to Queue</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">AVG CALL TURNAROUND</span>
            <div className="kpi-icon-pill" style={{ background: "#f5f3ff", color: "#7c3aed" }}>
              ⏱️
            </div>
          </div>
          <p className="kpi-value">1m 34s</p>
          <div className="kpi-trend positive">
            <span>~10-15 Words/turn</span>
          </div>
        </div>
      </section>

      {/* Main Table Panel */}
      <section className="table-panel">
        <div className="table-header">
          <div>
            <h2 className="table-title">Voice AI Call Session Logs</h2>
            <p className="table-subtitle">Turn-by-turn conversational audit records and telemetry hashes</p>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Search by farmer, ID, crop..."
              className="form-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: "7px 12px", fontSize: "13px", width: "240px" }}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Call ID</th>
                <th>Farmer & Kisan ID</th>
                <th>Commodity & Quantity</th>
                <th>Slot Allocated</th>
                <th>Language Target</th>
                <th>Duration</th>
                <th>Outcome & Token</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td>
                    <span className="token-id-cell" style={{ color: "#2563eb", background: "#eff6ff", borderColor: "#bfdbfe" }}>
                      {log.id}
                    </span>
                  </td>
                  <td>
                    <div className="farmer-cell">
                      <span className="farmer-name">{log.farmer}</span>
                      <span className="farmer-village">{log.kisanId}</span>
                    </div>
                  </td>
                  <td>
                    <div className="crop-cell">
                      <span className="crop-name">{log.crop}</span>
                      <span className="crop-qty">{log.quantity}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, fontSize: "12.5px" }}>{log.slot}</span>
                  </td>
                  <td>
                    <span className="channel-badge voice-ai" style={{ fontSize: "11px" }}>
                      {log.language}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}>
                      {log.duration}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span className="status-pill status-completed">
                        <span className="status-dot"></span>
                        {log.status}
                      </span>
                      {log.tokenId && (
                        <span className="token-id-cell">{log.tokenId}</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Telemetry & Blockchain Transition Logs */}
      <section className="table-panel" style={{ marginTop: "24px" }}>
        <div className="table-header">
          <div>
            <h2 className="table-title">Mandi Queue Telemetry & State Transitions</h2>
            <p className="table-subtitle">Immutable state lifecycle: GATE_WAITING → IN_INSPECTION → WEIGHBRIDGE → COMPLETED</p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Token ID</th>
                <th>Farmer</th>
                <th>Current Lifecycle Stage</th>
                <th>Arrival Time</th>
                <th>Assay Lab Start</th>
                <th>Completed Time</th>
                <th>Blockchain Tx</th>
              </tr>
            </thead>
            <tbody>
              {tokens.slice(0, 6).map((item) => (
                <tr key={item.id}>
                  <td>
                    <span className="token-id-cell">{item.id}</span>
                  </td>
                  <td>
                    <span className="farmer-name">{item.farmer}</span>
                  </td>
                  <td>
                    <span
                      className={`status-pill ${
                        item.status === "GATE_WAITING"
                          ? "status-gate-waiting"
                          : item.status === "IN_INSPECTION"
                          ? "status-in-inspection"
                          : item.status === "WEIGHBRIDGE"
                          ? "status-weighbridge"
                          : "status-completed"
                      }`}
                    >
                      <span className="status-dot"></span>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}>
                      {item.arrivalTime ? new Date(item.arrivalTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--"}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}>
                      {item.inspectionStartTime ? new Date(item.inspectionStartTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--"}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}>
                      {item.completedTime ? new Date(item.completedTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--"}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#64748b" }}>
                      {item.txHash}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}
