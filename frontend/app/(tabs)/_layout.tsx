import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";

/**
 * Main tab navigation layout
 * Defines the bottom tab navigation for the app with three tabs:
 * - Scan: Main QR code scanning screen
 * - History: List of past scans
 * - Settings: App settings and user account
 */
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#3B82F6", // primary color
        tabBarInactiveTintColor: colorScheme === "dark" ? "#6B7280" : "#9CA3AF",
        tabBarStyle: {
          backgroundColor: colorScheme === "dark" ? "#1F2937" : "#FFFFFF",
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Scan",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="scan-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
