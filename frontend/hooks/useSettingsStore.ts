import { create } from "zustand";
import { MMKV } from "react-native-mmkv";

// Initialize MMKV storage
const storage = new MMKV({ id: "app-settings" });

// Define the store state
interface SettingsState {
  scanSoundEnabled: boolean;
  scanVibrationEnabled: boolean;
  setScanSoundEnabled: (enabled: boolean) => void;
  setScanVibrationEnabled: (enabled: boolean) => void;
}

/**
 * Settings Store Hook
 * Manages app settings using MMKV for persistent storage
 */
export const useSettingsStore = create<SettingsState>((set) => {
  // Load initial state from storage
  const loadSetting = (key: string, defaultValue: boolean): boolean => {
    const value = storage.getString(key);
    if (value !== undefined) {
      try {
        return JSON.parse(value);
      } catch (error) {
        console.error(`Error parsing setting ${key}:`, error);
        return defaultValue;
      }
    }
    return defaultValue;
  };
  
  return {
    // Default settings
    scanSoundEnabled: loadSetting("scanSoundEnabled", true),
    scanVibrationEnabled: loadSetting("scanVibrationEnabled", true),
    
    // Update scan sound setting
    setScanSoundEnabled: (enabled: boolean) => {
      set({ scanSoundEnabled: enabled });
      storage.set("scanSoundEnabled", JSON.stringify(enabled));
    },
    
    // Update scan vibration setting
    setScanVibrationEnabled: (enabled: boolean) => {
      set({ scanVibrationEnabled: enabled });
      storage.set("scanVibrationEnabled", JSON.stringify(enabled));
    },
  };
});
