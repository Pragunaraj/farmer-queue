/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";

const MandiContext = createContext();

export const QUEUE_STATUSES = {
  GATE_WAITING: "GATE_WAITING",
  IN_INSPECTION: "IN_INSPECTION",
  WEIGHBRIDGE: "WEIGHBRIDGE",
  COMPLETED: "COMPLETED",
};

// Base timestamp reference: current session time anchor
const NOW = Date.now();

export const INITIAL_TOKENS = [
  {
    id: "#AGRI-8402",
    farmer: "Rameshwar Lal",
    phone: "+91 98290 12841",
    village: "Chomu, Jaipur",
    crop: "Wheat (HD-2967)",
    cropCategory: "Wheat",
    quantity: "45 Qtl",
    rawQuintals: 45,
    slot: "09:00 AM",
    hourSlot: "9 AM",
    status: QUEUE_STATUSES.GATE_WAITING,
    moisture: "--",
    grade: "Pending Gate Entry",
    price: "₹ 2,275 / Qtl",
    txHash: "0x8f3b...19a2",
    vehicle: "RJ-14-GA-2194 (Tractor-Trolley)",
    arrivalTime: NOW - 32 * 60 * 1000,
    inspectionStartTime: null,
    completedTime: null,
  },
  {
    id: "#AGRI-8403",
    farmer: "Sunita Devi",
    phone: "+91 94140 88210",
    village: "Bassi, Jaipur",
    crop: "Paddy (PR-114)",
    cropCategory: "Paddy",
    quantity: "60 Qtl",
    rawQuintals: 60,
    slot: "09:15 AM",
    hourSlot: "9 AM",
    status: QUEUE_STATUSES.IN_INSPECTION,
    moisture: "12.1%",
    grade: "Laboratory Bay 2 (Assay In-Progress)",
    price: "₹ 2,183 / Qtl",
    txHash: "0x3e11...45bc",
    vehicle: "RJ-14-TB-8812 (Mini Truck)",
    arrivalTime: NOW - 42 * 60 * 1000,
    inspectionStartTime: NOW - 16 * 60 * 1000,
    completedTime: null,
  },
  {
    id: "#AGRI-8404",
    farmer: "Bhanwar Singh",
    phone: "+91 97830 55102",
    village: "Amer, Jaipur",
    crop: "Wheat (WH-1105)",
    cropCategory: "Wheat",
    quantity: "80 Qtl",
    rawQuintals: 80,
    slot: "09:30 AM",
    hourSlot: "11 AM",
    status: QUEUE_STATUSES.WEIGHBRIDGE,
    moisture: "10.8%",
    grade: "Grade A (FAQ Standard)",
    price: "₹ 2,275 / Qtl",
    txHash: "0x77d2...990f",
    vehicle: "RJ-14-EA-4109 (Tractor-Trolley)",
    arrivalTime: NOW - 55 * 60 * 1000,
    inspectionStartTime: NOW - 28 * 60 * 1000,
    completedTime: null,
  },
  {
    id: "#AGRI-8405",
    farmer: "Geeta Kumari",
    phone: "+91 99281 77319",
    village: "Dudu, Jaipur",
    crop: "Cotton (Bt)",
    cropCategory: "Cotton",
    quantity: "35 Qtl",
    rawQuintals: 35,
    slot: "09:45 AM",
    hourSlot: "12 PM",
    status: QUEUE_STATUSES.COMPLETED,
    moisture: "8.5%",
    grade: "Premium Long Staple",
    price: "₹ 7,020 / Qtl",
    txHash: "0x91a0...33c1",
    vehicle: "RJ-14-MC-5590 (Pickup)",
    arrivalTime: NOW - 75 * 60 * 1000,
    inspectionStartTime: NOW - 52 * 60 * 1000,
    completedTime: NOW - 34 * 60 * 1000,
  },
  {
    id: "#AGRI-8406",
    farmer: "Mohan Ram",
    phone: "+91 96102 44908",
    village: "Phulera, Jaipur",
    crop: "Paddy (PB-1509)",
    cropCategory: "Paddy",
    quantity: "55 Qtl",
    rawQuintals: 55,
    slot: "10:00 AM",
    hourSlot: "10 AM",
    status: QUEUE_STATUSES.GATE_WAITING,
    moisture: "--",
    grade: "Pending Gate Entry",
    price: "₹ 2,183 / Qtl",
    txHash: "0x12a9...88fe",
    vehicle: "RJ-14-RA-3321 (Tractor-Trolley)",
    arrivalTime: NOW - 24 * 60 * 1000,
    inspectionStartTime: null,
    completedTime: null,
  },
  {
    id: "#AGRI-8407",
    farmer: "Jagdish Prasad",
    phone: "+91 98284 31109",
    village: "Sanganer, Jaipur",
    crop: "Mustard (Pusa-31)",
    cropCategory: "Mustard",
    quantity: "40 Qtl",
    rawQuintals: 40,
    slot: "10:15 AM",
    hourSlot: "11 AM",
    status: QUEUE_STATUSES.IN_INSPECTION,
    moisture: "7.9%",
    grade: "High Oil Content (41%)",
    price: "₹ 5,650 / Qtl",
    txHash: "0x66a4...77bc",
    vehicle: "RJ-14-MC-4122 (Pickup)",
    arrivalTime: NOW - 38 * 60 * 1000,
    inspectionStartTime: NOW - 12 * 60 * 1000,
    completedTime: null,
  },
  {
    id: "#AGRI-8408",
    farmer: "Kamla Choudhary",
    phone: "+91 94132 10982",
    village: "Kotputli, Jaipur",
    crop: "Wheat (Sharbati)",
    cropCategory: "Wheat",
    quantity: "70 Qtl",
    rawQuintals: 70,
    slot: "10:30 AM",
    hourSlot: "12 PM",
    status: QUEUE_STATUSES.WEIGHBRIDGE,
    moisture: "11.2%",
    grade: "Grade A Premium",
    price: "₹ 2,450 / Qtl",
    txHash: "0x44fa...551e",
    vehicle: "RJ-14-GA-9011 (Tractor)",
    arrivalTime: NOW - 62 * 60 * 1000,
    inspectionStartTime: NOW - 36 * 60 * 1000,
    completedTime: null,
  },
  {
    id: "#AGRI-8409",
    farmer: "Devendra Yadav",
    phone: "+91 95491 66203",
    village: "Jamwa Ramgarh, Jaipur",
    crop: "Bajra (HHB-67)",
    cropCategory: "Bajra",
    quantity: "50 Qtl",
    rawQuintals: 50,
    slot: "10:45 AM",
    hourSlot: "3 PM",
    status: QUEUE_STATUSES.COMPLETED,
    moisture: "9.2%",
    grade: "Clean FAQ",
    price: "₹ 2,500 / Qtl",
    txHash: "0x22be...440d",
    vehicle: "RJ-14-YA-1029 (Mini Truck)",
    arrivalTime: NOW - 85 * 60 * 1000,
    inspectionStartTime: NOW - 60 * 60 * 1000,
    completedTime: NOW - 22 * 60 * 1000,
  },
  {
    id: "#AGRI-8410",
    farmer: "Mukesh Gurjar",
    phone: "+91 98293 88127",
    village: "Shahpura, Jaipur",
    crop: "Soybean (JS-335)",
    cropCategory: "Soybean",
    quantity: "65 Qtl",
    rawQuintals: 65,
    slot: "11:00 AM",
    hourSlot: "4 PM",
    status: QUEUE_STATUSES.GATE_WAITING,
    moisture: "--",
    grade: "Pending Gate Entry",
    price: "₹ 4,892 / Qtl",
    txHash: "0x55bc...110a",
    vehicle: "RJ-14-GA-5502 (Tractor)",
    arrivalTime: NOW - 10 * 60 * 1000,
    inspectionStartTime: null,
    completedTime: null,
  },
];

