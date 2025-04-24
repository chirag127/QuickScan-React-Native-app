import { View, Text, Switch, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUser, useAuth } from "@clerk/clerk-expo";

import { useSettingsStore } from "../../hooks/useSettingsStore";
import SettingsSection from "../../components/SettingsSection";
import SettingsItem from "../../components/SettingsItem";
import { APP_VERSION } from "../../constants/app";

/**
 * Settings screen component
 * Allows users to configure app settings and manage their account
 */
export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const { isSignedIn, user } = useUser();
  const { signOut } = useAuth();
  
  const { 
    scanSoundEnabled, 
    scanVibrationEnabled, 
    setScanSoundEnabled, 
    setScanVibrationEnabled 
  } = useSettingsStore();
  
  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      Alert.alert("Error", "Failed to sign out. Please try again.");
    }
  };
  
  // Confirm sign out
  const confirmSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sign Out", style: "destructive", onPress: handleSignOut }
      ]
    );
  };
  
  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View 
        className="px-4 pb-2 bg-surface"
        style={{ paddingTop: insets.top }}
      >
        <View className="py-4">
          <Text className="text-2xl font-bold">Settings</Text>
        </View>
      </View>
      
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
      >
        {/* Account Section */}
        <SettingsSection title="Account">
          {isSignedIn ? (
            <>
              <SettingsItem
                icon="person-outline"
                iconColor="#3B82F6"
                title={user?.fullName || "User"}
                subtitle={user?.primaryEmailAddress?.emailAddress || ""}
                showChevron
                onPress={() => router.push("/profile")}
              />
              <SettingsItem
                icon="log-out-outline"
                iconColor="#EF4444"
                title="Sign Out"
                onPress={confirmSignOut}
              />
            </>
          ) : (
            <SettingsItem
              icon="log-in-outline"
              iconColor="#3B82F6"
              title="Sign In"
              subtitle="Create an account or sign in"
              showChevron
              onPress={() => router.push("/sign-in")}
            />
          )}
        </SettingsSection>
        
        {/* Scan Settings Section */}
        <SettingsSection title="Scan Settings">
          <SettingsItem
            icon="volume-high-outline"
            iconColor="#10B981"
            title="Scan Sound"
            subtitle="Play sound on successful scan"
            rightElement={
              <Switch
                value={scanSoundEnabled}
                onValueChange={setScanSoundEnabled}
                trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
                thumbColor={scanSoundEnabled ? "#3B82F6" : "#F3F4F6"}
              />
            }
          />
          <SettingsItem
            icon="phone-portrait-outline"
            iconColor="#8B5CF6"
            title="Vibration"
            subtitle="Vibrate on successful scan"
            rightElement={
              <Switch
                value={scanVibrationEnabled}
                onValueChange={setScanVibrationEnabled}
                trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
                thumbColor={scanVibrationEnabled ? "#3B82F6" : "#F3F4F6"}
              />
            }
          />
        </SettingsSection>
        
        {/* About Section */}
        <SettingsSection title="About">
          <SettingsItem
            icon="information-circle-outline"
            iconColor="#F59E0B"
            title="About QR Code Scanner Pro"
            showChevron
            onPress={() => router.push("/about")}
          />
          <SettingsItem
            icon="shield-checkmark-outline"
            iconColor="#10B981"
            title="Privacy Policy"
            showChevron
            onPress={() => router.push("/privacy-policy")}
          />
          <SettingsItem
            icon="document-text-outline"
            iconColor="#3B82F6"
            title="Terms of Service"
            showChevron
            onPress={() => router.push("/terms")}
          />
          <SettingsItem
            icon="code-slash-outline"
            iconColor="#6B7280"
            title="Version"
            subtitle={APP_VERSION}
          />
        </SettingsSection>
      </ScrollView>
    </View>
  );
}
