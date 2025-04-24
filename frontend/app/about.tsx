import { View, Text, ScrollView, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { APP_VERSION } from "../constants/app";

/**
 * About Screen
 * Displays information about the app
 */
export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  
  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          headerTitle: "About",
        }}
      />
      
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
      >
        {/* App info */}
        <View className="items-center p-6 bg-surface">
          <View className="w-24 h-24 bg-primary/10 rounded-full items-center justify-center mb-4">
            <Ionicons name="scan-outline" size={48} color="#3B82F6" />
          </View>
          
          <Text className="text-2xl font-bold">QR Code Scanner Pro</Text>
          <Text className="text-gray-600 mt-1">Version {APP_VERSION}</Text>
          
          <Text className="text-center text-gray-600 mt-4">
            A powerful QR code scanner with advanced features
          </Text>
        </View>
        
        {/* Features */}
        <View className="p-6 mt-4 bg-surface">
          <Text className="text-xl font-bold mb-4">Features</Text>
          
          <View className="space-y-4">
            <FeatureItem
              icon="scan-outline"
              title="Fast QR Code Scanning"
              description="Quickly scan any QR code with real-time detection"
            />
            
            <FeatureItem
              icon="list-outline"
              title="Scan History"
              description="Keep track of all your scanned QR codes"
            />
            
            <FeatureItem
              icon="link-outline"
              title="Smart Actions"
              description="Automatically detect content type and suggest relevant actions"
            />
            
            <FeatureItem
              icon="person-outline"
              title="User Accounts"
              description="Create an account to access additional features"
            />
            
            <FeatureItem
              icon="settings-outline"
              title="Customizable Settings"
              description="Configure the app to suit your preferences"
            />
          </View>
        </View>
        
        {/* Credits */}
        <View className="p-6 mt-4 bg-surface">
          <Text className="text-xl font-bold mb-4">Credits</Text>
          
          <Text className="text-base text-gray-700">
            Developed by Chirag Singhal
          </Text>
          
          <Text className="text-base text-gray-700 mt-2">
            Built with React Native and Expo
          </Text>
          
          <View className="mt-4 pt-4 border-t border-gray-200">
            <Text className="text-sm text-gray-500">
              © 2025 QR Code Scanner Pro. All rights reserved.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

/**
 * Feature Item Component
 * Displays a feature with an icon, title, and description
 */
function FeatureItem({ 
  icon, 
  title, 
  description 
}: { 
  icon: string; 
  title: string; 
  description: string;
}) {
  return (
    <View className="flex-row">
      <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-4">
        <Ionicons name={icon as any} size={20} color="#3B82F6" />
      </View>
      
      <View className="flex-1">
        <Text className="text-lg font-semibold">{title}</Text>
        <Text className="text-gray-600 mt-1">{description}</Text>
      </View>
    </View>
  );
}
