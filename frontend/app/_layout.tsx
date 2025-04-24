import { useEffect } from "react";
import { Slot, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ClerkProvider } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Secure storage for Clerk tokens
const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

// Replace with your Clerk publishable key
const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_your-publishable-key";

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    // Add custom fonts here if needed
  });

  useEffect(() => {
    const hideSplash = async () => {
      if (fontsLoaded || fontError) {
        await SplashScreen.hideAsync();
      }
    };
    
    hideSplash();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <View className="flex-1 bg-background">
            <StatusBar style="dark" />
            <Stack
              screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
              }}
            />
          </View>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ClerkProvider>
  );
}