const INITIAL_STATS = {
  scannedToday: 47,
  approved: 45,
  rejected: 2,
};

// Normalize tokens to ensure required queue status and timestamp attributes exist
function normalizeToken(token, index = 0) {
  let status = token.status;
  // Map legacy statuses if stored previously
  if (status === "Waiting" || status === "Gate Verified") {
    status = QUEUE_STATUSES.GATE_WAITING;
  } else if (status === "In Inspection") {
    status = QUEUE_STATUSES.IN_INSPECTION;
  } else if (status === "Paid") {
    status = QUEUE_STATUSES.COMPLETED;
  } else if (!Object.values(QUEUE_STATUSES).includes(status)) {
    status = QUEUE_STATUSES.GATE_WAITING;
  }

  const arrivalTime = token.arrivalTime || (NOW - (40 - index * 4) * 60 * 1000);
  const inspectionStartTime =
    token.inspectionStartTime ||
    (status === QUEUE_STATUSES.IN_INSPECTION || status === QUEUE_STATUSES.WEIGHBRIDGE || status === QUEUE_STATUSES.COMPLETED
      ? arrivalTime + 15 * 60 * 1000
      : null);
  const completedTime =
    token.completedTime ||
    (status === QUEUE_STATUSES.COMPLETED ? arrivalTime + 38 * 60 * 1000 : null);

  return {
    ...token,
    status,
    arrivalTime,
    inspectionStartTime,
    completedTime,
  };
}

