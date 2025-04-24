import { create } from "zustand";
import { MMKV } from "react-native-mmkv";
import { v4 as uuidv4 } from "uuid";

import { QRCodeResult } from "../types/qrcode";

// Initialize MMKV storage
const storage = new MMKV({ id: "scan-history" });

// Define the store state
interface ScanState {
  scans: QRCodeResult[];
  addScan: (scan: QRCodeResult) => void;
  removeScan: (id: string) => void;
  clearAllScans: () => void;
}

/**
 * Scan Store Hook
 * Manages the scan history using MMKV for persistent storage
 */
export const useScanStore = create<ScanState>((set, get) => {
  // Load initial state from storage
  const loadInitialState = (): QRCodeResult[] => {
    const storedScans = storage.getString("scans");
    if (storedScans) {
      try {
        return JSON.parse(storedScans);
      } catch (error) {
        console.error("Error parsing stored scans:", error);
        return [];
      }
    }
    return [];
  };
  
  // Save scans to storage
  const saveScans = (scans: QRCodeResult[]) => {
    storage.set("scans", JSON.stringify(scans));
  };
  
  return {
    scans: loadInitialState(),
    
    // Add a new scan to history
    addScan: (scan: QRCodeResult) => {
      // Ensure scan has an ID and timestamp
      const newScan = {
        ...scan,
        id: scan.id || uuidv4(),
        timestamp: scan.timestamp || Date.now(),
      };
      
      // Add to state
      const updatedScans = [newScan, ...get().scans];
      set({ scans: updatedScans });
      
      // Save to storage
      saveScans(updatedScans);
    },
    
    // Remove a scan from history
    removeScan: (id: string) => {
      const updatedScans = get().scans.filter(scan => scan.id !== id);
      set({ scans: updatedScans });
      saveScans(updatedScans);
    },
    
    // Clear all scan history
    clearAllScans: () => {
      set({ scans: [] });
      saveScans([]);
    },
  };
});
