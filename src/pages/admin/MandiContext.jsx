/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";

const MandiContext = createContext();

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
    status: "Waiting",
    moisture: "--",
    grade: "Pending Gate Entry",
    price: "₹ 2,275 / Qtl",
    txHash: "0x8f3b...19a2",
    vehicle: "RJ-14-GA-2194 (Tractor-Trolley)",
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
    status: "Gate Verified",
    moisture: "12.1%",
    grade: "Queue for Quality Bay 2",
    price: "₹ 2,183 / Qtl",
    txHash: "0x3e11...45bc",
    vehicle: "RJ-14-TB-8812 (Mini Truck)",
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
    status: "In Inspection",
    moisture: "10.8%",
    grade: "Grade A (FAQ Standard)",
    price: "₹ 2,275 / Qtl",
    txHash: "0x77d2...990f",
    vehicle: "RJ-14-EA-4109 (Tractor-Trolley)",
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
    status: "Paid",
    moisture: "8.5%",
    grade: "Premium Long Staple",
    price: "₹ 7,020 / Qtl",
    txHash: "0x91a0...33c1",
    vehicle: "RJ-14-MC-5590 (Pickup)",
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
    status: "Waiting",
    moisture: "--",
    grade: "Pending Gate Entry",
    price: "₹ 2,183 / Qtl",
    txHash: "0x12a9...88fe",
    vehicle: "RJ-14-RA-3321 (Tractor-Trolley)",
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
    status: "Gate Verified",
    moisture: "7.9%",
    grade: "High Oil Content (41%)",
    price: "₹ 5,650 / Qtl",
    txHash: "0x66a4...77bc",
    vehicle: "RJ-14-MC-4122 (Pickup)",
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
    status: "In Inspection",
    moisture: "11.2%",
    grade: "Grade A Premium",
    price: "₹ 2,450 / Qtl",
    txHash: "0x44fa...551e",
    vehicle: "RJ-14-GA-9011 (Tractor)",
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
    status: "Paid",
    moisture: "9.2%",
    grade: "Clean FAQ",
    price: "₹ 2,500 / Qtl",
    txHash: "0x22be...440d",
    vehicle: "RJ-14-YA-1029 (Mini Truck)",
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
    status: "Waiting",
    moisture: "--",
    grade: "Pending Gate Entry",
    price: "₹ 4,892 / Qtl",
    txHash: "0x55bc...110a",
    vehicle: "RJ-14-GA-5502 (Tractor)",
  },
];

const INITIAL_STATS = {
  scannedToday: 47,
  approved: 45,
  rejected: 2,
};

export function MandiProvider({ children }) {
  const [tokens, setTokens] = useState(() => {
    try {
      const saved = localStorage.getItem("agriflow_mandi_tokens");
      return saved ? JSON.parse(saved) : INITIAL_TOKENS;
    } catch {
      return INITIAL_TOKENS;
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

  // Update a token's status (e.g. from 'Waiting' to 'Gate Verified')
  const updateTokenStatus = (tokenId, newStatus, extraData = {}) => {
    setTokens((prev) =>
      prev.map((t) => {
        if (t.id === tokenId || t.id.replace(/^#/, "").toUpperCase() === tokenId.replace(/^#/, "").toUpperCase()) {
          return {
            ...t,
            status: newStatus,
            ...extraData,
          };
        }
        return t;
      })
    );
  };

  // Add a new token
  const addToken = (newToken) => {
    setTokens((prev) => [newToken, ...prev]);
  };

  // Record a scan result
  const recordScan = (approved) => {
    setStats((prev) => ({
      scannedToday: prev.scannedToday + 1,
      approved: approved ? prev.approved + 1 : prev.approved,
      rejected: approved ? prev.rejected : prev.rejected + 1,
    }));
  };

  return (
    <MandiContext.Provider
      value={{
        tokens,
        setTokens,
        stats,
        updateTokenStatus,
        addToken,
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