export const INITIAL_VOICE_LOGS = [
  {
    id: "CALL-2026-9011",
    timestamp: NOW - 18 * 60 * 1000,
    duration: "1m 42s",
    farmer: "Bhanwar Singh",
    kisanId: "RJ-KISAN-9841",
    crop: "Wheat (WH-1105)",
    quantity: "80 Qtl",
    slot: "20 Sept, 11am-2pm",
    mandi: "Jaipur APMC Main Yard",
    channel: "Voice AI (Kisan Vani)",
    language: "Hindi (hi-IN)",
    switches: 1,
    status: "Confirmed & Pushed",
    tokenId: "#AGRI-8404",
    audioQuality: "100% Crisp",
  },
  {
    id: "CALL-2026-9012",
    timestamp: NOW - 42 * 60 * 1000,
    duration: "2m 05s",
    farmer: "Harpreet Singh",
    kisanId: "PB-KISAN-2204",
    crop: "Paddy (PB-1509)",
    quantity: "60 Qtl",
    slot: "21 Sept, 9am-11am",
    mandi: "Jaipur APMC Yard 2",
    channel: "Voice AI (Kisan Vani)",
    language: "Punjabi (pa-IN)",
    switches: 0,
    status: "Confirmed & Pushed",
    tokenId: "#AGRI-8406",
    audioQuality: "98% Clean",
  },
  {
    id: "CALL-2026-9013",
    timestamp: NOW - 75 * 60 * 1000,
    duration: "1m 15s",
    farmer: "Shankarappa Gowda",
    kisanId: "KA-KISAN-8712",
    crop: "Cotton (Bt)",
    quantity: "35 Qtl",
    slot: "20 Sept, 2pm-5pm",
    mandi: "Jaipur Central Silo",
    channel: "Voice AI (Kisan Vani)",
    language: "Kannada (kn-IN)",
    switches: 1,
    status: "Confirmed & Pushed",
    tokenId: "#AGRI-8405",
    audioQuality: "96% Clean",
  },
];

