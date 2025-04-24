import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { useScanStore } from "../../hooks/useScanStore";
import HistoryItem from "../../components/HistoryItem";
import EmptyState from "../../components/EmptyState";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { QRCodeResult } from "../../types/qrcode";

/**
 * History screen component
 * Displays a list of past QR code scans with search functionality
 */
export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const { scans, clearAllScans, removeScan } = useScanStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [selectedScan, setSelectedScan] = useState<QRCodeResult | null>(null);
  
  // Filter scans based on search query
  const filteredScans = searchQuery
    ? scans.filter(scan => 
        scan.rawData.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scan.displayData.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scan.dataType.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : scans;
  
  // Handle item press
  const handleItemPress = (scan: QRCodeResult) => {
    setSelectedScan(scan);
    router.push({
      pathname: "/scan-details",
      params: { id: scan.id }
    });
  };
  
  // Handle item delete
  const handleItemDelete = (id: string) => {
    removeScan(id);
  };
  
  // Handle clear all
  const handleClearAll = () => {
    setShowClearConfirm(true);
  };
  
  // Confirm clear all
  const confirmClearAll = () => {
    clearAllScans();
    setShowClearConfirm(false);
  };
  
  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View 
        className="px-4 pb-2 bg-surface shadow-sm"
        style={{ paddingTop: insets.top }}
      >
        <View className="flex-row items-center justify-between py-4">
          <Text className="text-2xl font-bold">Scan History</Text>
          
          {scans.length > 0 && (
            <TouchableOpacity
              className="p-2"
              onPress={handleClearAll}
            >
              <Ionicons name="trash-outline" size={24} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Search bar */}
        {scans.length > 0 && (
          <Animated.View 
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
            className="mb-2"
          >
            <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
              <Ionicons name="search-outline" size={20} color="#6B7280" />
              <TextInput
                className="flex-1 ml-2 text-base"
                placeholder="Search scans..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#6B7280"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={20} color="#6B7280" />
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        )}
      </View>
      
      {/* Scan list */}
      {scans.length === 0 ? (
        <EmptyState
          icon="time-outline"
          title="No Scan History"
          message="Scanned QR codes will appear here"
          actionLabel="Scan QR Code"
          onAction={() => router.push("/(tabs)/index")}
        />
      ) : (
        <FlatList
          data={filteredScans}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HistoryItem
              scan={item}
              onPress={() => handleItemPress(item)}
              onDelete={() => handleItemDelete(item.id)}
            />
          )}
          contentContainerStyle={{ 
            paddingBottom: insets.bottom + 16,
            paddingTop: 8,
          }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center p-8">
              <Ionicons name="search-outline" size={48} color="#9CA3AF" />
              <Text className="text-lg font-medium text-center mt-4">No results found</Text>
              <Text className="text-base text-gray-500 text-center mt-2">
                Try a different search term
              </Text>
            </View>
          }
        />
      )}
      
      {/* Clear all confirmation dialog */}
      <ConfirmationDialog
        visible={showClearConfirm}
        title="Clear All Scans"
        message="Are you sure you want to clear all scan history? This action cannot be undone."
        confirmLabel="Clear All"
        confirmColor="#EF4444"
        onConfirm={confirmClearAll}
        onCancel={() => setShowClearConfirm(false)}
      />
    </View>
  );
}
