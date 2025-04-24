import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Share, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import Clipboard from "@react-native-clipboard/clipboard";
import * as Haptics from "expo-haptics";

import { useScanStore } from "../hooks/useScanStore";
import { QRCodeResult } from "../types/qrcode";
import { getActionsByType } from "../utils/qrCodeActions";
import ActionButton from "../components/ActionButton";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { formatDate } from "../utils/dateUtils";

/**
 * Scan Details Screen
 * Shows detailed information about a scanned QR code and available actions
 */
export default function ScanDetailsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const { scans, removeScan } = useScanStore();
  
  const [scan, setScan] = useState<QRCodeResult | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Find the scan by ID
  useEffect(() => {
    if (id) {
      const foundScan = scans.find(s => s.id === id);
      setScan(foundScan || null);
    }
  }, [id, scans]);
  
  // Handle copy to clipboard
  const handleCopy = () => {
    if (scan) {
      Clipboard.setString(scan.rawData);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Copied", "Content copied to clipboard");
    }
  };
  
  // Handle share
  const handleShare = async () => {
    if (scan) {
      try {
        await Share.share({
          message: scan.rawData,
        });
      } catch (error) {
        Alert.alert("Error", "Failed to share content");
      }
    }
  };
  
  // Handle delete
  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };
  
  // Confirm delete
  const confirmDelete = () => {
    if (scan) {
      removeScan(scan.id);
      setShowDeleteConfirm(false);
      router.back();
    }
  };
  
  // Get actions for this scan type
  const actions = scan ? getActionsByType(scan) : [];
  
  // If scan not found
  if (!scan) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Ionicons name="alert-circle-outline" size={64} color="#F59E0B" />
        <Text className="text-xl font-bold mt-4">Scan Not Found</Text>
        <Text className="text-base text-gray-600 text-center mt-2 px-6">
          The scan you're looking for doesn't exist or has been deleted.
        </Text>
        <TouchableOpacity
          className="mt-6 bg-primary px-6 py-3 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          headerTitle: "Scan Details",
          headerRight: () => (
            <View className="flex-row">
              <TouchableOpacity
                className="p-2 mr-2"
                onPress={handleShare}
              >
                <Ionicons name="share-outline" size={24} color="#3B82F6" />
              </TouchableOpacity>
              <TouchableOpacity
                className="p-2"
                onPress={handleDelete}
              >
                <Ionicons name="trash-outline" size={24} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
      >
        {/* Scan type and timestamp */}
        <View className="bg-surface p-4 mb-4">
          <View className="flex-row items-center mb-2">
            <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
              <Ionicons 
                name={
                  scan.dataType === "URL" ? "link-outline" :
                  scan.dataType === "TEXT" ? "text-outline" :
                  scan.dataType === "WIFI" ? "wifi-outline" :
                  scan.dataType === "CONTACT" ? "person-outline" :
                  scan.dataType === "SMS" ? "chatbox-outline" :
                  scan.dataType === "EMAIL" ? "mail-outline" :
                  scan.dataType === "GEO" ? "location-outline" :
                  "qr-code-outline"
                } 
                size={24} 
                color="#3B82F6" 
              />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold">{scan.dataType}</Text>
              <Text className="text-sm text-gray-500">
                {formatDate(new Date(scan.timestamp))}
              </Text>
            </View>
          </View>
          
          {/* Scan content */}
          <View className="bg-gray-100 p-3 rounded-lg mt-2">
            <Text className="text-base">{scan.displayData}</Text>
          </View>
          
          {/* Copy button */}
          <TouchableOpacity
            className="flex-row items-center justify-center bg-gray-200 py-2 px-4 rounded-lg mt-3"
            onPress={handleCopy}
          >
            <Ionicons name="copy-outline" size={18} color="#4B5563" />
            <Text className="ml-2 font-medium text-gray-700">Copy to Clipboard</Text>
          </TouchableOpacity>
        </View>
        
        {/* Actions */}
        {actions.length > 0 && (
          <View className="bg-surface p-4 mb-4">
            <Text className="text-lg font-semibold mb-3">Actions</Text>
            <View className="space-y-2">
              {actions.map((action, index) => (
                <ActionButton
                  key={index}
                  icon={action.icon}
                  label={action.label}
                  onPress={() => action.action(scan)}
                />
              ))}
            </View>
          </View>
        )}
        
        {/* Raw data */}
        <View className="bg-surface p-4">
          <Text className="text-lg font-semibold mb-2">Raw Data</Text>
          <View className="bg-gray-100 p-3 rounded-lg">
            <Text className="text-sm font-mono">{scan.rawData}</Text>
          </View>
        </View>
      </ScrollView>
      
      {/* Delete confirmation dialog */}
      <ConfirmationDialog
        visible={showDeleteConfirm}
        title="Delete Scan"
        message="Are you sure you want to delete this scan? This action cannot be undone."
        confirmLabel="Delete"
        confirmColor="#EF4444"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </View>
  );
}