export function MandiProvider({ children }) {
  const [tokens, setTokens] = useState(() => {
    try {
      const saved = localStorage.getItem("agriflow_mandi_tokens");
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.map(normalizeToken) : INITIAL_TOKENS;
      }
      return INITIAL_TOKENS;
    } catch {
      return INITIAL_TOKENS;
    }
  });

  const [voiceLogs, setVoiceLogs] = useState(() => {
    try {
      const saved = localStorage.getItem("agriflow_voice_logs");
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : INITIAL_VOICE_LOGS;
      }
      return INITIAL_VOICE_LOGS;
    } catch {
      return INITIAL_VOICE_LOGS;
    }
  });

  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem("agriflow_scanner_stats");
      return saved ? JSON.parse(saved) : INITIAL_STATS;
    } catch {
      return INITIAL_STATS;
    }
  });

  // Sync voice logs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("agriflow_voice_logs", JSON.stringify(voiceLogs));
    } catch (e) {
      console.error("Failed to save voice logs to localStorage", e);
    }
  }, [voiceLogs]);

  // Sync tokens to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("agriflow_mandi_tokens", JSON.stringify(tokens));
    } catch (e) {
      console.error("Failed to save tokens to localStorage", e);
    }
  }, [tokens]);

  // Sync stats to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("agriflow_scanner_stats", JSON.stringify(stats));
    } catch (e) {
      console.error("Failed to save stats to localStorage", e);
    }
  }, [stats]);

  // =========================================================================
  // Real-Time Telemetry Calculations
  // =========================================================================

  // 1. Active Queue Count: Total tokens currently in 'GATE_WAITING' or 'IN_INSPECTION'
  const activeQueueCount = useMemo(() => {
    return tokens.filter(
      (t) => t.status === QUEUE_STATUSES.GATE_WAITING || t.status === QUEUE_STATUSES.IN_INSPECTION
    ).length;
  }, [tokens]);

  // Total vehicles in GATE_WAITING
  const waitingVehiclesCount = useMemo(() => {
    return tokens.filter((t) => t.status === QUEUE_STATUSES.GATE_WAITING).length;
  }, [tokens]);

  // Active Bay Occupancy (IN_INSPECTION + WEIGHBRIDGE)
  const activeBaysCount = useMemo(() => {
    return tokens.filter(
      (t) => t.status === QUEUE_STATUSES.IN_INSPECTION || t.status === QUEUE_STATUSES.WEIGHBRIDGE
    ).length;
  }, [tokens]);

  const totalBayCapacity = 4; // 2 Inspection Bays + 2 Weighbridge Bays

  // 2. Average Processing Time: Dynamic average duration (in minutes) taken per token
  // from entry to completion over the last 10 processed tokens
  const avgProcessingTime = useMemo(() => {
    const completedTokens = tokens
      .filter((t) => t.status === QUEUE_STATUSES.COMPLETED && t.completedTime && t.arrivalTime)
      .slice(0, 10);

    if (completedTokens.length === 0) {
      return 14.5; // Baseline fallback (14.5 mins)
    }

    const totalMinutes = completedTokens.reduce((sum, t) => {
      const durationMs = Math.max(1000 * 60 * 5, t.completedTime - t.arrivalTime);
      return sum + durationMs / (1000 * 60);
    }, 0);

    const avg = totalMinutes / completedTokens.length;
    return parseFloat(avg.toFixed(1));
  }, [tokens]);

  // 3. Estimated Wait Time: (Tokens ahead in queue) * (Average Processing Time)
  const overallEstimatedWaitTime = useMemo(() => {
    return Math.max(1, Math.round(activeQueueCount * avgProcessingTime));
  }, [activeQueueCount, avgProcessingTime]);

  // Per-token wait time calculation helper
  const getTokensAhead = useCallback(
    (tokenId) => {
      const activeList = tokens.filter(
        (t) => t.status === QUEUE_STATUSES.GATE_WAITING || t.status === QUEUE_STATUSES.IN_INSPECTION
      );
      const index = activeList.findIndex(
        (t) => t.id === tokenId || t.id.replace(/^#/, "").toUpperCase() === tokenId.replace(/^#/, "").toUpperCase()
      );
      return index >= 0 ? index : 0;
    },
    [tokens]
  );

  const getTokenEstimatedWait = useCallback(
    (tokenId) => {
      const ahead = getTokensAhead(tokenId);
      return Math.max(0, Math.round(ahead * avgProcessingTime));
    },
    [getTokensAhead, avgProcessingTime]
  );

  // =========================================================================
  // State Advancement & Actions
  // =========================================================================

  // Advance token status sequentially:
  // GATE_WAITING -> IN_INSPECTION -> WEIGHBRIDGE -> COMPLETED
  const advanceTokenState = useCallback((tokenId) => {
    let advancedStatus = null;

    setTokens((prev) =>
      prev.map((t) => {
        const isMatch =
          t.id === tokenId ||
          t.id.replace(/^#/, "").toUpperCase() === tokenId.replace(/^#/, "").toUpperCase();

        if (!isMatch) return t;

        const currentStatus = t.status;
        const now = Date.now();

        if (currentStatus === QUEUE_STATUSES.GATE_WAITING || currentStatus === "Waiting" || currentStatus === "Gate Verified") {
          advancedStatus = QUEUE_STATUSES.IN_INSPECTION;
          return {
            ...t,
            status: QUEUE_STATUSES.IN_INSPECTION,
            inspectionStartTime: now,
            grade: "Laboratory Bay 2 (Assay In-Progress)",
          };
        } else if (currentStatus === QUEUE_STATUSES.IN_INSPECTION || currentStatus === "In Inspection") {
          advancedStatus = QUEUE_STATUSES.WEIGHBRIDGE;
          return {
            ...t,
            status: QUEUE_STATUSES.WEIGHBRIDGE,
            grade: "Directed to Weighbridge Bay",
          };
        } else if (currentStatus === QUEUE_STATUSES.WEIGHBRIDGE) {
          advancedStatus = QUEUE_STATUSES.COMPLETED;
          return {
            ...t,
            status: QUEUE_STATUSES.COMPLETED,
            completedTime: now,
            grade: t.grade || "Grade A (FAQ Standard)",
          };
        }

        return t;
      })
    );

    return advancedStatus;
  }, []);

  // Update a token's status directly
  const updateTokenStatus = useCallback((tokenId, newStatus, extraData = {}) => {
    setTokens((prev) =>
      prev.map((t) => {
        if (
          t.id === tokenId ||
          t.id.replace(/^#/, "").toUpperCase() === tokenId.replace(/^#/, "").toUpperCase()
        ) {
          return {
            ...t,
            status: newStatus,
            ...extraData,
          };
        }
        return t;
      })
    );
  }, []);

  // Add a new token (starts at GATE_WAITING with arrival timestamp)
  const addToken = useCallback((newToken) => {
    const formattedToken = {
      ...newToken,
      status: newToken.status || QUEUE_STATUSES.GATE_WAITING,
      arrivalTime: newToken.arrivalTime || Date.now(),
      inspectionStartTime: null,
      completedTime: null,
    };
    setTokens((prev) => [formattedToken, ...prev]);
  }, []);

  // Record a scan result
  const recordScan = useCallback((approved) => {
    setStats((prev) => ({
      scannedToday: prev.scannedToday + 1,
      approved: approved ? prev.approved + 1 : prev.approved,
      rejected: approved ? prev.rejected : prev.rejected + 1,
    }));
  }, []);

  // Add a voice booking and generate token + audit log
  const addVoiceBooking = useCallback((booking) => {
    // Generate next sequential token ID
    let maxNum = 8406;
    tokens.forEach((t) => {
      const match = t.id?.match(/\d+/);
      if (match) {
        const num = parseInt(match[0], 10);
        if (!isNaN(num) && num > maxNum) maxNum = num;
      }
    });
    const nextTokenId = `#AGRI-${maxNum + 1}`;
    const callLogId = `CALL-2026-${Math.floor(9000 + Math.random() * 900)}`;

    const cropName = booking.crop || "Wheat (HD-2967)";
    const qtlVal = parseInt(booking.quantity, 10) || 45;
    const now = Date.now();

    const newToken = {
      id: nextTokenId,
      farmer: booking.farmer || "Farmer",
      kisanId: booking.kisanId || `KISAN-${Math.floor(1000 + Math.random() * 9000)}`,
      phone: booking.phone || "+91 98" + Math.floor(10000000 + Math.random() * 90000000),
      village: booking.landmark || "APMC Vicinity",
      crop: cropName,
      cropCategory: cropName.split(" ")[0],
      quantity: `${qtlVal} Qtl`,
      rawQuintals: qtlVal,
      slot: booking.slot || "11am-2pm",
      hourSlot: booking.slot?.includes("9am") ? "10 AM" : booking.slot?.includes("2pm") ? "2 PM" : "12 PM",
      status: QUEUE_STATUSES.GATE_WAITING,
      channel: "Voice AI (Kisan Vani)",
      mandi: booking.mandi || "Jaipur APMC Main Yard",
      landmark: booking.landmark || "Mandi Toll Gate",
      moisture: "--",
      grade: "Queue for Inspection",
      price: "₹ 2,275 / Qtl",
      txHash: `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`,
      vehicle: "RJ-14-GA-" + Math.floor(1000 + Math.random() * 9000),
      arrivalTime: now,
      inspectionStartTime: null,
      completedTime: null,
    };

    const newLog = {
      id: callLogId,
      timestamp: now,
      duration: booking.duration || "1m 30s",
      farmer: newToken.farmer,
      kisanId: newToken.kisanId,
      crop: newToken.crop,
      quantity: newToken.quantity,
      slot: booking.preferredDate ? `${booking.preferredDate}, ${booking.slot}` : `20 Sept 2026, ${newToken.slot}`,
      mandi: newToken.mandi,
      channel: "Voice AI (Kisan Vani)",
      language: booking.language || "Hindi (hi-IN)",
      switches: booking.switches || 0,
      status: "Confirmed & Pushed",
      tokenId: nextTokenId,
      audioQuality: "100% Crisp",
      transcriptSummary: booking.transcriptSummary || `${newToken.farmer} booked ${newToken.quantity} ${newToken.crop} for ${newToken.slot}.`,
    };

    setTokens((prev) => [newToken, ...prev]);
    setVoiceLogs((prev) => [newLog, ...prev]);

    return { token: newToken, log: newLog };
  }, [tokens]);

  return (
    <MandiContext.Provider
      value={{
        tokens,
        setTokens,
        voiceLogs,
        setVoiceLogs,
        stats,
        QUEUE_STATUSES,
        // Live Telemetry Metrics
        activeQueueCount,
        waitingVehiclesCount,
        activeBaysCount,
        totalBayCapacity,
        avgProcessingTime,
        overallEstimatedWaitTime,
        getTokensAhead,
        getTokenEstimatedWait,
        // Actions
        advanceTokenState,
        updateTokenStatus,
        addToken,
        addVoiceBooking,
        recordScan,
      }}
    >
      {children}
    </MandiContext.Provider>
  );
}

export function useMandi() {
  const context = useContext(MandiContext);
  if (!context) {
    throw new Error("useMandi must be used within a MandiProvider");
  }
  return context;
}

