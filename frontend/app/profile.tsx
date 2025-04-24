import { useState } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUser, useAuth } from "@clerk/clerk-expo";

import SettingsSection from "../components/SettingsSection";
import SettingsItem from "../components/SettingsItem";
import ConfirmationDialog from "../components/ConfirmationDialog";

/**
 * Profile Screen
 * Displays user profile information and account management options
 */
export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const { user, isLoaded: isUserLoaded } = useUser();
  const { signOut } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  
  // Handle sign out
  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Error", "Failed to sign out. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isUserLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }
  
  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-6">
        <Ionicons name="person-outline" size={64} color="#9CA3AF" />
        <Text className="text-xl font-bold mt-4 text-center">Not Signed In</Text>
        <Text className="text-base text-gray-600 text-center mt-2">
          You need to sign in to view your profile.
        </Text>
        <TouchableOpacity
          className="mt-6 bg-primary px-6 py-3 rounded-lg"
          onPress={() => router.push("/sign-in")}
        >
          <Text className="text-white font-semibold">Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View 
      className="flex-1 bg-background"
      style={{ paddingBottom: insets.bottom }}
    >
      <Stack.Screen
        options={{
          headerTitle: "Profile",
        }}
      />
      
      {/* Profile header */}
      <View className="bg-surface p-6 items-center">
        <View className="w-24 h-24 rounded-full bg-primary/10 items-center justify-center mb-4">
          {user.imageUrl ? (
            <Image
              source={{ uri: user.imageUrl }}
              className="w-24 h-24 rounded-full"
            />
          ) : (
            <Text className="text-3xl font-bold text-primary">
              {user.firstName?.charAt(0) || user.username?.charAt(0) || "U"}
            </Text>
          )}
        </View>
        
        <Text className="text-2xl font-bold">
          {user.fullName || user.username || "User"}
        </Text>
        
        <Text className="text-gray-600 mt-1">
          {user.primaryEmailAddress?.emailAddress || ""}
        </Text>
      </View>
      
      {/* Account settings */}
      <View className="flex-1 mt-6">
        <SettingsSection title="Account Settings">
          <SettingsItem
            icon="mail-outline"
            iconColor="#3B82F6"
            title="Email Addresses"
            showChevron
            onPress={() => router.push("/email-addresses")}
          />
          
          <SettingsItem
            icon="key-outline"
            iconColor="#10B981"
            title="Change Password"
            showChevron
            onPress={() => router.push("/change-password")}
          />
          
          <SettingsItem
            icon="log-out-outline"
            iconColor="#EF4444"
            title="Sign Out"
            onPress={() => setShowSignOutConfirm(true)}
          />
        </SettingsSection>
        
        <SettingsSection title="Danger Zone">
          <SettingsItem
            icon="trash-outline"
            iconColor="#EF4444"
            title="Delete Account"
            subtitle="Permanently delete your account and all data"
            showChevron
            onPress={() => router.push("/delete-account")}
          />
        </SettingsSection>
      </View>
      
      {/* Sign out confirmation dialog */}
      <ConfirmationDialog
        visible={showSignOutConfirm}
        title="Sign Out"
        message="Are you sure you want to sign out?"
        confirmLabel="Sign Out"
        confirmColor="#EF4444"
        onConfirm={handleSignOut}
        onCancel={() => setShowSignOutConfirm(false)}
      />
      
      {isLoading && (
        <View className="absolute inset-0 bg-black/30 items-center justify-center">
          <View className="bg-white p-4 rounded-lg">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="mt-2">Signing out...</Text>
          </View>
        </View>
      )}
    </View>
  );
}
