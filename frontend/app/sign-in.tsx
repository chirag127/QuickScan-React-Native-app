import { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSignIn, useSignUp, OAuthStrategy } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";

import AuthButton from "../components/AuthButton";

// URL to redirect to after OAuth
const redirectUri = makeRedirectUri({
  scheme: "qrcodescannerpro",
});

/**
 * Sign In Screen
 * Provides authentication options using Clerk
 */
export default function SignInScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const { signIn, setActive: setSignInActive, isLoaded: isSignInLoaded } = useSignIn();
  const { signUp, setActive: setSignUpActive, isLoaded: isSignUpLoaded } = useSignUp();
  
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<"signIn" | "signUp">("signIn");
  
  const isLoaded = isSignInLoaded && isSignUpLoaded;
  
  // Handle OAuth sign in
  const handleOAuthSignIn = async (strategy: OAuthStrategy) => {
    try {
      setIsLoading(true);
      
      const handler = authMode === "signIn" ? signIn : signUp;
      
      const { createdSessionId, setActive } = await handler.authenticateWithRedirect({
        strategy,
        redirectUrl: redirectUri,
        redirectUrlComplete: redirectUri,
      });
      
      const { signUpId, signInId } = await WebBrowser.openAuthSessionAsync(
        createdSessionId as unknown as string,
        redirectUri
      );
      
      if (authMode === "signIn") {
        if (signInId) {
          await setSignInActive({ session: signInId });
          router.replace("/(tabs)");
        }
      } else {
        if (signUpId) {
          await setSignUpActive({ session: signUpId });
          router.replace("/(tabs)");
        }
      }
    } catch (err) {
      Alert.alert("Error", "Authentication failed. Please try again.");
      console.error("OAuth error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle between sign in and sign up
  const toggleAuthMode = () => {
    setAuthMode(authMode === "signIn" ? "signUp" : "signIn");
  };
  
  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#3B82F6" />
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
          headerTitle: authMode === "signIn" ? "Sign In" : "Sign Up",
        }}
      />
      
      <View className="flex-1 p-6 justify-center">
        {/* Header */}
        <View className="items-center mb-8">
          <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-4">
            <Ionicons name="scan-outline" size={40} color="#3B82F6" />
          </View>
          <Text className="text-2xl font-bold text-center">
            {authMode === "signIn" ? "Welcome Back" : "Create Account"}
          </Text>
          <Text className="text-base text-gray-600 text-center mt-2">
            {authMode === "signIn" 
              ? "Sign in to access your scan history" 
              : "Sign up to save and sync your scans"}
          </Text>
        </View>
        
        {/* OAuth Buttons */}
        <View className="space-y-4 mb-6">
          <AuthButton
            provider="google"
            label={`${authMode === "signIn" ? "Sign in" : "Sign up"} with Google`}
            onPress={() => handleOAuthSignIn("oauth_google")}
            disabled={isLoading}
          />
          
          <AuthButton
            provider="apple"
            label={`${authMode === "signIn" ? "Sign in" : "Sign up"} with Apple`}
            onPress={() => handleOAuthSignIn("oauth_apple")}
            disabled={isLoading}
          />
          
          <AuthButton
            provider="facebook"
            label={`${authMode === "signIn" ? "Sign in" : "Sign up"} with Facebook`}
            onPress={() => handleOAuthSignIn("oauth_facebook")}
            disabled={isLoading}
          />
        </View>
        
        {/* Toggle auth mode */}
        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-600">
            {authMode === "signIn" ? "Don't have an account? " : "Already have an account? "}
          </Text>
          <TouchableOpacity onPress={toggleAuthMode}>
            <Text className="text-primary font-semibold">
              {authMode === "signIn" ? "Sign Up" : "Sign In"}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Skip auth */}
        <TouchableOpacity 
          className="mt-8 items-center"
          onPress={() => router.replace("/(tabs)")}
        >
          <Text className="text-gray-500">Skip for now</Text>
        </TouchableOpacity>
      </View>
      
      {isLoading && (
        <View className="absolute inset-0 bg-black/30 items-center justify-center">
          <View className="bg-white p-4 rounded-lg">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="mt-2 text-center">Authenticating...</Text>
          </View>
        </View>
      )}
    </View>
  );
}
