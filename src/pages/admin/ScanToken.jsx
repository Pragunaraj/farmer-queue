import { useState, useRef, useEffect, useCallback } from "react";
import jsQR from "jsqr";
import AdminLayout from "./AdminLayout";
import { useMandi } from "./MandiContext";
import { useLanguage } from "../../context/LanguageContext";
import LanguageSelector from "../../components/LanguageSelector";
import LiveQueueTracker from "../../components/LiveQueueTracker";

function ScanToken() {
  const { t } = useLanguage();
  const {
    tokens,
    updateTokenStatus,
    advanceTokenState,
    getTokenEstimatedWait,
    getTokensAhead,
    QUEUE_STATUSES,
    stats,
    recordScan,
  } = useMandi();

  const [activeTab, setActiveTab] = useState("camera"); // "camera" | "manual"
  const [isScanning, setIsScanning] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [currentStep, setCurrentStep] = useState(1); // 1: Scan, 2: Review, 3: Approved
  const [scannedToken, setScannedToken] = useState(null);
  const [scanFeedback, setScanFeedback] = useState("");
  const [scanError, setScanError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isSampleQrModalOpen, setIsSampleQrModalOpen] = useState(false);

  // Webcam State
  const [cameraStatus, setCameraStatus] = useState("idle"); // "idle" | "requesting" | "active" | "denied" | "unavailable"
  const [cameraErrorMsg, setCameraErrorMsg] = useState("");
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  // List of pending "Waiting" tokens
  const waitingTokens = tokens.filter(
    (t) =>
      t.status === (QUEUE_STATUSES?.GATE_WAITING || "GATE_WAITING") ||
      t.status === "Waiting" ||
      t.status === "Gate Verified"
  );

  // =========================================================================
  // Audio Beep Feedback (Handheld Scanner Chime)
  // =========================================================================
  const playScannerBeep = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.13);
    } catch (e) {
      console.warn("AudioContext error", e);
    }
  };

  // =========================================================================
  // Webcam Initialization & Teardown
  // =========================================================================
  const startCamera = async () => {
    if (!navigator?.mediaDevices?.getUserMedia) {
      setCameraStatus("unavailable");
      setCameraErrorMsg("Webcam API (getUserMedia) is not supported in this browser.");
      return;
    }

    setCameraStatus("requesting");
    setCameraErrorMsg("");

    try {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch((e) => console.warn("Video play interrupted", e));
        };
      }
      setCameraStatus("active");
    } catch (err) {
      console.warn("Webcam access error:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setCameraStatus("denied");
        setCameraErrorMsg("Camera access was blocked by browser permissions. Please allow camera permissions or switch to manual entry.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setCameraStatus("unavailable");
        setCameraErrorMsg("No camera device was detected on your system.");
      } else {
        setCameraStatus("denied");
        setCameraErrorMsg(err.message || "Failed to initialize webcam video stream.");
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setCameraStatus("idle");
    setIsScanning(false);
  };

  // Camera setup and teardown intentionally update local state as an external resource changes.
  useEffect(() => {
    if (activeTab === "camera") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [activeTab]);

  // =========================================================================
  // Real-Time Frame-by-Frame QR Code Parser Loop (jsQR)
  // =========================================================================
  // The animation loop intentionally schedules its own next frame.
  const scanVideoFrame = useCallback(() => {
    if (!isScanning || cameraStatus !== "active") return;

    const video = videoRef.current;

    if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
      if (!canvasRef.current) {
        canvasRef.current = document.createElement("canvas");
      }
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Real JavaScript QR code extraction
      const decoded = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (decoded && decoded.data && decoded.data.trim()) {
        const rawString = decoded.data.trim();
        console.log("Live QR Captured from Camera:", rawString);

        // Strict Format Validation: Must match "#AGRI-XXXX" or "AGRI-XXXX"
        const tokenMatch = rawString.match(/#?AGRI-\d+/i);

        if (tokenMatch) {
          const matchedId = tokenMatch[0].toUpperCase().replace(/^#?/, "#");

          // Look up in actual Mandi registry
          const found = tokens.find(
            (t) =>
              t.id.toUpperCase() === matchedId ||
              t.id.replace(/^#/, "").toUpperCase() === matchedId.replace(/^#/, "")
          );

          if (found) {
            // Real QR code successfully identified!
            playScannerBeep();
            setIsScanning(false);
            setScannedToken({ ...found });
            setCurrentStep(2); // Advance to Step 2
            setScanFeedback("");
            setToastMessage(`Decoded Token ${found.id}: ${found.farmer}`);
            setTimeout(() => setToastMessage(""), 4000);
            return; // Exit loop on successful match
          } else {
            setScanFeedback(`QR Code "${matchedId}" is not in today's active Mandi schedule.`);
          }
        } else {
          setScanFeedback(`Invalid QR format: "${rawString.substring(0, 20)}...". Expected #AGRI-XXXX.`);
        }
      }
    }

    // Continue frame processing loop (no timeout or fake auto-verify)
    // eslint-disable-next-line react-hooks/immutability
    animationFrameRef.current = requestAnimationFrame(scanVideoFrame);
  }, [isScanning, cameraStatus, tokens]);

  // Trigger scan loop when isScanning changes
  useEffect(() => {
    if (isScanning && cameraStatus === "active") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setScanFeedback("");
      setScanError("");
      animationFrameRef.current = requestAnimationFrame(scanVideoFrame);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isScanning, cameraStatus, scanVideoFrame]);

  // Toggle Camera Scanning
  const toggleScanning = () => {
    if (isScanning) {
      setIsScanning(false);
      setScanFeedback("");
    } else {
      if (cameraStatus !== "active") {
        startCamera();
      }
      setIsScanning(true);
    }
  };

  // =========================================================================
  // Manual Entry Safety Override
  // =========================================================================
  const handleManualVerify = (tokenStringToTest) => {
    const raw = (tokenStringToTest || manualInput).trim();
    if (!raw) return;

    setScanError("");
    const normalized = raw.replace(/^#/, "").toUpperCase();

    const match = tokens.find(
      (t) => t.id.replace(/^#/, "").toUpperCase() === normalized
    );

    if (match) {
      setScannedToken({ ...match });
      setCurrentStep(2);
      setToastMessage(`Token ${match.id} loaded for verification`);
      setTimeout(() => setToastMessage(""), 3500);
    } else {
      setScanError(`Token "${raw}" not found in today's active schedule.`);
      setScannedToken(null);
    }
  };

  // Step 3: Gate Entry Approval
  const handleApproveEntry = () => {
    if (!scannedToken) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const gateWaitingStatus = QUEUE_STATUSES?.GATE_WAITING || "GATE_WAITING";
    const now = Date.now();

    // Update global shared state
    updateTokenStatus(scannedToken.id, gateWaitingStatus, {
      verifiedAt: timeStr,
      arrivalTime: scannedToken.arrivalTime || now,
      bayAllocated: "Bay 2 (Weighbridge & Assay)",
    });

    // Increment approved stats
    recordScan(true);

    setScannedToken((prev) => ({
      ...prev,
      status: gateWaitingStatus,
      arrivalTime: prev.arrivalTime || now,
    }));

    setCurrentStep(3);
    setToastMessage(`Gate Pass Issued for ${scannedToken.farmer} (${scannedToken.id})`);
    setTimeout(() => setToastMessage(""), 4500);
  };

  // Step 3: Gate Entry Rejection
  const handleRejectEntry = () => {
    if (!scannedToken) return;

    recordScan(false);
    setToastMessage(`Entry Rejected for ${scannedToken.id}: Incomplete Documentation`);
    setTimeout(() => setToastMessage(""), 4000);

    handleResetScanner();
  };

  // Reset to scan next vehicle
  const handleResetScanner = () => {
    setCurrentStep(1);
    setScannedToken(null);
    setManualInput("");
    setScanError("");
    setScanFeedback("");
    setIsScanning(false);
  };

  return (
    <AdminLayout>
      {/* Top Page Header */}
      <header className="admin-topbar" style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "#ecfdf5",
              color: "#059669",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
              <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
              <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
              <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
              <line x1="7" y1="12" x2="17" y2="12"></line>
            </svg>
          </div>
          <div>
            <h1 className="text-dark-slate" style={{ fontSize: "22px", fontWeight: 700, margin: 0 }}>
              {t("scannerPageTitle")}
            </h1>
            <p className="text-subtle-slate" style={{ fontSize: "13.5px", margin: "3px 0 0 0" }}>
              {t("scannerPageSubtitle")}
            </p>
          </div>
        </div>

        <div className="topbar-actions">
          <LanguageSelector />
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setIsSampleQrModalOpen(true)}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="5" height="5" x="3" y="3" rx="1"></rect>
              <rect width="5" height="5" x="16" y="3" rx="1"></rect>
              <rect width="5" height="5" x="3" y="16" rx="1"></rect>
            </svg>
            {t("btnShowSampleQr")}
          </button>
          <span className="mandi-badge text-dark-slate">
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block" }}></span>
            {t("gateOpticalReady")}
          </span>
        </div>
      </header>

      {/* Real-time Telemetry & Queue Tracker Banner */}
      <div style={{ marginBottom: "20px" }}>
        <LiveQueueTracker compact={true} />
      </div>

      {/* Main 2-Column Scanner Interface */}
      <div className="scanner-page-grid">
        {/* Left Column: Viewfinder & Controls */}
        <div className="scanner-left-panel">
          {/* Tabs: Camera Scan vs Manual Entry */}
          <div className="scanner-mode-tabs">
            <button
              type="button"
              className={`scanner-tab-pill ${activeTab === "camera" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("camera");
                setScanError("");
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
              {t("tabCameraScan")}
            </button>

            <button
              type="button"
              className={`scanner-tab-pill ${activeTab === "manual" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("manual");
                setScanError("");
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                <line x1="6" y1="10" x2="6" y2="10"></line>
                <line x1="10" y1="10" x2="10" y2="10"></line>
                <line x1="14" y1="10" x2="14" y2="10"></line>
                <line x1="18" y1="10" x2="18" y2="10"></line>
              </svg>
              {t("tabManualEntry")}
            </button>
          </div>

          {/* Tab 1: Live Webcam Viewfinder */}
          {activeTab === "camera" && (
            <div className="camera-viewfinder-box">
              {/* Actual Live Video Feed */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-video-stream"
                style={{ display: cameraStatus === "active" ? "block" : "none" }}
              />

              {/* Live Status Pill */}
              {cameraStatus === "active" && (
                <div className="camera-badge-live">
                  <span className="live-dot"></span>
                  {isScanning ? t("badgeParsingFrames") : t("badgeLiveWebcam")}
                </div>
              )}

              {/* 4 Emerald Corner Brackets */}
              <div className="camera-corner corner-tl"></div>
              <div className="camera-corner corner-tr"></div>
              <div className="camera-corner corner-bl"></div>
              <div className="camera-corner corner-br"></div>

              {/* Active Laser Sweep Line */}
              {isScanning && <div className="laser-scanner-line"></div>}

              {/* Center Content / Frame Guide */}
              {cameraStatus === "active" && (
                <div
                  className="camera-idle-content"
                  style={{
                    background: isScanning ? "rgba(10, 17, 34, 0.65)" : "transparent",
                    backdropFilter: isScanning ? "blur(4px)" : "none",
                    borderRadius: "14px",
                    padding: "16px 24px",
                    maxWidth: "340px",
                  }}
                >
                  {isScanning ? (
                    <>
                      <div className="qr-icon-circle" style={{ borderColor: "#10b981", color: "#10b981" }}>
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="5" height="5" x="3" y="3" rx="1"></rect>
                          <rect width="5" height="5" x="16" y="3" rx="1"></rect>
                          <rect width="5" height="5" x="3" y="16" rx="1"></rect>
                          <line x1="12" y1="7" x2="12" y2="17"></line>
                          <line x1="7" y1="12" x2="17" y2="12"></line>
                        </svg>
                      </div>
                      <p className="camera-title-text" style={{ color: "#ffffff", fontWeight: 700 }}>
                        {t("searchQrTitle")}
                      </p>
                      <p className="camera-sub-text" style={{ color: "#a7f3d0", fontSize: "12px" }}>
                        {t("searchQrSub")}
                      </p>
                    </>
                  ) : currentStep > 1 && scannedToken ? (
                    <>
                      <div className="qr-icon-circle" style={{ borderColor: "#10b981", color: "#10b981", background: "rgba(16, 185, 129, 0.15)" }}>
                        ✓
                      </div>
                      <p className="camera-title-text" style={{ color: "#ffffff" }}>
                        Token {scannedToken.id} Verified
                      </p>
                      <p className="camera-sub-text" style={{ color: "#94a3b8" }}>
                        {scannedToken.farmer} · {scannedToken.crop}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="qr-icon-circle">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="5" height="5" x="3" y="3" rx="1"></rect>
                          <rect width="5" height="5" x="16" y="3" rx="1"></rect>
                          <rect width="5" height="5" x="3" y="16" rx="1"></rect>
                          <path d="M21 16h-3a2 2 0 0 0-2 2v3"></path>
                          <path d="M21 21v.01"></path>
                          <path d="M12 7v3a2 2 0 0 1-2 2H7"></path>
                        </svg>
                      </div>
                      <p className="camera-title-text">{t("posQrTitle")}</p>
                      <p className="camera-sub-text">{t("posQrSub")}</p>
                    </>
                  )}
                </div>
              )}

              {/* Connecting / Requesting Permission View */}
              {cameraStatus === "requesting" && (
                <div className="camera-idle-content">
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      border: "3px solid rgba(255, 255, 255, 0.2)",
                      borderTopColor: "#10b981",
                      animation: "spin 1s infinite linear",
                    }}
                  ></div>
                  <p className="camera-title-text">{t("connectingWebcam")}</p>
                  <p className="camera-sub-text">{t("allowCameraPerm")}</p>
                </div>
              )}

              {/* Fallback if Camera Permission Denied or Unavailable */}
              {(cameraStatus === "denied" || cameraStatus === "unavailable") && (
                <div className="camera-permission-fallback">
                  <div className="camera-fallback-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                      <path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34"></path>
                      <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                  </div>
                  <h4 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#f8fafc" }}>
                    {cameraStatus === "unavailable" ? "No Camera Detected" : "Webcam Permission Denied"}
                  </h4>
                  <p style={{ margin: 0, fontSize: "12.5px", color: "#cbd5e1", lineHeight: 1.5 }}>
                    {cameraErrorMsg}
                  </p>
                  <div style={{ display: "flex", gap: "10px", marginTop: "6px", width: "100%" }}>
                    <button
                      type="button"
                      className="btn-primary"
                      style={{ flex: 1, padding: "8px 12px", fontSize: "12.5px" }}
                      onClick={() => setActiveTab("manual")}
                    >
                      {t("btnSwitchManual")}
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ padding: "8px 12px", fontSize: "12.5px", background: "transparent", color: "#ffffff", borderColor: "#475569" }}
                      onClick={startCamera}
                    >
                      {t("btnRetryCamera")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Manual Input Entry Override */}
          {activeTab === "manual" && (
            <div
              className="table-panel"
              style={{
                padding: "32px",
                height: 400,
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <h3 className="text-dark-slate" style={{ fontSize: "17px", fontWeight: 700, margin: "0 0 8px 0" }}>
                {t("manualEntryTitle")}
              </h3>
              <p className="text-subtle-slate" style={{ fontSize: "13px", margin: "0 0 20px 0" }}>
                {t("manualEntrySub")}
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleManualVerify();
                }}
                style={{ display: "flex", gap: "10px", marginBottom: "18px" }}
              >
                <input
                  type="text"
                  className="form-input input-high-contrast"
                  placeholder={t("placeholderTokenSearch")}
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  style={{ fontSize: "15px", padding: "12px 16px" }}
                />
                <button type="submit" className="btn-primary" style={{ padding: "12px 20px" }}>
                  {t("btnVerifyToken")}
                </button>
              </form>

              <div>
                <span style={{ fontSize: "11.5px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                  {t("scheduledArrivalQueue")}
                </span>
                <div className="quick-chips-row" style={{ marginTop: "8px" }}>
                  {waitingTokens.length > 0 ? (
                    waitingTokens.slice(0, 5).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className="quick-chip"
                        onClick={() => {
                          setManualInput(item.id);
                          handleManualVerify(item.id);
                        }}
                      >
                        {item.id} ({item.farmer.split(" ")[0]}) · ~{getTokenEstimatedWait(item.id)}m
                      </button>
                    ))
                  ) : (
                    <span style={{ fontSize: "12px", color: "#10b981", fontWeight: 600 }}>
                      {t("allTokensVerified")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Button: Start/Stop Scan on Camera Tab */}
          {activeTab === "camera" && (
            <button
              type="button"
              className={`btn-start-scan ${isScanning ? "is-scanning" : ""}`}
              onClick={toggleScanning}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                {isScanning ? (
                  <>
                    <rect x="6" y="6" width="12" height="12" rx="2"></rect>
                  </>
                ) : (
                  <>
                    <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
                    <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
                    <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
                    <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
                    <line x1="7" y1="12" x2="17" y2="12"></line>
                  </>
                )}
              </svg>
              {isScanning ? t("btnStopScan") : t("btnStartScan")}
            </button>
          )}

          {/* Live Scanning Feedback or Error */}
          {scanFeedback && (
            <div
              style={{
                background: "#fffbeb",
                border: "1px solid #fde68a",
                borderRadius: "var(--radius-sm)",
                padding: "12px 16px",
                color: "#92400e",
                fontSize: "13px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>⚠️</span>
              <span>{scanFeedback}</span>
            </div>
          )}

          {scanError && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "var(--radius-sm)",
                padding: "12px 16px",
                color: "#991b1b",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              {scanError}
            </div>
          )}
        </div>

        {/* Right Column: 3-Step Process Stepper, Tamper-Proof & Stats */}
        <div className="scanner-right-panel">
          {/* Card 1: Gate Verification Process Stepper */}
          <div className="stepper-process-card">
            <h3 className="stepper-header-title">{t("processTitle")}</h3>

            <div className="stepper-list">
              {/* Step 1: Scan QR / Enter Token */}
              <div className="stepper-item">
                <div
                  className={`step-indicator ${
                    currentStep === 1 ? "active" : currentStep > 1 ? "done" : "pending"
                  }`}
                >
                  {currentStep > 1 ? "✓" : "1"}
                </div>
                <div className="step-content">
                  <div className="step-title-row">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
                      <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
                      <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
                      <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
                    </svg>
                    {t("step1Title")}
                  </div>
                  <p className="step-desc-text">
                    {isScanning
                      ? t("step1DescScanning")
                      : cameraStatus === "active"
                      ? t("step1DescCameraActive")
                      : t("step1DescDefault")}
                  </p>
                </div>
              </div>

              {/* Step 2: Review Farmer Profile */}
              <div className="stepper-item">
                <div
                  className={`step-indicator ${
                    currentStep === 2 ? "active" : currentStep > 2 ? "done" : "pending"
                  }`}
                >
                  {currentStep > 2 ? "✓" : "2"}
                </div>
                <div className="step-content">
                  <div className="step-title-row">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    {t("step2Title")}
                  </div>
                  <p className="step-desc-text">{t("step2Desc")}</p>
                </div>
              </div>

              {/* Step 3: Approve Gate Entry */}
              <div className="stepper-item">
                <div
                  className={`step-indicator ${
                    currentStep === 3 ? "active done" : "pending"
                  }`}
                >
                  {currentStep === 3 ? "✓" : "3"}
                </div>
                <div className="step-content">
                  <div className="step-title-row">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    {t("step3Title")}
                  </div>
                  <p className="step-desc-text">{t("step3Desc")}</p>
                </div>
              </div>
            </div>

            {/* Step 2 Review Profile Card (Only shown after a valid QR is decoded) */}
            {scannedToken && currentStep === 2 && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "18px",
                  background: "#f8fafc",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid #cbd5e1",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  animation: "fadeIn 0.25s ease-out",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 800, fontSize: "16px", color: "#0f172a" }}>
                    {scannedToken.id}
                  </span>
                  <span className={`status-pill ${scannedToken.status === (QUEUE_STATUSES?.GATE_WAITING || "GATE_WAITING") ? "status-gate-waiting" : "status-waiting"}`}>
                    <span className="status-dot"></span>
                    {scannedToken.status}
                  </span>
                </div>

                <div style={{ fontSize: "13px", color: "#334155" }}>
                  <strong>{t("labelFarmer")}:</strong> {scannedToken.farmer} ({scannedToken.phone})
                </div>
                <div style={{ fontSize: "13px", color: "#334155" }}>
                  <strong>{t("labelCommodity")}:</strong> {scannedToken.crop} · <strong>{t("labelQuantityQtl")}:</strong> {scannedToken.quantity}
                </div>
                <div style={{ fontSize: "13px", color: "#334155" }}>
                  <strong>{t("thTruckCarrier")}:</strong> {scannedToken.vehicle || "RJ-14-GA-2194"}
                </div>
                <div style={{ fontSize: "12.5px", color: "#d97706", fontWeight: 600, background: "#fef3c7", padding: "6px 10px", borderRadius: "6px", border: "1px solid #fde68a" }}>
                  ⏱️ {t("estWaitCol")}: ~{getTokenEstimatedWait(scannedToken.id)} {t("minsLabel")} ({getTokensAhead(scannedToken.id)} {t("tokensAheadLabel")})
                </div>
                <div style={{ fontSize: "12px", color: "#059669", fontWeight: 600 }}>
                  {t("govAadhaarVerified")}
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ flex: 1, padding: "10px" }}
                    onClick={handleApproveEntry}
                  >
                    {t("btnApproveEntry")}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ padding: "10px 14px", color: "#dc2626", borderColor: "#fecaca" }}
                    onClick={handleRejectEntry}
                  >
                    {t("btnReject")}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 Confirmation Details */}
            {scannedToken && currentStep === 3 && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "18px",
                  background: "#ecfdf5",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid #a7f3d0",
                  textAlign: "center",
                  animation: "fadeIn 0.25s ease-out",
                }}
              >
                <div style={{ color: "#059669", fontSize: "24px", marginBottom: "4px" }}>✓</div>
                <h4 style={{ margin: "0 0 6px 0", fontSize: "16px", color: "#065f46" }}>
                  {t("gatePassIssuedText")}: #GP-{scannedToken.id.replace(/\D/g, "")}
                </h4>
                <p style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#047857" }}>
                  {scannedToken.farmer} {t("clearedForEntryText")}
                </p>

                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    margin: "0 0 12px 0",
                    border: "1px solid #d1fae5",
                    fontSize: "12.5px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ color: "#065f46", fontWeight: 600 }}>{t("estWaitCol")}:</span>
                  <span style={{ color: "#d97706", fontWeight: 700 }}>
                    ~{getTokenEstimatedWait(scannedToken.id)} {t("minsLabel")}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {scannedToken.status !== (QUEUE_STATUSES?.COMPLETED || "COMPLETED") && (
                    <button
                      type="button"
                      className="btn-advance-queue btn-advance-inspect"
                      style={{ width: "100%", justifyContent: "center" }}
                      onClick={() => {
                        advanceTokenState(scannedToken.id);
                        setToastMessage(`${scannedToken.id} advanced to Inspection!`);
                        setScannedToken((prev) => ({
                          ...prev,
                          status: QUEUE_STATUSES?.IN_INSPECTION || "IN_INSPECTION",
                        }));
                      }}
                    >
                      {t("btnStartInspection")}
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ width: "100%", padding: "10px" }}
                    onClick={handleResetScanner}
                  >
                    {t("btnScanNextVehicle")}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Tamper-Proof Verification */}
          <div className="tamper-proof-card">
            <div className="tamper-proof-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <polyline points="9 12 11 14 15 10"></polyline>
              </svg>
            </div>
            <div>
              <h4 className="tamper-proof-title">{t("tamperProofTitle")}</h4>
              <p className="tamper-proof-body">
                {t("tamperProofBody")}
              </p>
            </div>
          </div>

          {/* Card 3: Trio of Stats */}
          <div className="scanner-stats-row">
            <div className="scanner-stat-card">
              <p className="scanner-stat-num text-dark-slate">{stats.scannedToday}</p>
              <p className="scanner-stat-label">{t("statScannedToday")}</p>
            </div>

            <div className="scanner-stat-card">
              <p className="scanner-stat-num" style={{ color: "#059669" }}>
                {stats.approved}
              </p>
              <p className="scanner-stat-label">{t("statApproved")}</p>
            </div>

            <div className="scanner-stat-card">
              <p className="scanner-stat-num" style={{ color: "#dc2626" }}>
                {stats.rejected}
              </p>
              <p className="scanner-stat-label">{t("statRejected")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Helper Modal: Display Scannable Sample Farmer QR Code */}
      {isSampleQrModalOpen && (
        <div className="modal-overlay" onClick={() => setIsSampleQrModalOpen(false)}>
          <div className="modal-dialog" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">{t("modalSampleQrTitle")}</h3>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {t("modalSampleQrSub")}
                </span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsSampleQrModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body" style={{ textAlign: "center", alignItems: "center" }}>
              <div
                style={{
                  background: "#ffffff",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "2px solid #e2e8f0",
                  display: "inline-block",
                }}
              >
                {/* SVG QR Code encoding #AGRI-8402 for immediate physical testing */}
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=%23AGRI-8402"
                  alt="Sample Token #AGRI-8402 QR Code"
                  style={{ width: 180, height: 180, display: "block" }}
                />
              </div>

              <div style={{ marginTop: "12px" }}>
                <span className="token-cell" style={{ fontSize: "16px", display: "block" }}>
                  #AGRI-8402
                </span>
                <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#475569" }}>
                  Rameshwar Lal · Wheat (HD-2967) · 45 Qtl
                </p>
                <p style={{ margin: "8px 0 0 0", fontSize: "11.5px", color: "#64748b" }}>
                  {t("sampleQrInstruction")}
                </p>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-primary"
                onClick={() => setIsSampleQrModalOpen(false)}
              >
                {t("btnDone")}
              </button>
            </div>
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
