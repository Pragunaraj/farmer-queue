import { useMandi } from "../pages/admin/MandiContext";
import { useLanguage } from "../context/LanguageContext";

export default function LiveQueueTracker({ compact = false }) {
  const {
    activeQueueCount,
    waitingVehiclesCount,
    activeBaysCount,
    totalBayCapacity,
    avgProcessingTime,
    overallEstimatedWaitTime,
  } = useMandi();
  const { t } = useLanguage();

  const bayUtilizationPct = Math.round((activeBaysCount / totalBayCapacity) * 100);

  return (
    <div className={`live-queue-tracker-card ${compact ? "tracker-compact" : ""}`}>
      <div className="tracker-header">
        <div className="tracker-title-group">
          <div className="tracker-icon-badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div>
            <h3 className="tracker-main-title">{t("liveQueueTrackerTitle")}</h3>
            {!compact && <p className="tracker-sub-title">{t("liveQueueTrackerSub")}</p>}
          </div>
        </div>

        <div className="telemetry-live-badge">
          <span className="telemetry-pulse-dot"></span>
          <span>{t("liveTelemetryActive")}</span>
        </div>
      </div>

      <div className="telemetry-metrics-grid">
        {/* Tile 1: Active Queue Count */}
        <div className="telemetry-tile tile-emerald">
          <div className="tile-top">
            <span className="tile-label">{t("activeQueueCount")}</span>
            <div className="tile-icon-circle bg-emerald-light text-emerald-dark">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="12" x="3" y="4" rx="2"></rect>
                <line x1="8" y1="20" x2="16" y2="20"></line>
                <line x1="12" y1="16" x2="12" y2="20"></line>
              </svg>
            </div>
          </div>
          <div className="tile-value-row">
            <span className="tile-number text-dark-slate">{activeQueueCount}</span>
            <span className="tile-unit">{t("tokensCount")}</span>
          </div>
          <p className="tile-subtext">
            <strong>{waitingVehiclesCount}</strong> {t("vehiclesWaiting")}
          </p>
        </div>

        {/* Tile 2: Active Bay Capacity */}
        <div className="telemetry-tile tile-blue">
          <div className="tile-top">
            <span className="tile-label">{t("activeBayCapacity")}</span>
            <div className="tile-icon-circle bg-blue-light text-blue-dark">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18"></path>
                <path d="M5 21V7l8-4v18"></path>
                <path d="M19 21V11l-6-4"></path>
                <path d="M9 9h1"></path>
                <path d="M9 13h1"></path>
                <path d="M9 17h1"></path>
              </svg>
            </div>
          </div>
          <div className="tile-value-row">
            <span className="tile-number text-dark-slate">
              {activeBaysCount} <span style={{ fontSize: "16px", color: "#94a3b8", fontWeight: 500 }}>/ {totalBayCapacity}</span>
            </span>
            <span className="tile-unit">{t("baysInUse")}</span>
          </div>
          <div className="telemetry-bay-bar">
            <div
              className="telemetry-bay-fill"
              style={{
                width: `${Math.min(100, Math.max(8, bayUtilizationPct))}%`,
                background: bayUtilizationPct > 75 ? "#f59e0b" : "#2563eb",
              }}
            ></div>
          </div>
        </div>

        {/* Tile 3: Average Processing Time */}
        <div className="telemetry-tile tile-purple">
          <div className="tile-top">
            <span className="tile-label">{t("avgProcessingTime")}</span>
            <div className="tile-icon-circle bg-purple-light text-purple-dark">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
          </div>
          <div className="tile-value-row">
            <span className="tile-number text-dark-slate">{avgProcessingTime}</span>
            <span className="tile-unit">{t("minsLabel")}</span>
          </div>
          <p className="tile-subtext">{t("avgProcessingSub")}</p>
        </div>

        {/* Tile 4: Estimated Wait Time */}
        <div className="telemetry-tile tile-amber">
          <div className="tile-top">
            <span className="tile-label">{t("estimatedWaitTime")}</span>
            <div className="tile-icon-circle bg-amber-light text-amber-dark">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 22h14"></path>
                <path d="M5 2h14"></path>
                <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"></path>
                <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"></path>
              </svg>
            </div>
          </div>
          <div className="tile-value-row">
            <span className="tile-number text-dark-slate">~{overallEstimatedWaitTime}</span>
            <span className="tile-unit">{t("minsLabel")}</span>
          </div>
          <p className="tile-subtext">{t("estimatedWaitSub")}</p>
        </div>
      </div>
    </div>
  );
}
